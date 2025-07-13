import {openDB} from "idb"
import {cachedDB, DBDataFlow} from "vue-f-misc"

export enum ChatStore {
    ChatMessages = "ChatMessages",
}

const chatDB = cachedDB(() => {
    return openDB("Chat", 1, {
        upgrade(db) {
            db.createObjectStore(ChatStore.ChatMessages)
        },
    })
})

export function chatData<T>(key: string | number) {
    return new DBDataFlow<T>(chatDB, ChatStore.ChatMessages, key)
}
