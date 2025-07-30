<script setup lang="ts">
import ChatMessageCell from "@/simplechat/components/ChatMessageCell.vue"
import { nextTick, useTemplateRef } from "vue"
import { ChatViewModel } from "@/simplechat/components/ChatViewModel"

const messageItemsRef = useTemplateRef("messages-items")

const viewModel = ChatViewModel.injectOrCreate()

const messages = viewModel.messages
const loading = viewModel.loading

viewModel.scrollEvent.collect((id) => {
    nextTick(() => {
        const msgList = messageItemsRef.value
        if (!msgList) {
            return
        }
        const index = msgList.findIndex(
            (item: any) => item.$props.message.id === id,
        )
        if (index !== -1) {
            msgList
                .at(index)!
                .$el.scrollIntoView({ behavior: "smooth", block: "end" })
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
                :loading="loading && index === messages.length - 1"
                ref="messages-items"
                class="w-100 pl-2 pr-2 pb-4 mt-4"
            />
            <div
                class="d-flex flex-row align-center pt-4 pb-4"
                key="insert last"
            >
                <v-divider class="ml-4 mr-4" />
                <v-icon-btn
                    icon="md:add"
                    variant="plain"
                    size="small"
                    @click="viewModel.insertMessage()"
                    :disabled="loading"
                    title="insert message"
                />
                <v-divider class="ml-4 mr-4" />
            </div>
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
