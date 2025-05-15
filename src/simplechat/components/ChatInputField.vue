<script setup lang="ts">
import {inject} from "vue";
import {ChatViewModel} from "@/simplechat/components/ChatViewModel.ts";

export interface ChatInputModel {
  message: string
  role: string
  generateOnSend: boolean
}

const viewModel = inject<ChatViewModel>("viewModel")
const inputModel = viewModel.inputModel
const loading = viewModel.loading

</script>

<template>
  <v-textarea
      variant="outlined"
      v-model="inputModel.message"
      auto-grow
      max-rows="5"
      rows="1"
      no-resize
      @keydown.enter.exact.prevent="viewModel.sendMessage()"
      density="compact"
      :clearable="!loading"
      :disabled="loading"
      hide-details
  >
    <template v-slot:prepend>
      <v-dialog
          transition="dialog-bottom-transition"
          width="auto"
      >
        <template v-slot:activator="{ props }">
          <v-icon-btn
              icon="md:more_vert"
              variant="plain"
              v-bind="props"
              title="more"
          />
        </template>
        <template v-slot:default="{ isActive }">
          <v-card class="pa-4 d-flex flex-column ga-2">
            <v-select
                label="Role"
                prepend-icon="md:person"
                v-model="inputModel.role"
                :items="['user', 'system', 'assistant']"
                variant="underlined"
                hide-details
                density="compact"
                :disabled="loading"
            />
            <v-checkbox-btn
                v-model="inputModel.generateOnSend"
                label="Generate on send"
            />
            <v-btn
                class="text-none"
                prepend-icon="md:chat_bubble"
                variant="outlined"
                text="Generate Response"
                :disabled="loading"
                @click="viewModel.fetchApiResponse()"
            />
          </v-card>
        </template>
      </v-dialog>
    </template>

    <template v-slot:append>
      <v-icon-btn
          icon="md:send"
          variant="plain"
          :loading="loading"
          title="send"
          @click="viewModel.sendMessage()"
      />
    </template>
  </v-textarea>
</template>

<style scoped>

</style>