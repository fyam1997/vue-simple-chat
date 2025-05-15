<script setup lang="ts">
import SimpleChat from "@/simplechat/SimpleChat.vue";
import {ChatViewModel} from "@/simplechat/components/ChatViewModel.ts";
import {provide} from "vue";

const viewModel = new ChatViewModel()
provide("viewModel", viewModel)

</script>

<template>
  <SimpleChat id="app-root"/>
</template>

<style scoped>
</style>
