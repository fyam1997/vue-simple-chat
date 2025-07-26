<script setup lang="ts">

import ChatMessageList from "@/simplechat/components/ChatMessageList.vue"
import ChatInputField from "@/simplechat/components/ChatInputField.vue"
import {ChatViewModel} from "@/simplechat/components/ChatViewModel"
import MovableWidget from "@/simplechat/components/MovableWidget.vue"
import {onLongPress, useElementSize, useScroll, VueInstance} from "@vueuse/core"
import {computed, useTemplateRef} from "vue"

const viewModel = ChatViewModel.injectOrCreate()
const loading = viewModel.loading

const generateButtonRef = useTemplateRef<VueInstance>('generateButtonRef')
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

const msgListContainerRef = useTemplateRef<HTMLDivElement>('msg-list-container')
const msgListRef = useTemplateRef<VueInstance>('msg-list')
const scrollYRef = useScroll(msgListContainerRef).y
const scrollHeightRef = useElementSize(msgListRef).height
const scrollContainerHeightRef = useElementSize(msgListContainerRef).height

/**
 * if there is half of page size can scroll, show scroll to bottom button
 */
const showScrollToBottom = computed(() => {
  const scrollY = scrollYRef.value
  const scrollHeight = scrollHeightRef.value
  const containerHeight = scrollContainerHeightRef.value
  const remainingScroll = scrollHeight - containerHeight - scrollY
  return remainingScroll > containerHeight / 2
})
</script>

<template>
  <div class="w-100 d-flex flex-column">
    <div class="h-100 position-relative overflow-hidden d-flex justify-center">
      <div
          ref="msg-list-container"
          class="msg-list-container overflow-x-hidden overflow-y-auto w-100 h-100 pa-4"
      >
        <ChatMessageList ref="msg-list"/>
      </div>

      <MovableWidget class="h-100 w-100 position-absolute top-0 left-0">
        <v-btn
            ref="generateButtonRef"
            icon="md:chat_bubble"
            variant="elevated"
            :loading="loading"
            title="generate response"
        />
      </MovableWidget>

      <v-btn
          v-if="showScrollToBottom"
          class="position-absolute bottom-0 mb-4"
          icon="md:keyboard_double_arrow_down"
          variant="plain"
          title="scroll to bottom"
          @click="viewModel.scrollToBottom()"
      />
    </div>
    <v-divider/>
    <ChatInputField class="pt-4 flex-grow-0"/>
  </div>
</template>

<style>
.msg-list-container {
  scrollbar-gutter: stable;
}
</style>
