import { useLocalStorage, useWindowSize } from "@vueuse/core"
import { computed, inject, provide, ref, Ref } from "vue"
import {
    APIConfigModel,
    APIConfigStore,
    SharedFlow,
    useSharedFlow,
} from "vue-f-misc"
import {
    ChatIndex,
    ChatMessageModel,
    ChatStorage,
} from "@/simplechat/storage/Models"
import { ChatInputModel } from "@/simplechat/components/ChatInputField.vue"
import OpenAI from "openai"
import { chatData } from "@/simplechat/storage/ChatDB"
import { marked } from "marked"
import markedShiki from "marked-shiki"
import { codeToHtml } from "shiki"
import { LoadingManager } from "@/simplechat/components/LoadingManager"

export class ChatViewModel {
    id
    idList
    selectedIndex

    get chatLocked() {
        return this.selectedIndex.value.locked
    }

    readonly darkTheme = useLocalStorage("app-dark-theme", true)
    readonly messages: Ref<ChatMessageModel[]>
    readonly inputModel = useLocalStorage<ChatInputModel>("input-model", {
        message: "",
    })
    readonly apiConfig: Ref<APIConfigModel>

    readonly showHidden = ref(false)
    readonly loadingManager = new LoadingManager()
    stopGenerationFlag = false

    readonly scrollEvent = new SharedFlow<void>()
    readonly snackbarMessages = ref<string[]>([])

    screenWidth = useWindowSize().width
    largeScreen = computed(() => this.screenWidth.value >= 950)
    codeTheme = computed(() => {
        return this.darkTheme.value ? "min-dark" : "min-light"
    })

    constructor(
        public apiConfigStore: APIConfigStore,
        public chatStorage: ChatStorage,
    ) {
        this.apiConfig = useSharedFlow(
            apiConfigStore.config,
            { baseURL: "", apiKey: "", model: "" },
            { deep: true },
        )
        this.id = useSharedFlow(chatStorage.id, 0)
        this.idList = useSharedFlow(chatStorage.idList, [], {
            deep: true,
        })
        this.messages = useSharedFlow(chatStorage.chatMessages, [], {
            deep: true,
        })
        this.selectedIndex = computed(() => {
            const found = this.idList.value.find(
                (item) => item.id === this.id.value,
            )
            return found || { id: 0, name: "", locked: false }
        })
    }

    async init() {
        const codeTheme = this.codeTheme
        marked.setOptions({ breaks: true, async: true }).use(
            markedShiki({
                async highlight(code, lang) {
                    return codeToHtml(code, {
                        lang: lang,
                        theme: codeTheme.value,
                    })
                },
            }),
        )
        await Promise.all([this.apiConfigStore.init(), this.chatStorage.init()])
        await this.scrollToBottom()
    }

    async sendMessage() {
        if (this.inputModel.value.message) {
            this.messages.value.forEach((msg) => {
                if (msg.role === "user") msg.asking = false
            })
            const newMsg = {
                role: "user",
                content: this.inputModel.value.message,
                id: Date.now(),
                hide: this.chatLocked,
                asking: this.chatLocked,
            }
            this.messages.value.push(newMsg)

            this.inputModel.value.message = ""

            await this.scrollToBottom()
        }
        await this.fetchApiResponse()
    }

    async fetchApiResponse() {
        this.loadingManager.set("global", true)
        this.messages.value.forEach((msg) => {
            if (msg.role === "assistant") msg.asking = false
        })

        this.editedMessages()
        const apiConfig = this.apiConfig.value
        if (!apiConfig.baseURL || !apiConfig.model) {
            this.snackbarMessages.value.push("API configuration is empty")
            return
        }
        if (this.messages.value.length === 0) {
            this.snackbarMessages.value.push("Chat is empty")
            return
        }
        try {
            this.messages.value.push({
                role: "assistant",
                content: "",
                id: Date.now(),
                hide: this.chatLocked,
                asking: this.chatLocked,
            })

            const receivedMsg = this.messages.value.at(-1)!
            for await (const char of this.fetchChatCompletion()) {
                if (this.stopGenerationFlag) {
                    this.stopGenerationFlag = false
                    break
                }
                receivedMsg.content += char
            }
        } catch (e) {
            this.snackbarMessages.value.push("Translation fail")
            console.error(e)
        }
        this.loadingManager.set("global", false)
    }

    async *fetchChatCompletion(): AsyncGenerator<string> {
        const client = this.getOpenAIClient()
        const requestMessages = this.getRequestMessages()
        const completion = await client.chat.completions.create({
            model: this.apiConfig.value.model,
            messages: requestMessages,
            stream: true,
        })
        for await (const event of completion) {
            yield* event.choices[0].delta.content ?? ""
        }
    }

    // declare as any[] to suppress ChatCompletionMessageParam's warning
    async generateTitle() {
        this.loadingManager.set("title", true)
        const client = this.getOpenAIClient()
        const requestMessages = this.getRequestMessages()
        requestMessages.push({
            role: "system",
            content:
                "Summarize this conversation in a short, descriptive title, directly output the title, DO NOT add any description or decoration, DO NOT add quotations",
        })
        const completion = await client.chat.completions.create({
            model: this.apiConfig.value.model,
            messages: requestMessages,
        })
        this.selectedIndex.value.name =
            completion.choices[0].message.content ?? ""
        this.loadingManager.set("title", false)
    }

