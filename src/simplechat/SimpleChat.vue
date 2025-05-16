<script setup lang="ts">

import ChatMessageList from "@/simplechat/components/ChatMessageList.vue";
import ChatInputField from "@/simplechat/components/ChatInputField.vue";
import ChatToolbar from "@/simplechat/components/ChatToolbar.vue";
import ChatInputConfigRow from "@/simplechat/components/ChatInputConfigRow.vue";

</script>

<template>
  <div class="d-flex flex-column mw-800 align-self-center h-100">
    <ChatToolbar/>
    <ChatMessageList class="flex-grow-1 overflow-y-scroll"/>
    <v-divider/>
    <div class="pt-4 pb-4 flex-grow-0">
      <ChatInputConfigRow/>
      <ChatInputField/>
    </div>
  </div>
</template>

<style>
.mw-800 {
  max-width: 800px;
  width: 100%;
}
</style>
