"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { ChatInput } from "@/components/ChatInput";
import { MessageList } from "@/components/MessageList";

export default function ChatPage() {
  const { messages, sendMessage, status, setMessages } = useChat();
  const [input, setInput] = useState("");

  const isLoading = status === "submitted" || status === "streaming";

  function submitMessage() {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    sendMessage({ text });
  }

  return (
    <div className="flex h-screen w-full min-w-0 max-w-2xl flex-col mx-auto p-4">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Personal Branding Assistant</h1>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => setMessages([])}
            className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            New Chat
          </button>
        )}
      </header>

      <MessageList
        messages={messages}
        isLoading={isLoading}
        onSendText={(text) => sendMessage({ text })}
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
