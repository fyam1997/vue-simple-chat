<script setup lang="ts">
import ChatMessagePanel from "@/simplechat/components/ChatMessagePanel.vue";
import {ChatViewModel} from "@/simplechat/components/ChatViewModel.ts";
import {computed, provide, ref} from "vue";
import {useWindowSize} from "@vueuse/core";
import ChatConfigPanel from "@/simplechat/components/ChatConfigPanel.vue";
import {APIConfigStorage} from "@/shared/apiconfig/APICondigStorage.ts";
import {ChatStorage} from "@/simplechat/storage/ChatStorage.ts";

const apiConfigStorage = new APIConfigStorage()
const chatStorage = new ChatStorage()
const viewModel = new ChatViewModel(apiConfigStorage, chatStorage)
provide("viewModel", viewModel)
provide("apiConfigStorage", apiConfigStorage)

const theme = computed(() => {
  return viewModel.darkTheme.value ? 'dark' : 'light'
})

const screenWidth = useWindowSize().width
const largeScreen = computed(() => screenWidth.value >= 700)

const tab = ref("chat-panel")

</script>

<template>
  <v-app :theme="theme">
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
  max-width: 300px;
}

.chat-panel-large {
  max-width: 600px;
}
</style>
