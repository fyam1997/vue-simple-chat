<script setup lang="ts">

import ChatMessageList from "@/simplechat/components/ChatMessageList.vue";
import ChatInputField from "@/simplechat/components/ChatInputField.vue";
import ChatToolbar from "@/simplechat/components/ChatToolbar.vue";
import {inject} from "vue";
import ChatInputConfigRow from "@/simplechat/components/ChatInputConfigRow.vue";

const largeScreen = inject<number>("largeScreen")

</script>

<template>
  <div class="d-flex flex-column align-self-center">
    <ChatToolbar v-if="!largeScreen"/>
    <ChatMessageList class="flex-grow-1 overflow-y-scroll"/>
    <v-divider/>
    <div class="pt-4 pb-4 flex-grow-0">
      <ChatInputConfigRow v-if="!largeScreen"/>
      <ChatInputField/>
    </div>
  </div>
</template>

<style>

</style>
