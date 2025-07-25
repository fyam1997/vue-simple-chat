<script setup lang="ts">

import ChatMessageList from "@/simplechat/components/ChatMessageList.vue"
import ChatInputField from "@/simplechat/components/ChatInputField.vue"
import {ChatViewModel} from "@/simplechat/components/ChatViewModel"
import MovableWidget from "@/simplechat/components/MovableWidget.vue"
import {onLongPress} from "@vueuse/core"
import {useTemplateRef} from "vue"

const viewModel = ChatViewModel.injectOrCreate()
const loading = viewModel.loading

const generateButtonRef = useTemplateRef<HTMLElement>('generateButtonRef')
onLongPress(
    generateButtonRef,
    () => {
    },
    {
      onMouseUp(duration: number, distance: number, isLongPress: boolean) {
        if (!isLongPress && !loading.value) {
          viewModel.fetchApiResponse()
        }
      },
    })

</script>

<template>
  <div class="w-100 d-flex flex-column">
    <div class="h-100 position-relative overflow-hidden">
      <ChatMessageList class="h-100 overflow-y-auto overflow-x-hidden msg-list pa-4 z-9999"/>
      <MovableWidget class="h-100 w-100 position-absolute top-0 left-0">
        <v-icon-btn
            ref="generateButtonRef"
            icon="md:chat_bubble"
            :loading="loading"
            title="generate response"
        />
      </MovableWidget>
    </div>
    <v-divider/>
    <ChatInputField class="pt-4 flex-grow-0"/>
  </div>
</template>

<style>
.msg-list {
  scrollbar-gutter: stable;
}
</style>
