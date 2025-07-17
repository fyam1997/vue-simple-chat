<script setup lang="ts">

import ChatMessageList from "@/simplechat/components/ChatMessageList.vue"
import ChatInputField from "@/simplechat/components/ChatInputField.vue"
import {ChatViewModel} from "@/simplechat/components/ChatViewModel"

const viewModel = ChatViewModel.injectOrCreate()
const loading = viewModel.loading
</script>

<template>
    <div class="w-100 d-flex flex-column">
        <div class="flex-1 position-relative overflow-hidden">
            <ChatMessageList class="h-100 overflow-y-auto overflow-x-hidden msg-list pa-4"/>
            <v-icon-btn
                class="floating-btn position-absolute"
                icon="md:chat_bubble"
                    :loading="loading"
                title="generate response"
                @click="viewModel.fetchApiResponse()"
            />
        </div>
        <v-divider/>
        <ChatInputField class="pt-4 flex-grow-0"/>
    </div>
</template>

<style>
.msg-list {
    scrollbar-gutter: stable;
}

.floating-btn {
    bottom: 2rem;
    right: 2rem;
}
</style>
