<script setup lang="ts">
import {computed, inject, toRaw} from "vue";
import {APIConfigIndex, APIConfigStorage} from "@/shared/apiconfig/APICondigStorage.ts";
import {getSimpleDriveFile, setSimpleDriveFile} from "@/shared/google/simple_drive_file.ts";

const store = inject<APIConfigStorage>("apiConfigStorage")
const apiConfig = store.config

const idList = store.idList
const selectedItem = computed(() => {
  const found = idList.value.find(item => item.id === store.id.value)
  return found ?? idList.value[0]
})

function itemProps(item: APIConfigIndex) {
  let name = item.name
  if (!name) {
    name = "No name"
  }
  return {title: name}
}

function itemSelected(item: APIConfigIndex) {
  store.id.value = item.id
}

function addNewConfig() {
  const newID = Date.now()
  idList.value.push({id: newID, name: ""})
  store.id.value = newID
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
    apiConfig.value = {baseURL: "", apiKey: "", model: ""}
  }
}

async function setToDrive() {
  const backup = await store.getAllConfigs()
  await setSimpleDriveFile(__GOOGLE_CLIENT_ID__, "APIConfigs.json", JSON.stringify(backup))
}

async function getFromDrive() {
  const text = await getSimpleDriveFile(__GOOGLE_CLIENT_ID__, "APIConfigs.json")
  const backup = JSON.parse(text)
  await store.setAllConfigs(backup)
  window.location.reload()
}

</script>

<template>
  <div class="d-flex flex-column ga-4">
    <div class="d-flex flex-row align-self-end">
      <v-btn
          icon="md:backup"
          variant="plain"
          @click="setToDrive"
          title="Upload to drive"
      />
      <v-btn
          icon="md:cloud_download"
          variant="plain"
          @click="getFromDrive"
          title="Download from drive"
      />
      <v-btn
          icon="md:note_add"
          variant="plain"
          @click="addNewConfig"
          title="Add config"
      />
      <v-btn
          icon="md:delete"
          variant="plain"
          @click="deleteConfig"
          title="Delete config"
      />
    </div>
    <v-select
        variant="outlined"
        :model-value="selectedItem"
        :items="idList"
        :item-props="itemProps"
        @update:model-value="itemSelected"
        hide-details
    />
    <v-text-field
        variant="outlined"
        label="Config name"
        v-model="selectedItem.name"
        class="flex-grow-0"
        hide-details
    />
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
  </div>
</template>

<style scoped>

</style>