<script setup lang="ts">
import { marked } from "marked"
import { computed, ref, watch } from "vue"
import { ChatMessageModel } from "@/simplechat/storage/Models"
import { ChatViewModel } from "@/simplechat/components/ChatViewModel"

const props = defineProps<{
    message: ChatMessageModel
    loading: boolean
}>()
const viewModel = ChatViewModel.injectOrCreate()

const display = ref("")
watch(
    [props, viewModel.codeTheme],
    async ([p]) => {
        try {
            display.value = await marked.parse(p.message.content)
        } catch (e) {
            // might be unfinished code block
            console.debug(e)
        }
    },
    { immediate: true, deep: true },
)

const editing = ref(false)

const editIcon = computed(() => {
    return editing.value ? "md:done" : "md:edit"
})
const hideIcon = computed(() => {
    return props.message.hide ? "md:visibility_off" : "md:visibility"
})

function editClicked() {
    viewModel.editedMessages()
    editing.value = !editing.value
}

const cardStyle = computed<
    "text" | "flat" | "elevated" | "tonal" | "outlined" | "plain"
>(() => {
    switch (props.message.role) {
        case "user":
            return "tonal"
        case "system":
            return "outlined"
        default:
            return "text"
    }
})
</script>

<template>
    <v-card :variant="cardStyle">
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
                    v-if="viewModel.showHidden.value"
                    :icon="hideIcon"
                    variant="plain"
                    size="small"
                    @click="props.message.hide = !props.message.hide"
                    title="edit"
                    :disabled="loading"
                />
                <v-icon-btn
                    :icon="editIcon"
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
