import { chatData } from "@/simplechat/storage/ChatDB"

export interface ChatMessageModel {
    role: string
    content: string
    id: number
    hide: boolean
    asking: boolean // To indicate that the msg should be shown even if hide
}

export interface ChatIndex {
    id: number
    name: string
    locked: boolean // To indicate all incoming message should be hidden
}

export class ChatStorage {
    id = chatData<number>("selectedID")
    idList = chatData<ChatIndex[]>("index")
    chatMessages = chatData<ChatMessageModel[]>(0)

    async init() {
        const list = await this.idList.loadValue()
        if (list === undefined) {
            const newID = Date.now()
            await this.idList.emit([
                { id: newID, name: "", locked: false },
            ])
        }

        let id = await this.id.loadValue()
        if (id === undefined) {
            id = this.idList.lastValue![0].id // have at least one member after idList init
            await this.id.emit(id)
        }

        const messages = await this.chatMessages.setKey(id)
        if (messages === undefined) {
            await this.chatMessages.emit([])
        }
    }

    static readonly KEY = Symbol("ChatStorage")
}
