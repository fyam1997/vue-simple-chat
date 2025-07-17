<script setup lang="ts">
import {ChatViewModel} from "@/simplechat/components/ChatViewModel"

export interface ChatInputModel {
    message: string
    role: string
    generateOnSend: boolean
}

const viewModel = ChatViewModel.injectOrCreate()
const inputModel = viewModel.inputModel
const loading = viewModel.loading

</script>

<template>
    <div class="d-flex flex-column ga-2 pa-4">
        <v-textarea
            variant="outlined"
            v-model="inputModel.message"
            auto-grow
            max-rows="5"
            rows="1"
            no-resize
            @keydown.enter.exact.prevent="viewModel.sendMessage()"
            hide-details
        >
            <template v-slot:append>
                <v-icon-btn
                    icon="md:send"
                    variant="text"
                    :loading="loading"
                    title="send"
                    @click="viewModel.sendMessage()"
                />
            </template>
        </v-textarea>
    </div>
</template>

<style scoped>

</style>