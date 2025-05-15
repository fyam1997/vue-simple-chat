<script setup lang="ts">
import SimpleChat from "@/simplechat/SimpleChat.vue";
import {ChatViewModel} from "@/simplechat/components/ChatViewModel.ts";
import {computed, provide} from "vue";

const viewModel = new ChatViewModel()
provide("viewModel", viewModel)

const theme = computed(() => {
  return viewModel.darkTheme.value ? 'dark' : 'light'
})
</script>

<template>
  <v-app :theme="theme">
    <SimpleChat id="app-root"/>
  </v-app>
</template>

<style scoped>
</style>
