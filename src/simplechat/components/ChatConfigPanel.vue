<script setup lang="ts">

import {computed} from "vue";
import {ChatViewModel} from "@/simplechat/components/ChatViewModel"
import {APIConfigDialog} from "vue-f-misc";

const viewModel = ChatViewModel.injectOrCreate()
const toggleThemeIcon = computed(() => {
    return viewModel.darkTheme.value ? 'md:light_mode' : 'md:dark_mode'
})
const inputModel = viewModel.inputModel
const loading = viewModel.loading
const selectedIndex = viewModel.selectedIndex
const appVersion = __APP_VERSION__

const idList = viewModel.idList

function onIndexSelected(value: any) {
    if (value && typeof value === "object" && "id" in value) {
        viewModel.selectChat(value.id)
    }
}

</script>

<template>
    <div class="d-flex flex-column ga-4 overflow-y-auto pa-4">
        <div class="d-flex flex-row align-center">
            <v-combobox
                variant="outlined"
                :model-value="selectedIndex"
                :items="idList"
                item-title="name"
                item-value="id"
                @update:model-value="onIndexSelected"
                hide-details
                label="Chat"
                :disabled="loading"
            />
            <v-menu>
                <template #activator="{ props }">
                    <v-btn
                        v-bind="props"
                        icon="md:more_vert"
                        variant="plain"
                        :disabled="loading"
                        title="Chat options"
                    />
                </template>
                <v-list>
                    <v-list-item
                        prepend-icon="md:note_add"
                        @click="viewModel.addChat()"
                        title="Add chat"
                        :disabled="loading"
                    />
                    <v-list-item
                        prepend-icon="md:file_copy"
                        @click="viewModel.cloneChat()"
                        title="Clone chat"
                        :disabled="loading"
                    />
                    <v-list-item
                        prepend-icon="md:delete"
                        @click="viewModel.deleteChat()"
                        title="Delete chat"
                        :disabled="loading"
                    />
                </v-list>
            </v-menu>
        </div>
        <v-text-field
            label="Chat name"
            variant="outlined"
            class="flex-grow-0"
            hide-details
            v-model="selectedIndex.name"
        />
        <v-divider/>
        <APIConfigDialog/>
        <v-select
            label="Role"
            prepend-icon="md:person"
            v-model="inputModel.role"
            :items="['user', 'system', 'assistant']"
            variant="underlined"
            hide-details
            density="compact"
            class="flex-grow-0"
        />
        <v-checkbox
            v-model="inputModel.generateOnSend"
            label="Generate on send"
            hide-details
        />

        <v-spacer/>
        <v-divider/>

        <v-list-item
            :prepend-icon="toggleThemeIcon"
            @click="viewModel.toggleDarkTheme()"
            title="Change theme"
            class="text-none"
            density="compact"
        />
        <v-list-item
            prepend-icon="md:bug_report"
            @click="viewModel.openBugReport()"
            title="Bug report"
            class="text-none"
            density="compact"
        />
        <v-list-item
            prepend-icon="md:download"
            @click="viewModel.downloadChats()"
            title="Download"
            class="text-none"
            density="compact"
        />
        <v-list-item :subtitle="'version: '+appVersion"/>
    </div>
</template>

<style scoped>

</style>