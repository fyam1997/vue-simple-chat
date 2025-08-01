<script setup lang="ts">
import ChatMessageCell from "@/simplechat/components/ChatMessageCell.vue"
import { ChatViewModel } from "@/simplechat/components/ChatViewModel"

const viewModel = ChatViewModel.injectOrCreate()

const messages = viewModel.messages
const loading = viewModel.loading
</script>

<template>
    <div class="position-relative">
        <TransitionGroup>
            <ChatMessageCell
                v-for="(msg, index) in messages"
                v-show="msg.asking || !msg.hide || viewModel.showHidden.value"
                :key="msg.id"
                :message="msg"
                :loading="loading && index === messages.length - 1"
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
