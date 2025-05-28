import {useLocalStorage} from "@vueuse/core";
import {Ref, ref} from "vue";
import OpenAI from "openai";
import {ChatInputModel} from "@/simplechat/components/ChatInputField.vue";
import {SingleShotEvent} from "@/simplechat/components/SingleShotEvent.ts";
import {APIConfigModel, APIConfigStorage} from "@/shared/apiconfig/APICondigStorage.ts";
import {ChatMessageModel, ChatStorage} from "@/simplechat/storage/ChatStorage.ts";

export class ChatViewModel {
    readonly darkTheme = useLocalStorage("app-dark-theme", true)
    readonly messages: Ref<ChatMessageModel[]>
    readonly inputModel = useLocalStorage<ChatInputModel>(
        "input-model",
        {role: "user", message: "", generateOnSend: false}
    )
    readonly apiConfig: Ref<APIConfigModel>

    readonly loading = ref(false)

    readonly scrollEvent = new SingleShotEvent<void>()
    readonly snackbarMessages = ref<string[]>([])

    constructor(apiConfigStorage: APIConfigStorage, public chatStorage: ChatStorage) {
        this.apiConfig = apiConfigStorage.config
        this.messages = chatStorage.chatMessages
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
        this.scrollEvent.emit()
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
                stream: true
            })
            let firstReceived = false
            for await (const event of completion) {
                if (!firstReceived) {
                    firstReceived = true
                    this.messages.value.push({
                        role: "assistant",
                        content: "",
                        id: Date.now(),
                    })
                }

                this.messages.value.at(-1).content += event.choices[0].delta.content
                this.scrollEvent.emit()
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
            const isLast = index === this.messages.value.length - 1
            this.messages.value.splice(index, 1)
            if (isLast) {
                // If scrolled to bottom and remove last item, container size change isn't smooth
                // TODO randomly fail
                // this.scrollEvent.emit()
            }
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
}
