"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { ChatInput } from "@/components/ChatInput";
import { MessageList } from "@/components/MessageList";
import { CHAT_MODELS, DEFAULT_CHAT_MODEL_ID, type ChatModelId } from "@/lib/chat-models";

export default function ChatPage() {
  const [selectedModel, setSelectedModel] =
    useState<ChatModelId>(DEFAULT_CHAT_MODEL_ID);
  const { messages, sendMessage, status, setMessages } = useChat();
  const [input, setInput] = useState("");

  const isLoading = status === "submitted" || status === "streaming";

  const chatRequestBody = { model: selectedModel };

  function submitMessage() {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    sendMessage({ text }, { body: chatRequestBody });
  }

  return (
    <div className="flex h-screen w-full min-w-0 max-w-2xl flex-col mx-auto p-4">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold shrink-0">
            Personal Branding Assistant
          </h1>
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <span className="sr-only">Model</span>
            <select
              className="max-w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
              value={selectedModel}
              disabled={isLoading}
              onChange={(e) =>
                setSelectedModel(e.target.value as ChatModelId)
              }
            >
              {CHAT_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => setMessages([])}
            className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors shrink-0"
          >
            New Chat
          </button>
        )}
      </header>

      <MessageList
        messages={messages}
        isLoading={isLoading}
        onSendText={(text) => sendMessage({ text }, { body: chatRequestBody })}
      />

      <ChatInput
        value={input}
        onChange={setInput}
        onSend={submitMessage}
        isLoading={isLoading}
      />
    </div>
  );
}
