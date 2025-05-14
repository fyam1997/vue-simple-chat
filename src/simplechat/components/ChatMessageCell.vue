<script setup lang="ts">
export interface ChatMessageModel {
  role: string
  content: string
  id: number
}

const props = defineProps<{
  message: ChatMessageModel,
  loading: boolean,
}>()

const emits = defineEmits<{
  insertBefore: []
  deleteMessage: []
}>()


</script>

<template>
  <div>
    <div class="d-flex flex-row align-end">
      <v-select
          v-model="props.message.role"
          :items="['user', 'system', 'assistant']"
          variant="plain"
          hide-details
          :disabled="loading"
          class="flex-grow-0"
      />
      <v-spacer/>
      <v-icon-btn
          icon="md:add"
          variant="plain"
          size="small"
          @click="emits('insertBefore')"
          :disabled="loading"
          title="insert above"
      />
      <v-icon-btn
          icon="md:close"
          variant="plain"
          size="small"
          @click="emits('deleteMessage')"
          :disabled="loading"
          title="delete"
      />
    </div>
    <v-textarea
        v-model="props.message.content"
        variant="outlined"
        auto-grow
        single-line
        rows="1"
        no-resize
        :readonly="loading"
        hide-details
    />
  </div>
</template>

<style scoped>
</style>
