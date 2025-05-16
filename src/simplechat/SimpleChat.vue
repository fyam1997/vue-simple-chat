<script setup lang="ts">

import ChatMessageList from "@/simplechat/components/ChatMessageList.vue";
import ChatInputField from "@/simplechat/components/ChatInputField.vue";

</script>

<template>
  <div class="d-flex flex-column align-self-center">
    <ChatMessageList class="flex-grow-1 overflow-y-scroll"/>
    <v-divider/>
    <ChatInputField class="pt-4 flex-grow-0"/>
  </div>
</template>

<style>

</style>
