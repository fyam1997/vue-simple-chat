<script setup lang="ts">
export interface ChatInputModel {
  message: string
  role: string
}

defineProps<{
  inputModel: ChatInputModel,
  loading: boolean,
}>()

const emits = defineEmits<{
  sendMessage: [],
  fetchApiResponse: [],
}>()
</script>

<template>
  <v-textarea
      class="flex-grow-0 pt-4"
      variant="outlined"
      v-model="inputModel.message"
      auto-grow
      max-rows="5"
      rows="1"
      no-resize
      @keydown.enter.exact.prevent="emits('sendMessage')"
      :clearable="!loading"
      :disabled="loading"
      hide-details
  >
    <template v-slot:prepend>
      <v-select
          v-model="inputModel.role"
          :items="['user', 'system', 'assistant']"
          variant="outlined"
          hide-details
          :disabled="loading"
      />
    </template>
    <template v-slot:append>
      <v-icon-btn
          icon="md:send"
          variant="plain"
          :loading="loading"
          title="send"
          @click="emits('sendMessage')"
      />
      <v-icon-btn
          icon="md:chat_bubble"
          variant="plain"
          :loading="loading"
          title="get response"
          @click="emits('fetchApiResponse')"
      />
    </template>
  </v-textarea>
</template>

<style scoped>

</style>