    getOpenAIClient() {
        return new OpenAI({
            baseURL: this.apiConfig.value.baseURL,
            apiKey: this.apiConfig.value.apiKey,
            dangerouslyAllowBrowser: true,
        })
    }

    getRequestMessages(): any[] {
        return this.messages.value
            .filter((msg) => !msg.hide || msg.asking)
            .map((msg) => {
                return {
                    role: msg.role,
                    content: msg.content,
                }
            })
    }

    async deleteMessage(id: number) {
        this.editedMessages()
        const index = this.findMessageIndex(id)
        if (index !== -1) {
            const list = this.messages.value
            list.splice(index, 1)
        }
    }

    async insertMessage(id?: number) {
        this.editedMessages()
        const newMsg = {
            role: "user",
            content: "",
            id: Date.now(),
            hide: false,
            asking: false,
        }
        if (id !== undefined) {
            const index = this.findMessageIndex(id)
            this.messages.value.splice(index, 0, newMsg)
        } else if (this.showHidden.value) {
            this.messages.value.push(newMsg)
        } else {
            const lastVisibleIndex = this.messages.value.findLastIndex(
                (msg) => !msg.hide || msg.asking,
            )
            if (lastVisibleIndex !== -1) {
                this.messages.value.splice(lastVisibleIndex + 1, 0, newMsg)
            } else {
                this.messages.value.push(newMsg)
            }
        }
    }

    findMessageIndex(id: number) {
        return this.messages.value.findIndex((msg) => msg.id === id)
    }

    downloadChats() {
        const blob = new Blob([JSON.stringify(this.messages.value)], {
            type: "application/json",
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${this.selectedIndex.value.name}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    openBugReport() {
        window.open("https://github.com/fyam1997/vue-simple-chat", "_blank")
    }

    toggleDarkTheme() {
        this.darkTheme.value = !this.darkTheme.value
    }

    async selectChat(id: number) {
        if (this.id.value === id) {
            return
        }
        this.id.value = id
        await this.chatStorage.chatMessages.setKey(id)
        await this.scrollToBottom()
    }

    async addChat(name?: string) {
        const newID = Date.now()
        this.idList.value.unshift({
            id: newID,
            name: name ?? "",
            locked: false,
        })
        await this.selectChat(newID)
        // manually calling storage since [] same as default, won't trigger vue's watch
        await this.chatStorage.chatMessages.emit([])
    }

    async cloneChat(index: ChatIndex) {
        const target = chatData<ChatMessageModel[]>(index.id)
        const oldMessages = await target.loadValue()
        await this.addChat(this.getClonedChatName(index.name))
        // useSharedFlow kind of buggy, directly emit to prevent dead loop
        await this.chatStorage.chatMessages.emit(oldMessages!)
    }

    getClonedChatName(baseName: string) {
        let newChatName: string
        let count = 1
        do {
            newChatName = `${baseName} (${count})`
            count++
        } while (this.idList.value.some((item) => item.name === newChatName))
        return newChatName
    }

    async deleteChat(index: ChatIndex) {
        const deleteID = index.id
        await chatData<ChatMessageModel[]>(deleteID).delete()

        const list = this.idList.value
        const listIndex = list.findIndex((item) => item.id === deleteID)
        list.splice(listIndex, 1)

        if (list.length === 0) {
            await this.addChat()
        } else {
            const newIndex = Math.min(listIndex, list.length - 1)
            const newID = list[newIndex].id
            await this.selectChat(newID)
        }
    }

    async scrollToBottom() {
        await this.scrollEvent.emit(undefined)
    }

    editedMessages() {
        if (this.idList.value[0].id !== this.selectedIndex.value.id) {
            const idx = this.idList.value.findIndex(
                (item) => item.id === this.selectedIndex.value.id,
            )
            const [item] = this.idList.value.splice(idx, 1)
            this.idList.value.unshift(item)
        }
    }

    stopGenerate() {
        this.stopGenerationFlag = true
        this.loadingManager.set("global", false)
    }

    static readonly KEY = Symbol("ChatViewModel")

    static injectOrCreate(
        apiConfigStore?: APIConfigStore,
        chatStorage?: ChatStorage,
    ): ChatViewModel {
        const factory = () => {
            const apiStore =
                apiConfigStore ?? inject<APIConfigStore>(APIConfigStore.KEY)
            const chatStore =
                chatStorage ?? inject<ChatStorage>(ChatStorage.KEY)
            if (!apiStore || !chatStore) {
                throw new Error("please provide APIConfigStore and ChatStorage")
            }
            const viewModel = new ChatViewModel(apiStore, chatStore)
            provide(ChatViewModel.KEY, viewModel)
            return viewModel
        }
        return inject<ChatViewModel>(ChatViewModel.KEY, factory, true)
    }
}
