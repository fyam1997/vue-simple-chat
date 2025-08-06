<script setup lang="ts">
import { ChatViewModel } from "@/simplechat/components/ChatViewModel"
import MovableWidget from "@/simplechat/components/MovableWidget.vue"
import { computed, ref, useTemplateRef } from "vue"
import { onLongPress } from "@vueuse/core"

const viewModel = ChatViewModel.injectOrCreate()
const showDebugMenu = ref(false)

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ante elit, egestas sed mauris nec, imperdiet vulputate metus. Etiam tempus quam non sem consequat consequat. Sed sit amet nibh velit. Vestibulum et tristique mi. Sed sit amet augue nec urna finibus blandit vitae nec nisi. Etiam convallis, nisi at porttitor venenatis, est eros mattis nulla, nec viverra purus dui sed arcu. Pellentesque consectetur lectus sed ultrices commodo. Morbi semper facilisis dapibus. Vestibulum velit sapien, feugiat vitae libero vel, dignissim mollis ligula. Mauris rutrum nibh ac mauris efficitur lobortis. Suspendisse hendrerit pellentesque congue. Ut eget nisi ante. Aenean hendrerit tortor orci, sed volutpat arcu mollis eget. Sed erat ipsum, fringilla sed pretium eget, ornare dapibus neque.`

function addStubMessages() {
    viewModel.messages.value.push({
        role: "assistant",
        content: lorem,
        id: Date.now(),
        hide: false,
        asking: false,
    })
}

// region stub response
const stubResponse = ref(false)
const appendIcon = computed(() =>
    stubResponse.value ? "md:check_box" : "md:check_box_outline_blank",
)

let realRespondMethod = viewModel.fetchChatCompletion

async function* stubRespondMethod(): AsyncGenerator<string> {
    yield* yieldText(lorem)
}

async function* yieldText(
    text: string,
    delay: number = 10,
): AsyncGenerator<string> {
    for (const char of text) {
        yield char
        if (delay > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay))
        }
    }
}

function toggleStubResponse() {
    stubResponse.value = !stubResponse.value
    if (stubResponse.value) {
        viewModel.fetchChatCompletion = stubRespondMethod
    } else {
        viewModel.fetchChatCompletion = realRespondMethod
    }
}

// endregion

// region debug button
const dragHandleRef = useTemplateRef("targetRef")
const dragHandleElement = computed(() => dragHandleRef.value?.$el)

onLongPress(dragHandleElement, () => {}, {
    onMouseUp(duration: number, distance: number, isLongPress: boolean) {
        if (!isLongPress) {
            onDebugBtnClicked()
        }
    },
})

function onDebugBtnClicked() {
    showDebugMenu.value = !showDebugMenu.value
}

// endregion
</script>
<template>
    <MovableWidget class="h-100 w-100 position-absolute top-0 left-0">
        <template v-slot="{ startDrag }">
            <v-menu
                v-model="showDebugMenu"
                :close-on-content-click="false"
                location="top"
                target="parent"
            >
                <template v-slot:activator>
                    <v-btn
                        ref="targetRef"
                        class="drag-handle"
                        icon="md:bug_report"
                        title="Debug Menu"
                        @touchstart="startDrag"
                        @mousedown="startDrag"
                    />
                </template>
                <v-list>
                    <v-list-item
                        @click="addStubMessages"
                        title="Add stub message"
                        class="text-none"
                        density="compact"
                    />
                    <v-list-item
                        @click="toggleStubResponse"
                        title="Stub response"
                        class="text-none"
                        density="compact"
                        :append-icon="appendIcon"
                    />
                </v-list>
            </v-menu>
        </template>
    </MovableWidget>
</template>
