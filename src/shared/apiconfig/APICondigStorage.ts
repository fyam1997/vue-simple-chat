import {ref} from "vue";
import {getSharedData, removeSharedData, setSharedData, sharedData, SharedStore} from "@/shared/db/SharedStorage.ts";

export interface APIConfigModel {
    baseURL: string
    apiKey: string
    model: string
}

export interface APIConfigIndex {
    id: number
    name: string
}

export interface APIConfigBackup {
    configs: {
        config: APIConfigModel,
        index: APIConfigIndex,
    }[]
}

export class APIConfigStorage {
    id = sharedData<number>(
        ref("selectedID"),
        0,
        SharedStore.APIConfig,
    )
    idList = sharedData<APIConfigIndex[]>(
        ref("index"),
        [{id: 0, name: "Default"}],
        SharedStore.APIConfig,
    )
    config = sharedData<APIConfigModel>(
        this.id,
        {baseURL: "", apiKey: "", model: ""},
        SharedStore.APIConfig,
    )

    async getAllConfigs(): Promise<APIConfigBackup> {
        const configs = []
        for (const index of this.idList.value) {
            const config = await getSharedData(index.id, SharedStore.APIConfig)
            configs.push({
                index: index,
                config: config
            })
        }
        return {configs: configs}
    }

    async setAllConfigs(backup: APIConfigBackup): Promise<void> {
        for (const item of backup.configs) {
            const existingIndex = this.idList.value.findIndex(i => i.id === item.index.id)
            if (existingIndex !== -1) {
                this.idList.value[existingIndex] = item.index
            } else {
                this.idList.value.push(item.index)
            }
            await setSharedData(item.index.id, SharedStore.APIConfig, item.config)
        }
    }

    removeConfig(id: number) {
        removeSharedData(id, SharedStore.APIConfig).catch(console.error)
    }
}
