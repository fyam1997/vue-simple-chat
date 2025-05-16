<script setup lang="ts">
import SimpleChat from "@/simplechat/SimpleChat.vue";
import {ChatViewModel} from "@/simplechat/components/ChatViewModel.ts";
import {computed, provide} from "vue";
import {useWindowSize} from "@vueuse/core";
import ChatConfigPanel from "@/simplechat/components/ChatConfigPanel.vue";

const viewModel = new ChatViewModel()
provide("viewModel", viewModel)

const theme = computed(() => {
  return viewModel.darkTheme.value ? 'dark' : 'light'
})

const screenWidth = useWindowSize().width
const largeScreen = computed(() => screenWidth.value >= 768)
provide("largeScreen", largeScreen)

</script>

<template>
  <v-app :theme="theme">
    <div class="d-flex flex-row  w-100 h-100 ga-2 justify-center">
      <ChatConfigPanel v-if="largeScreen" class="config-panel h-100 flex-grow-1 pa-4"/>
      <v-divider v-if="largeScreen" vertical class="mt-4 mb-4"/>
      <SimpleChat class="chat-panel h-100 flex-grow-1"/>
    </div>
  </v-app>
</template>

<style scoped>
.config-panel {
  max-width: 300px;
}

.chat-panel {
  max-width: 600px;
}
</style>
