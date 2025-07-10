import {Ref, ref} from "vue";
import {openDB} from "idb";
import {useIndexedDB} from "@/shared/db/DatabaseUtils.ts";

// TODO many duplicated with api config, try extract
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
    id = chatData<number>(
        ref("selectedID"),
        0,
    )
    idList = chatData<ChatIndex[]>(
        ref("index"),
        [{id: 0, name: "Default"}],
    )
    chatMessages = chatData<ChatMessageModel[]>(
        this.id,
        [],
    )

    removeConfig(id: number) {
        removeChatData(id).catch(console.error)
    }
}

export enum ChatStore {
    ChatMessages = "ChatMessages",
}

function chatDB() {
    return openDB("Chat", 1, {
        upgrade(db) {
            db.createObjectStore(ChatStore.ChatMessages)
        },
    })
}

export function chatData<T>(id: Ref<string | number>, defaultValue: T, debounce: number = null) {
    return useIndexedDB(
        id,
        defaultValue,
        chatDB,
        {
            store: ChatStore.ChatMessages,
            db: "Chat",
            debounce: debounce,
            deep: true,
        },
    )
}

export async function removeChatData(id: string | number) {
    const db = await chatDB()
    await db.delete(ChatStore.ChatMessages, id)
}
