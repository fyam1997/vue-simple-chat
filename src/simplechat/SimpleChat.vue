<script setup lang="ts">

import {useLocalStorage} from "@vueuse/core";
import {ref, useTemplateRef} from "vue";
import OpenAI from "openai";
import {ChatMessageModel} from "@/simplechat/components/ChatMessageCell.vue";
import ChatMessageList from "@/simplechat/components/ChatMessageList.vue";
import ChatInputField, {ChatInputModel} from "@/simplechat/components/ChatInputField.vue";
import {ChatConfigModel} from "@/simplechat/components/ChatConfigDialog.vue";
import ChatToolbar from "@/simplechat/components/ChatToolbar.vue";

const darkTheme = useLocalStorage("app-dark-theme", true)

const messages = useLocalStorage<ChatMessageModel[]>("messages-list", [])
const inputModel = useLocalStorage<ChatInputModel>(
    "input-model",
    {role: "user", message: "", generateOnSend: false}
)

const apiConfig = useLocalStorage<ChatConfigModel>("api-config", {
  baseURL: "",
  apiKey: "",
  model: "",
})

const messageListRef = useTemplateRef("message-list")

const loading = ref(false)

function sendMessage() {
  if (!inputModel.value.message) {
    return
  }

  const newMsg = {
    role: inputModel.value.role,
    content: inputModel.value.message,
    id: Date.now(),
  }
  messages.value.push(newMsg)

  inputModel.value.message = ""
  messageListRef.value.scrollToLastMessage()
  if (inputModel.value.generateOnSend) {
    fetchApiResponse()
  }
}

function deleteMessage(id: number) {
  const index = messages.value.findIndex((msg) => msg.id === id)
  if (index !== -1) {
    const isLast = index === messages.value.length - 1
    messages.value.splice(index, 1)
    if (isLast) {
      // If scrolled to bottom and remove last item, container size change isn't smooth
      messageListRef.value.scrollToLastMessage()
    }
  }
}

function insertBefore(id: number) {
  const index = messages.value.findIndex((msg) => msg.id === id)
  if (index !== -1) {
    const newMsg = {
      role: inputModel.value.role,
      content: inputModel.value.message,
      id: Date.now(),
    }
    messages.value.splice(index, 0, newMsg)
    inputModel.value.message
  }
}

async function fetchApiResponse() {
  loading.value = true
  const client = new OpenAI({
    baseURL: apiConfig.value.baseURL,
    apiKey: apiConfig.value.apiKey,
    dangerouslyAllowBrowser: true,
  })
  // declare as any[] to suppress ChatCompletionMessageParam's warning
  const requestMessages: any[] = messages.value.map((msg) => {
    return {
      role: msg.role,
      content: msg.content,
    }
  })
  const completion = await client.chat.completions.create({
    model: apiConfig.value.model,
    messages: requestMessages,
    stream: true
  })
  let firstReceived = false
  for await (const event of completion) {
    if (!firstReceived) {
      firstReceived = true
      messages.value.push({
        role: "assistant",
        content: "",
        id: Date.now(),
      })
    }

    messages.value.at(-1).content += event.choices[0].delta.content
  }
  loading.value = false
}

function downloadChats() {
  const blob = new Blob([JSON.stringify(messages.value)], {type: "application/json"})
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "chats.json"
  a.click()
  URL.revokeObjectURL(url)
}

function openBugReport() {
  window.open("https://github.com/fyam1997/vue-simple-chat", "_blank")
}

</script>

<template>
  <v-app :theme="darkTheme ? 'dark' : 'light'">
    <div class="d-flex flex-column mw-800 align-self-center h-100">
      <ChatToolbar
          :api-config="apiConfig"
          :dark-theme="darkTheme"
          @downloadChats="downloadChats"
          @openBugReport="openBugReport"
          @toggleDownTheme="darkTheme = !darkTheme"
      />
      <ChatMessageList
          :messages="messages"
          :loading="loading"
          @deleteMessage="deleteMessage"
          @insertBefore="insertBefore"
          ref="message-list"
          class="flex-grow-1 overflow-y-scroll pl-4 pr-4"
      />
      <v-divider/>
      <ChatInputField
          :input-model="inputModel"
          :loading="loading"
          @sendMessage="sendMessage"
          @fetchApiResponse="fetchApiResponse"
          class="pt-4 pb-4 flex-grow-0 "
      />
    </div>
  </v-app>
</template>

<style>
.mw-800 {
  max-width: 800px;
  width: 100%;
}
</style>
