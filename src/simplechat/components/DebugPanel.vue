<script setup lang="ts">
import { ChatViewModel } from "@/simplechat/components/ChatViewModel"

const viewModel = ChatViewModel.injectOrCreate()

function addStubMessages() {
    viewModel.messages.value.push({
        role: "assistant",
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ante elit, egestas sed mauris nec, imperdiet vulputate metus. Etiam tempus quam non sem consequat consequat. Sed sit amet nibh velit. Vestibulum et tristique mi. Sed sit amet augue nec urna finibus blandit vitae nec nisi. Etiam convallis, nisi at porttitor venenatis, est eros mattis nulla, nec viverra purus dui sed arcu. Pellentesque consectetur lectus sed ultrices commodo. Morbi semper facilisis dapibus. Vestibulum velit sapien, feugiat vitae libero vel, dignissim mollis ligula. Mauris rutrum nibh ac mauris efficitur lobortis. Suspendisse hendrerit pellentesque congue. Ut eget nisi ante. Aenean hendrerit tortor orci, sed volutpat arcu mollis eget. Sed erat ipsum, fringilla sed pretium eget, ornare dapibus neque.`,
        id: Date.now(),
        hide: false,
        asking: false,
    })
}
</script>
<template>
    <div class="h-100">
        <button @click="addStubMessages">Add stub msg</button>
    </div>
</template>
