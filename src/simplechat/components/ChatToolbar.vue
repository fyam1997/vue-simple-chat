<script setup lang="ts">

import ChatConfigDialog, {ChatConfigModel} from "@/simplechat/components/ChatConfigDialog.vue";

defineProps<{
  apiConfig: ChatConfigModel,
  darkTheme: boolean,
}>();
const emits = defineEmits<{
  openBugReport: [],
  downloadChats: [],
  toggleDownTheme: [],
}>()

</script>

<template>
  <v-toolbar>
    <template v-slot:title>
      <ChatConfigDialog :api-config="apiConfig"/>
    </template>
    <template v-slot:append>
      <v-btn
          :icon="darkTheme ? 'md:light_mode' : 'md:dark_mode'"
          variant="plain"
          @click="emits('toggleDownTheme')"
          title="change theme"
      />
      <v-btn
          icon="md:bug_report"
          variant="plain"
          @click="emits('openBugReport')"
          title="open bug report page"
      />
      <v-btn
          icon="md:download"
          variant="plain"
          @click="emits('downloadChats')"
          title="download chats"
      />
    </template>
  </v-toolbar>
</template>

<style scoped>

</style>