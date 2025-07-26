<script setup lang="ts">

import {computed} from "vue";
import {ChatViewModel} from "@/simplechat/components/ChatViewModel"
import {APIConfigDialog} from "vue-f-misc";

const viewModel = ChatViewModel.injectOrCreate()
const toggleThemeIcon = computed(() => {
  return viewModel.darkTheme.value ? 'md:light_mode' : 'md:dark_mode'
})
const inputModel = viewModel.inputModel
const loading = viewModel.loading
const selectedIndex = viewModel.selectedIndex
const appVersion = __APP_VERSION__
const idList = viewModel.idList

function onIndexSelected(value: any) {
  if (value && typeof value === "object" && "id" in value) {
    viewModel.selectChat(value.id)
  }
}

</script>

<template>
  <div class="d-flex flex-column ga-4 overflow-y-auto pa-4">
    <APIConfigDialog/>
    <v-btn
        prepend-icon="md:note_add"
        @click="viewModel.addChat()"
        text="Start New Chat"
        :disabled="loading"
        variant="outlined"
        class="text-none w-100"
    />
    <v-text-field
        label="Chat name"
        variant="outlined"
        class="flex-grow-0"
        hide-details
        v-model="selectedIndex.name"
    />
    <v-list class="flex-grow-1">
      <v-list-item
          v-for="index in idList"
          :title="index.name"
          :key="index.id"
          :active="selectedIndex.id === index.id"
          @click="viewModel.selectChat(index.id)"
      >
        <div
            class="d-flex flex-row"
            v-if="selectedIndex.id === index.id"
        >
          <v-icon-btn
              icon="md:file_copy"
              @click.stop="viewModel.cloneChat(index)"
              title="Clone chat"
              :disabled="loading"
              variant="text"
          />
          <v-icon-btn
              icon="md:delete"
              @click.stop="viewModel.deleteChat(index)"
              title="Delete chat"
              :disabled="loading"
              variant="text"
          />
        </div>
      </v-list-item>
    </v-list>

    <v-divider/>

    <div class="d-flex flex-row justify-end flex-wrap">
      <v-label class="text-caption pl-2" :text="'version: '+appVersion"/>
      <v-spacer/>
      <v-icon-btn
          :icon="toggleThemeIcon"
          @click="viewModel.toggleDarkTheme()"
          title="Change theme"
          variant="plain"
      />
      <v-icon-btn
          icon="md:bug_report"
          @click="viewModel.openBugReport()"
          title="Bug report"
          variant="plain"
      />
    </div>
  </div>
</template>

<style scoped>

</style>