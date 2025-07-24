import {chatData} from "@/simplechat/storage/ChatDB"

export interface ChatMessageModel {
    role: string
    content: string
    id: number
}

export interface ChatIndex {
    id: number
    name: string
}

export class ChatStorage {
    id = chatData<number>("selectedID")
    idList = chatData<ChatIndex[]>("index")
    chatMessages = chatData<ChatMessageModel[]>(0)

    async init() {
        // TODO might have a common class with api config index
        const list = await this.idList.loadValue()
        if (list === undefined) {
            const newID = Date.now()
            await this.idList.emit([{id: newID, name: "New Chat " + newID}])
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
