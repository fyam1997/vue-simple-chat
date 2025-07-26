import {useLocalStorage} from "@vueuse/core"
import {computed, inject, provide, ref, Ref} from "vue"
import OpenAI from "openai"
import {SingleShotEvent} from "@/simplechat/components/SingleShotEvent"
import {APIConfigModel, APIConfigStore, useSharedFlow} from "vue-f-misc"
import {ChatMessageModel, ChatStorage} from "@/simplechat/storage/Models"
import {ChatInputModel} from "@/simplechat/components/ChatInputField.vue"

export class ChatViewModel {
    id
    idList
    selectedIndex

    readonly darkTheme = useLocalStorage("app-dark-theme", true)
    readonly messages: Ref<ChatMessageModel[]>
    readonly inputModel = useLocalStorage<ChatInputModel>(
        "input-model",
        {role: "user", message: "", generateOnSend: false},
    )
    readonly apiConfig: Ref<APIConfigModel>

    readonly loading = ref(false)

    readonly scrollEvent = new SingleShotEvent<number>()
    readonly snackbarMessages = ref<string[]>([])

    constructor(public apiConfigStore: APIConfigStore, public chatStorage: ChatStorage) {
        this.apiConfig = useSharedFlow(apiConfigStore.config, {baseURL: "", apiKey: "", model: ""}, {deep: true})
        this.id = useSharedFlow(chatStorage.id, 0)
        this.idList = useSharedFlow(chatStorage.idList, [], {deep: true})
        this.messages = useSharedFlow(chatStorage.chatMessages, [], {deep: true})
        this.selectedIndex = computed(() => {
            const found = this.idList.value.find(item => item.id === this.id.value)
            return found || {id: 0, name: ""}
        })
    }

    async sendMessage() {
        if (!this.inputModel.value.message) {
            return
        }

        const newMsg = {
            role: this.inputModel.value.role,
            content: this.inputModel.value.message,
            id: Date.now(),
        }
        this.messages.value.push(newMsg)

        this.inputModel.value.message = ""
        this.scrollEvent.emit(newMsg.id)

        if (this.inputModel.value.generateOnSend) {
            await this.fetchApiResponse()
        }
    }

    async fetchApiResponse() {
        const apiConfig = this.apiConfig.value
        if (!apiConfig.baseURL || !apiConfig.model) {
            this.snackbarMessages.value.push("API configuration is empty")
            return
        }
        if (this.messages.value.length === 0) {
            this.snackbarMessages.value.push("Chat is empty")
            return
        }
        this.loading.value = true
        try {
            const client = new OpenAI({
                baseURL: this.apiConfig.value.baseURL,
                apiKey: this.apiConfig.value.apiKey,
                dangerouslyAllowBrowser: true,
            })
            // declare as any[] to suppress ChatCompletionMessageParam's warning
            const requestMessages: any[] = this.messages.value.map((msg) => {
                return {
                    role: msg.role,
                    content: msg.content,
                }
            })
            const completion = await client.chat.completions.create({
                model: this.apiConfig.value.model,
                messages: requestMessages,
                stream: true,
            })
            let firstReceived = false
            for await (const event of completion) {
                if (!firstReceived) {
                    firstReceived = true
                    // TODO keep ref of the target obj instead of flag
                    this.messages.value.push({
                        role: "assistant",
                        content: "",
                        id: Date.now(),
                    })
                }

                const lastMsg = this.messages.value.at(-1)!
                lastMsg.content += event.choices[0].delta.content
                // TODO check if in bottom->scroll, above for 32px-> no scroll
                this.scrollToBottom()
            }
        } catch (e) {
            this.snackbarMessages.value.push("Translation fail")
            console.error(e)
        }
        this.loading.value = false
    }

    deleteMessage(id: number) {
        const index = this.findMessageIndex(id)
        if (index !== -1) {
            const list = this.messages.value
            const isLast = index === list.length - 1
            if (isLast && list.length > 1) {
                // If scrolled to bottom and remove last item, container size change isn't smooth
                const newLast = list[index - 1]
                this.scrollEvent.emit(newLast.id)
            }
            list.splice(index, 1)
        }
    }

    insertBefore(id: number) {
        const index = this.findMessageIndex(id)
        if (index !== -1) {
            const newMsg = {
                role: this.inputModel.value.role,
                content: this.inputModel.value.message,
                id: Date.now(),
            }
            this.messages.value.splice(index, 0, newMsg)
            this.inputModel.value.message = ""
        }
    }

    findMessageIndex(id: number) {
        return this.messages.value.findIndex((msg) => msg.id === id)
    }

    downloadChats() {
        const blob = new Blob([JSON.stringify(this.messages.value)], {type: "application/json"})
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "chats.json"
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
        this.id.value = id
        await this.chatStorage.chatMessages.setKey(id)
        this.scrollToBottom()
    }

    async addChat() {
        const newID = Date.now()
        this.idList.value.push({id: newID, name: "New Chat " + newID})
        await this.selectChat(newID)
        this.messages.value = []
    }

    async cloneChat() {
        const oldMessages = this.messages.value.map(item => ({...item, id: Date.now() + Math.random()}))
        const newID = Date.now()
        const baseName = this.selectedIndex.value.name
        let count = 1
        let newChatName = `${baseName} (${count})`
        while (this.idList.value.some(item => item.name === newChatName)) {
            count++
            newChatName = `${baseName} (${count})`
        }
        this.idList.value.push({id: newID, name: newChatName})
        await this.selectChat(newID)
        this.messages.value = oldMessages
    }

    async deleteChat() {
        const deleteID = this.id.value
        await this.chatStorage.chatMessages.delete()
        const list = this.idList.value
        const index = list.findIndex(item => item.id === deleteID)
        if (list.length === 1) {
            await this.addChat()
        }
        list.splice(index, 1)
        const newIndex = Math.min(index, list.length - 1)
        const newID = list[newIndex].id
        await this.selectChat(newID)
    }

    scrollToBottom() {
        const lastMsg = this.messages.value.at(-1)
        if (lastMsg) {
            this.scrollEvent.emit(lastMsg.id)
        }
    }

    static readonly KEY = Symbol("ChatViewModel")

    static injectOrCreate(apiConfigStore?: APIConfigStore, chatStorage?: ChatStorage): ChatViewModel {
        const factory = () => {
            const apiStore = apiConfigStore ?? inject<APIConfigStore>(APIConfigStore.KEY)
            const chatStore = chatStorage ?? inject<ChatStorage>(ChatStorage.KEY)
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
