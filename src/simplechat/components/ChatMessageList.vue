<script setup lang="ts">
import ChatMessageCell, {ChatMessageModel} from "@/simplechat/components/ChatMessageCell.vue";
import {useTemplateRef} from "vue";

const props = defineProps<{
  messages: ChatMessageModel[],
  loading: boolean,
}>()

const emits = defineEmits<{
  insertBefore: [id: number],
  deleteMessage: [id: number],
}>()
defineExpose({ scrollToLastMessage })

const messageItemsRef = useTemplateRef("messages-items")

function scrollToLastMessage(timeout: number = 50) {
  setTimeout(() => {
    const msgList = messageItemsRef.value
    msgList.at(-1).$el.scrollIntoView({behavior: "smooth", block: "end"})
  }, timeout)
}

</script>

<template>
  <div class="position-relative">
    <TransitionGroup>
      <ChatMessageCell
          v-for="msg in props.messages"
          :key="msg.id"
          :message="msg"
          :loading="props.loading"
          @deleteMessage="emits('deleteMessage', msg.id)"
          @insertBefore="emits('insertBefore', msg.id)"
          ref="messages-items"
          class="w-100 pa-2"
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