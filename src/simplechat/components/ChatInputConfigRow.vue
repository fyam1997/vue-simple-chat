<script setup lang="ts">
import {inject} from "vue";
import {ChatViewModel} from "@/simplechat/components/ChatViewModel.ts";

const viewModel = inject<ChatViewModel>("viewModel")
const inputModel = viewModel.inputModel
const loading = viewModel.loading

</script>

<template>
  <div class="d-flex flex-row align-center ga-2 flex-wrap justify-center">
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
    <v-checkbox-btn
        v-model="inputModel.generateOnSend"
        label="Generate on send"
        :disabled="loading"
        hide-details
        color="primary"
    />
    <v-btn
        class="text-none flex-grow-0"
        icon="md:chat_bubble"
        variant="plain"
        title="Generate Response"
        :disabled="loading"
        @click="viewModel.fetchApiResponse()"
    />
  </div>
</template>

<style scoped>

</style>