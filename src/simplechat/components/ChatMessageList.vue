<script setup lang="ts">
import ChatMessageCell from "@/simplechat/components/ChatMessageCell.vue"
import {nextTick, useTemplateRef} from "vue"
import {ChatViewModel} from "@/simplechat/components/ChatViewModel"

const messageItemsRef = useTemplateRef("messages-items")

const viewModel = ChatViewModel.injectOrCreate()

const messages = viewModel.messages
const loading = viewModel.loading

viewModel.scrollEvent.collect((id) => {
  nextTick(() => {
    const msgList = messageItemsRef.value!
    const index = msgList.findIndex((item: any) => item.$props.message.id === id)
    if (index !== -1) {
      msgList.at(index)!.$el.scrollIntoView({behavior: "smooth", block: "end"})
    }
  })
})

</script>

<template>
  <div class="position-relative">
    <TransitionGroup>
      <ChatMessageCell
          v-for="(msg, index) in messages"
          :key="msg.id"
          :message="msg"
          :loading="loading && index === messages.length-1"
          @deleteMessage="viewModel.deleteMessage(msg.id)"
          @insertBefore="viewModel.insertBefore(msg.id)"
          ref="messages-items"
          class="w-100 pl-2 pr-2 pb-4"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
/*noinspection CssUnusedSymbol*/
.v-move,
.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease;
}

/*noinspection CssUnusedSymbol*/
.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/*noinspection CssUnusedSymbol*/
.v-leave-active {
  position: absolute;
}
</style>