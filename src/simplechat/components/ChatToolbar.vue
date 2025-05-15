<script setup lang="ts">

import ChatConfigDialog, {ChatConfigModel} from "@/simplechat/components/ChatConfigDialog.vue";
import {useWindowSize} from '@vueuse/core';
import {computed} from "vue";

defineProps<{
  apiConfig: ChatConfigModel,
  darkTheme: boolean,
}>()
const emits = defineEmits<{
  openBugReport: [],
  downloadChats: [],
  toggleDownTheme: [],
}>()
const screenWidth = useWindowSize().width
const largeScreen = computed(() => screenWidth.value > 425)

</script>

<template>
  <v-toolbar>
    <template v-slot:title>
      <ChatConfigDialog :api-config="apiConfig"/>
    </template>
    <template v-slot:append v-if="largeScreen">
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
    <template v-slot:append v-if="!largeScreen">
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
              icon="md:more_vert"
              variant="plain"
              v-bind="props"
              title="more"
          />
        </template>
        <v-list>
          <v-list-item
              :prepend-icon="darkTheme ? 'md:light_mode' : 'md:dark_mode'"
              @click="emits('toggleDownTheme')"
              title="Change theme"
              class="text-none"
          />
          <v-list-item
              prepend-icon="md:bug_report"
              @click="emits('openBugReport')"
              title="Bug report"
              class="text-none"
          />
          <v-list-item
              prepend-icon="md:download"
              @click="emits('downloadChats')"
              title="Download"
              class="text-none"
          />
        </v-list>
      </v-menu>
    </template>
  </v-toolbar>
</template>

<style scoped>

</style>