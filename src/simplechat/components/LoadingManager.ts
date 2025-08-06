import { computed, Ref, ref } from "vue"

export class LoadingManager {
    state = ref<Record<string, boolean>>({})

    set(id: string, state: boolean) {
        this.state.value[id] = state
    }

    get(id: string): Ref<boolean> {
        return computed(() => this.state.value[id] ?? false)
    }

    remove(id: string) {
        delete this.state.value[id]
    }
}
