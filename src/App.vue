<script setup lang="ts">
import {computed, onMounted, provide, ref} from "vue"
import {useWindowSize} from "@vueuse/core"
import {APIConfigStore} from 'vue-f-misc'
import ChatMessagePanel from "@/simplechat/components/ChatMessagePanel.vue"
import ChatConfigPanel from "@/simplechat/components/ChatConfigPanel.vue"
import {GlobalEvents} from 'vue-global-events'
import {ChatViewModel} from "@/simplechat/components/ChatViewModel"
import {ChatStorage} from "@/simplechat/storage/Models"

const apiConfigStore = new APIConfigStore(__GOOGLE_CLIENT_ID__)
provide(APIConfigStore.KEY, apiConfigStore)
onMounted(() => apiConfigStore.init())

const chatStorage = new ChatStorage()
provide(ChatStorage.KEY, chatStorage)
onMounted(() => chatStorage.init())

const viewModel = ChatViewModel.injectOrCreate(apiConfigStore, chatStorage)

const theme = computed(() => {
    return viewModel.darkTheme.value ? 'dark' : 'light'
})

const screenWidth = useWindowSize().width
const largeScreen = computed(() => screenWidth.value >= 950)

const tab = ref("chat-panel")

function regenerate() {
    if (confirm("Regenerate?")) {
        viewModel.fetchApiResponse()
    }
}

</script>

<template>
    <v-app :theme="theme">
        <GlobalEvents @keyup.ctrl.enter.exact.prevent="regenerate"/>
        <v-snackbar-queue v-model="viewModel.snackbarMessages.value" location="top"></v-snackbar-queue>
        <div v-if="!largeScreen" class="w-100 h-100 d-flex flex-column">
            <div>
                <v-tabs
                    v-model="tab"
                    fixed-tabs
                    class="flex-grow-0"
                >
                    <v-tab value="config-panel" class="text-none">Config</v-tab>
                    <v-tab value="chat-panel" class="text-none">Chats</v-tab>
                </v-tabs>
            </div>
            <v-divider/>
            <v-tabs-window v-model="tab" class="h-100 flex-grow-1">
                <v-tabs-window-item value="config-panel" class="h-100">
                    <ChatConfigPanel class="h-100 pa-4"/>
                </v-tabs-window-item>

                <v-tabs-window-item value="chat-panel" class="h-100">
                    <ChatMessagePanel class="h-100 pl-4 pr-4"/>
                </v-tabs-window-item>
            </v-tabs-window>
        </div>

        <div v-else class="w-100 h-100 d-flex flex-row ga-2 justify-center">
            <ChatConfigPanel class="config-panel-large w-100 h-100 pa-4"/>
            <v-divider vertical class="mt-4 mb-4"/>
            <ChatMessagePanel class="chat-panel-large flex-grow-1 h-100 pl-4 pr-4 pb-4"/>
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
