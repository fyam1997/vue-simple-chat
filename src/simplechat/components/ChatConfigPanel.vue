<script setup lang="ts">

import {computed, inject} from "vue";
import {ChatViewModel} from "@/simplechat/components/ChatViewModel.ts";
import APIConfigDialog from "@/shared/apiconfig/APIConfigDialog.vue";
import {ChatIndex} from "@/simplechat/storage/ChatStorage.ts";

const viewModel = inject<ChatViewModel>("viewModel")
const toggleThemeIcon = computed(() => {
  return viewModel.darkTheme.value ? 'md:light_mode' : 'md:dark_mode'
})
const inputModel = viewModel.inputModel
const loading = viewModel.loading
const appVersion = __APP_VERSION__

// TODO many duplicated with api config, try extract
const store = viewModel.chatStorage
const idList = store.idList
const selectedItem = computed(() => {
  const found = idList.value.find(item => item.id === store.id.value)
  return found ?? idList.value[0]
})

function itemProps(item: ChatIndex) {
  let name = item.name
  if (!name) {
    name = "No name"
  }
  return {title: name}
}

function itemSelected(item: ChatIndex) {
  store.id.value = item.id
}

function addNewConfig() {
  const newID = Date.now()
  idList.value.push({id: newID, name: ""})
  store.id.value = newID
}

function cloneConfig() {
  // TODO think a better way for deep clone
  // TODO give each message new id
  const oldMessages = viewModel.messages.value.map(item => Object.assign({}, item))
  const newID = Date.now()
  idList.value.push({id: newID, name: ""})
  store.id.value = newID
  // TODO since watch(key, load) will try to read value from DB, if no value, it will save default value, the saving is happen after this
  setTimeout(() => {
    viewModel.messages.value = oldMessages
  }, 100)
}

function deleteConfig() {
  if (idList.value.length > 1) {
    const deleteID = store.id.value
    const index = idList.value.findIndex(item => item.id === deleteID)
    if (index !== -1) {
      idList.value.splice(index, 1)
      store.id.value = idList.value[0].id
      store.removeConfig(deleteID)
    }
  } else {
    viewModel.messages.value = []
  }
}

</script>

<template>
  <div class="d-flex flex-column ga-4 overflow-y-auto">
    <div class="d-flex flex-row align-center">
      <v-select
          variant="outlined"
          :model-value="selectedItem"
          :items="idList"
          :item-props="itemProps"
          @update:model-value="itemSelected"
          hide-details
          label="Chat"
          :disabled="loading"
      />
      <v-menu>
        <template #activator="{ props }">
          <v-btn
              v-bind="props"
              icon="md:more_vert"
              variant="plain"
              :disabled="loading"
              title="Chat options"
          />
        </template>
        <v-list>
          <v-list-item
              prepend-icon="md:note_add"
              @click="addNewConfig"
              title="Add chat"
              :disabled="loading"
          />
          <v-list-item
              prepend-icon="md:file_copy"
              @click="cloneConfig"
              title="Clone chat"
              :disabled="loading"
          />
          <v-list-item
              prepend-icon="md:delete"
              @click="deleteConfig"
              title="Delete chat"
              :disabled="loading"
          />
        </v-list>
      </v-menu>
    </div>
    <v-text-field
        label="Chat name"
        variant="outlined"
        class="flex-grow-0"
        hide-details
        v-model="selectedItem.name"
    />
    <v-divider/>
    <APIConfigDialog/>
    <v-select
        label="Role"
        prepend-icon="md:person"
        v-model="inputModel.role"
        :items="['user', 'system', 'assistant']"
        variant="underlined"
        hide-details
        density="compact"
        class="flex-grow-0"
    />
    <v-checkbox
        v-model="inputModel.generateOnSend"
        label="Generate on send"
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