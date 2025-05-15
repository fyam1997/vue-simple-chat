<script setup lang="ts">

import ChatConfigDialog from "@/simplechat/components/ChatConfigDialog.vue";
import {useWindowSize} from '@vueuse/core';
import {computed, inject} from "vue";
import {ChatViewModel} from "@/simplechat/components/ChatViewModel.ts";

const screenWidth = useWindowSize().width
const largeScreen = computed(() => screenWidth.value >= 425)

const viewModel = inject<ChatViewModel>("viewModel")

const apiConfig = viewModel.apiConfig
const toggleThemeIcon = computed(() => {
  return viewModel.darkTheme.value ? 'md:light_mode' : 'md:dark_mode'
})

</script>

<template>
  <v-toolbar>
    <template v-slot:title>
      <ChatConfigDialog :api-config="apiConfig"/>
    </template>
    <template v-slot:append v-if="largeScreen">
      <v-btn
          :icon="toggleThemeIcon"
          variant="plain"
          @click="viewModel.toggleDarkTheme()"
          title="change theme"
      />
      <v-btn
          icon="md:bug_report"
          variant="plain"
          @click="viewModel.openBugReport()"
          title="open bug report page"
      />
      <v-btn
          icon="md:download"
          variant="plain"
          @click="viewModel.downloadChats()"
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
              :prepend-icon="toggleThemeIcon"
              @click="viewModel.toggleDarkTheme()"
              title="Change theme"
              class="text-none"
          />
          <v-list-item
              prepend-icon="md:bug_report"
              @click="viewModel.openBugReport()"
              title="Bug report"
              class="text-none"
          />
          <v-list-item
              prepend-icon="md:download"
              @click="viewModel.downloadChats()"
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