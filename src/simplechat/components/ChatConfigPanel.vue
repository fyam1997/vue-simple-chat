<script setup lang="ts">
import { computed } from "vue"
import { ChatViewModel } from "@/simplechat/components/ChatViewModel"
import { APIConfigDialog } from "vue-f-misc"
import ChatIndexCell from "@/simplechat/components/ChatIndexCell.vue"

const viewModel = ChatViewModel.injectOrCreate()
const toggleThemeIcon = computed(() => {
    return viewModel.darkTheme.value ? "md:light_mode" : "md:dark_mode"
})
const loading = viewModel.loading
const appVersion = __APP_VERSION__
const idList = viewModel.idList
</script>

<template>
    <div class="d-flex flex-column ga-4 pa-4">
        <APIConfigDialog />
        <v-btn
            prepend-icon="md:note_add"
            @click="viewModel.addChat()"
            text="Start New Chat"
            :disabled="loading"
            variant="outlined"
            class="text-none w-100"
        />
        <div class="flex-grow-1 overflow-y-hidden">
            <v-list class="overflow-y-auto h-100">
                <ChatIndexCell v-for="index in idList" :index="index" />
            </v-list>
            <v-divider />
        </div>

        <div class="d-flex flex-row justify-end flex-wrap">
            <v-label
                class="text-caption pl-2"
                :text="'version: ' + appVersion"
            />
            <v-spacer />
            <v-icon-btn
                :icon="toggleThemeIcon"
                @click="viewModel.toggleDarkTheme()"
                title="Change theme"
                variant="plain"
            />
            <v-icon-btn
                icon="md:bug_report"
                @click="viewModel.openBugReport()"
                title="Bug report"
                variant="plain"
            />
        </div>
    </div>
</template>

<style scoped></style>
