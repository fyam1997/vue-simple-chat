<script setup lang="ts">

import {ChatViewModel} from "@/simplechat/components/ChatViewModel"
import {ChatIndex} from "@/simplechat/storage/Models"

defineProps<{
  index: ChatIndex
}>()

const viewModel = ChatViewModel.injectOrCreate()
const loading = viewModel.loading
const selectedIndex = viewModel.selectedIndex
</script>

<template>
  <v-list-item
      :title="index.name"
      :key="index.id"
      :active="selectedIndex.id === index.id"
      :disabled="loading"
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
</template>
