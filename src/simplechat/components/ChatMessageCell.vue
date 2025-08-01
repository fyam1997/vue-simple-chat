<script setup lang="ts">
import { marked } from "marked"
import { computed, ref } from "vue"
import { ChatMessageModel } from "@/simplechat/storage/Models"
import { ChatViewModel } from "@/simplechat/components/ChatViewModel"
import markedShiki from "marked-shiki"
import { codeToHtml } from "shiki"
import { computedAsync } from "@vueuse/core"

const props = defineProps<{
    message: ChatMessageModel
    loading: boolean
}>()

const codeTheme = computed(() => {
    return viewModel.darkTheme.value ? "min-dark" : "min-light"
})

const parser = marked.setOptions({ breaks: true, async: true }).use(
    markedShiki({
        async highlight(code, lang) {
            return codeToHtml(code, { lang: lang, theme: codeTheme.value })
        },
    }),
)
const display = computedAsync(() => parser.parse(props.message.content))
const editing = ref(false)

const viewModel = ChatViewModel.injectOrCreate()

function editClicked() {
    viewModel.editedMessages()
    editing.value = !editing.value
}
</script>

<template>
    <v-card variant="outlined">
        <div class="d-flex flex-row align-end flex-wrap">
            <v-select
                v-model="props.message.role"
                :items="['user', 'system', 'assistant']"
                variant="plain"
                hide-details
                density="compact"
                class="flex-grow-0"
                :disabled="loading"
            />
            <v-spacer />
            <div class="d-flex flex-row align-center">
                <v-icon-btn
                    :icon="editing ? 'md:done' : 'md:edit'"
                    variant="plain"
                    size="small"
                    @click="editClicked"
                    title="edit"
                    :disabled="loading"
                />
                <v-icon-btn
                    icon="md:add"
                    variant="plain"
                    size="small"
                    @click="viewModel.insertMessage(message.id)"
                    title="insert above"
                />
                <v-divider vertical class="ma-2" />
                <v-icon-btn
                    icon="md:delete"
                    variant="plain"
                    size="small"
                    @click="viewModel.deleteMessage(message.id)"
                    title="delete"
                    :disabled="loading"
                />
            </div>
        </div>
        <v-textarea
            v-if="editing"
            autofocus
            v-model="props.message.content"
            variant="solo"
            auto-grow
            single-line
            rows="1"
            no-resize
            :readonly="loading"
            hide-details
            @keydown.esc.exact="editing = false"
        />
        <div v-else v-html="display" class="overflow-auto chat-message-html" />
    </v-card>
</template>

<style scoped>
/* revert vuetify's default style */
.chat-message-html,
.chat-message-html * {
    margin: revert !important;
    padding: revert !important;
}

/* make code block self scrollable */
:deep(pre) {
    overflow: auto;
}
</style>
