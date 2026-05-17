"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

import { ChatInput } from "@/components/ChatInput";
import { ChatModelSelect } from "@/components/ChatModelSelect";
import { MessageList } from "@/components/MessageList";
import { Button } from "@/components/ui/button";
import { DEFAULT_CHAT_MODEL_ID, type ChatModelId } from "@/lib/chat-models";

const COACH_SUGGESTED_PROMPTS = [
  "Help me write a compelling LinkedIn headline",
  "Review my GitHub profile and suggest improvements",
  "Suggest 3 portfolio project ideas to showcase my skills",
  "How do I position myself for remote senior dev roles?",
];

export default function CoachPage() {
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
    <div className="flex h-full min-h-0 w-full flex-col px-4 py-6 md:px-8 md:py-8">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl tracking-wide text-foreground md:text-4xl">
              Personal Branding Assistant
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Streaming coach powered by your configured models.
            </p>
          </div>
          <label className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
            <span className="whitespace-nowrap">Model</span>
            <ChatModelSelect
              value={selectedModel}
              onChange={setSelectedModel}
              disabled={isLoading}
            />
          </label>
        </div>
        {messages.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setMessages([])}
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            New Chat
          </Button>
        )}
      </header>

      <MessageList
        messages={messages}
        isLoading={isLoading}
        suggestedPrompts={COACH_SUGGESTED_PROMPTS}
        onSendText={(text) => sendMessage({ text }, { body: chatRequestBody })}
      />

      <ChatInput
        value={input}
        onChange={setInput}
        onSend={submitMessage}
        isLoading={isLoading}
        placeholder="Ask about your personal brand… (Enter to send, Shift+Enter for new line)"
      />
    </div>
  );
}
