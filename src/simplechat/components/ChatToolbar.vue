<script setup lang="ts">

import ChatConfigDialog from "@/simplechat/components/ChatConfigDialog.vue";
import {computed, inject} from "vue";
import {ChatViewModel} from "@/simplechat/components/ChatViewModel.ts";

const viewModel = inject<ChatViewModel>("viewModel")

const apiConfig = viewModel.apiConfig
const toggleThemeIcon = computed(() => {
  return viewModel.darkTheme.value ? 'md:light_mode' : 'md:dark_mode'
})

const appVersion = __APP_VERSION__

</script>

<template>
  <v-toolbar>
    <template v-slot:title>
      <ChatConfigDialog :api-config="apiConfig"/>
    </template>
    <template v-slot:append>
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
          <v-list-item :subtitle="'version: '+appVersion"/>
        </v-list>
      </v-menu>
    </template>
  </v-toolbar>
</template>

<style scoped>

</style>