<script setup lang="ts">
import { ChatViewModel } from "@/simplechat/components/ChatViewModel"

export interface ChatInputModel {
    message: string
}

const viewModel = ChatViewModel.injectOrCreate()
const inputModel = viewModel.inputModel
const loading = viewModel.loading

async function sendMessage() {
    if (!loading.value) {
        await viewModel.scrollToBottom()
        await viewModel.sendMessage()
    }
}

function onEnter(event: Event) {
    if (viewModel.largeScreen.value) {
        event.preventDefault()
        if (inputModel.value.message) {
            sendMessage()
        }
    }
}
</script>

<template>
    <v-textarea
        class="pr-2 pb-4"
        variant="outlined"
        v-model="inputModel.message"
        auto-grow
        max-rows="5"
        rows="1"
        no-resize
        @keydown.enter.exact="onEnter"
        hide-details
        density="compact"
    >
        <template v-slot:prepend>
            <v-menu :close-on-content-click="false">
                <template #activator="{ props }">
                    <v-icon-btn
                        v-bind="props"
                        icon="md:more_vert"
                        variant="text"
                        :disabled="loading"
                        title="send options"
                    />
                </template>
                <v-list>
                    <v-list-item
                        prepend-icon="md:download"
                        @click="viewModel.downloadChats()"
                        title="Download Chat"
                        class="text-none"
                        density="compact"
                    />
                </v-list>
            </v-menu>
        </template>
        <template v-slot:append>
            <v-icon-btn
                v-if="!loading"
                icon="md:send"
                variant="text"
                title="send"
                @click="sendMessage"
            />
            <v-icon-btn
                v-else
                icon="md:stop"
                variant="text"
                title="Stop"
                @click="viewModel.stopGenerate()"
            />
        </template>
    </v-textarea>
</template>

<style scoped>
/*noinspection CssUnusedSymbol*/
:deep(.v-selection-control > .v-label--clickable) {
    padding: 16px 32px;
}
</style>
