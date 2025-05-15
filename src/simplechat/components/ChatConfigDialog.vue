<script setup lang="ts">
import {inject} from "vue";
import {ChatViewModel} from "@/simplechat/components/ChatViewModel.ts";

export interface ChatConfigModel {
  baseURL: string
  apiKey: string
  model: string
}
const viewModel = inject<ChatViewModel>("viewModel")
const apiConfig = viewModel.apiConfig

</script>

<template>
  <v-dialog
      transition="dialog-top-transition"
      width="auto"
  >
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
          v-bind="activatorProps"
          class="text-none"
          :text="apiConfig.model ? apiConfig.model : 'Select a model'"
          append-icon="md:arrow_drop_down"
      />
    </template>
    <template v-slot:default="{ isActive }">
      <v-card class="pa-4 d-flex flex-column ga-2 dialog-card">
        <v-alert class="mb-4" border="start">
          Configuration is only saved in the browser.
          Please clear API key before leave if you are using public devices.
        </v-alert>
        <v-text-field
            variant="outlined"
            label="BaseURL"
            v-model="apiConfig.baseURL"
        />
        <v-text-field
            variant="outlined"
            label="ApiKey"
            type="password"
            v-model="apiConfig.apiKey"
        />
        <v-text-field
            variant="outlined"
            label="Model"
            v-model="apiConfig.model"
        />
        <v-btn
            variant="plain"
            text="Done"
            @click="isActive.value = false"
        ></v-btn>
      </v-card>
    </template>
  </v-dialog>
</template>

<style scoped>
.dialog-card {
  max-width: 600px;
}
</style>
