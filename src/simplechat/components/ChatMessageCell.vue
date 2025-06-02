<script setup lang="ts">
import {ChatMessageModel} from "@/simplechat/storage/ChatStorage.ts";
import {marked} from 'marked'
import {computed, ref} from "vue";

const props = defineProps<{
  message: ChatMessageModel,
  loading: boolean,
}>()

const emits = defineEmits<{
  insertBefore: []
  deleteMessage: []
}>()

marked.setOptions({ breaks: true })
const display = computed(() => marked(props.message.content))
const editing = ref(false)

</script>

<template>
  <div>
    <div class="d-flex flex-row align-end flex-wrap">
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
          :icon="editing?'md:done':'md:edit'"
          variant="plain"
          size="small"
          @click="editing=!editing"
          :disabled="loading"
          title="insert above"
      />
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
          class="ml-4"
          @click="emits('deleteMessage')"
          :disabled="loading"
          title="delete"
      />
    </div>
    <v-textarea
        v-if="editing"
        key="edit"
        v-model="props.message.content"
        variant="outlined"
        auto-grow
        single-line
        rows="1"
        no-resize
        :readonly="loading"
        hide-details
        @keydown.ctrl.enter.exact="editing=false"
    />
    <div
        v-else
        key="display"
        v-html="display"
        class="overflow-auto"
    />
  </div>
</template>

<style scoped>
/* pick from browser's default. TODO vuetify set all to none. try get rid of vuetify*/
:deep(ol) {
  display: block;
  list-style-type: decimal;
  margin-block-start: 1em;
  margin-block-end: 1em;
  padding-inline-start: 40px;
  unicode-bidi: isolate;
}

:deep(ul) {
  display: block;
  list-style-type: disc;
  margin-block-start: 1em;
  margin-block-end: 1em;
  padding-inline-start: 40px;
  unicode-bidi: isolate;
}
</style>
