<script setup lang="ts">

import {computed, inject} from "vue";
import {ChatViewModel} from "@/simplechat/components/ChatViewModel.ts";

const viewModel = inject<ChatViewModel>("viewModel")

const apiConfig = viewModel.apiConfig
const toggleThemeIcon = computed(() => {
  return viewModel.darkTheme.value ? 'md:light_mode' : 'md:dark_mode'
})
const inputModel = viewModel.inputModel
const loading = viewModel.loading
const appVersion = __APP_VERSION__

</script>

<template>
  <div class="d-flex flex-column ga-4 overflow-y-auto">
    <div>
      <v-alert border="start">
        Configuration is only saved in the browser.
        Please clear API key before leave if you are using public devices.
      </v-alert>
    </div>
    <v-text-field
        variant="outlined"
        label="BaseURL"
        v-model="apiConfig.baseURL"
        class="flex-grow-0"
        hide-details
    />
    <v-text-field
        variant="outlined"
        label="ApiKey"
        type="password"
        v-model="apiConfig.apiKey"
        class="flex-grow-0"
        hide-details
    />
    <v-text-field
        variant="outlined"
        label="Model"
        v-model="apiConfig.model"
        class="flex-grow-0"
        hide-details
    />
    <v-select
        label="Role"
        prepend-icon="md:person"
        v-model="inputModel.role"
        :items="['user', 'system', 'assistant']"
        variant="underlined"
        hide-details
        density="compact"
        :disabled="loading"
        class="flex-grow-0"
    />
    <v-checkbox
        v-model="inputModel.generateOnSend"
        label="Generate on send"
        :disabled="loading"
        hide-details
    />

    <v-spacer/>
    <v-divider/>

    <v-list-item
        :prepend-icon="toggleThemeIcon"
        @click="viewModel.toggleDarkTheme()"
        title="Change theme"
        class="text-none"
        density="compact"
    />
    <v-list-item
        prepend-icon="md:bug_report"
        @click="viewModel.openBugReport()"
        title="Bug report"
        class="text-none"
        density="compact"
    />
    <v-list-item
        prepend-icon="md:download"
        @click="viewModel.downloadChats()"
        title="Download"
        class="text-none"
        density="compact"
    />
    <v-list-item :subtitle="'version: '+appVersion"/>
  </div>
</template>

<style scoped>

</style>