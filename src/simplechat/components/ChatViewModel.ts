import {useLocalStorage} from "@vueuse/core";
import {ref, useTemplateRef} from "vue";
import OpenAI from "openai";
import {ChatMessageModel} from "@/simplechat/components/ChatMessageCell.vue";
import {ChatInputModel} from "@/simplechat/components/ChatInputField.vue";
import {ChatConfigModel} from "@/simplechat/components/ChatConfigDialog.vue";
import {SingleShotEvent} from "@/simplechat/components/SingleShotEvent.ts";

export class ChatViewModel {
    readonly darkTheme = useLocalStorage("app-dark-theme", true)
    readonly messages = useLocalStorage<ChatMessageModel[]>("messages-list", [])
    readonly inputModel = useLocalStorage<ChatInputModel>(
        "input-model",
        {role: "user", message: "", generateOnSend: false}
    )
    readonly apiConfig = useLocalStorage<ChatConfigModel>("api-config", {
        baseURL: "",
        apiKey: "",
        model: "",
    })

    readonly messageListRef = useTemplateRef("message-list")

    readonly loading = ref(false)

    readonly scrollEvent = new SingleShotEvent<void>()

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
        this.loading.value = true
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
                this.scrollEvent.emit()
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

    updateMessageContent(id: number, content: string) {
        const index = this.findMessageIndex(id)
        if (index !== -1) {
            this.messages.value[index].content = content
        }
    }

    updateMessageRole(id: number, role: string) {
        const index = this.findMessageIndex(id)
        if (index !== -1) {
            this.messages.value[index].role = role
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
