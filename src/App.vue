<script setup lang="ts">
import { computed, onMounted, provide, ref } from "vue"
import { APIConfigStore } from "vue-f-misc"
import ChatMessagePanel from "@/simplechat/components/ChatMessagePanel.vue"
import ChatConfigPanel from "@/simplechat/components/ChatConfigPanel.vue"
import { GlobalEvents } from "vue-global-events"
import { ChatViewModel } from "@/simplechat/components/ChatViewModel"
import { ChatStorage } from "@/simplechat/storage/Models"

const apiConfigStore = new APIConfigStore(__GOOGLE_CLIENT_ID__)
provide(APIConfigStore.KEY, apiConfigStore)

const chatStorage = new ChatStorage()
provide(ChatStorage.KEY, chatStorage)

const viewModel = ChatViewModel.injectOrCreate(apiConfigStore, chatStorage)
onMounted(() => viewModel.init())
const loading = viewModel.loading

const theme = computed(() => {
    return viewModel.darkTheme.value ? "dark" : "light"
})

const tab = ref("chat-panel")

function regenerate() {
    if (!loading.value && confirm("Regenerate?")) {
        viewModel.fetchApiResponse()
    }
}

function beforeUnloadHandler(event: BeforeUnloadEvent) {
    if (loading.value) {
        event.preventDefault()
    }
}

window.addEventListener("beforeunload", beforeUnloadHandler)
</script>

<template>
    <v-app :theme="theme">
        <GlobalEvents @keyup.ctrl.enter.exact.prevent="regenerate" />
        <v-snackbar-queue
            v-model="viewModel.snackbarMessages.value"
            location="top"
        ></v-snackbar-queue>
        <div v-if="!viewModel.largeScreen.value" class="w-100 h-100 d-flex flex-column">
            <div>
                <v-tabs v-model="tab" fixed-tabs class="flex-grow-0">
                    <v-tab value="config-panel" class="text-none">Config</v-tab>
                    <v-tab value="chat-panel" class="text-none">Chats</v-tab>
                </v-tabs>
            </div>
            <v-divider />
            <v-window v-model="tab" class="h-100 flex-grow-1" swipeable>
                <v-window-item value="config-panel" class="h-100">
                    <ChatConfigPanel class="h-100" />
                </v-window-item>

                <v-window-item value="chat-panel" class="h-100">
                    <ChatMessagePanel class="h-100" />
                </v-window-item>
            </v-window>
        </div>

        <div v-else class="w-100 h-100 d-flex flex-row ga-2 justify-center">
            <ChatConfigPanel class="config-panel-large w-100 h-100" />
            <v-divider vertical class="mt-4 mb-4" />
            <ChatMessagePanel class="chat-panel-large flex-grow-1 h-100 pb-4" />
        </div>
    </v-app>
</template>

<style scoped>
.config-panel-large {
    max-width: 400px;
}

.chat-panel-large {
    max-width: 600px;
}
</style>
