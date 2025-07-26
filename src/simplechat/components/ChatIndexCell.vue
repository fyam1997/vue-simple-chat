<script setup lang="ts">

import {ChatViewModel} from "@/simplechat/components/ChatViewModel"
import {ChatIndex} from "@/simplechat/storage/Models"
import {computed, ref, watch} from "vue"

const props = defineProps<{
  index: ChatIndex
}>()

const viewModel = ChatViewModel.injectOrCreate()
const loading = viewModel.loading
const selectedIndex = viewModel.selectedIndex

const displayName = computed(() => {
  if (props.index.name === "") {
    return "No Name"
  } else {
    return props.index.name
  }
})

const editingName = ref(false)
const selected = computed(() => selectedIndex.value.id === props.index.id)
watch(selected, () => editingName.value = false)
</script>

<template>
  <v-list-item
      :key="index.id"
      :active="selected"
      :disabled="loading"
      @click="viewModel.selectChat(index.id)"
  >
    <template v-slot:title>
      <v-list-item-title v-if="!editingName">{{ displayName }}</v-list-item-title>
      <v-text-field
          v-else
          ref="name-edit"
          label="Chat name"
          variant="underlined"
          hide-details
          autofocus
          @keydown.enter.exact="editingName=false"
          @keydown.esc.exact="editingName=false"
          v-model="selectedIndex.name"
      />
    </template>

    <div
        class="d-flex flex-row justify-end"
        v-if="selectedIndex.id === index.id"
    >
      <v-icon-btn
          :disabled="loading"
          :icon="editingName?'md:done':'md:edit'"
          @click="editingName = !editingName"
          size="small"
          title="insert above"
          variant="plain"
      />
      <v-icon-btn
          :disabled="loading"
          @click.stop="viewModel.cloneChat(index)"
          icon="md:file_copy"
          size="small"
          title="Clone chat"
          variant="plain"
      />
      <v-divider vertical class="ma-2"/>
      <v-icon-btn
          :disabled="loading"
          @click.stop="viewModel.deleteChat(index)"
          icon="md:delete"
          size="small"
          title="Delete chat"
          variant="plain"
      />
    </div>
  </v-list-item>
</template>
