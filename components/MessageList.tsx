"use client";

import type { UIMessage } from "ai";
import { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";

const DEFAULT_SUGGESTED_PROMPTS = [
  "What are the main topics covered in this document?",
  "Summarize the key conclusions in a few bullet points",
  "What definitions or terms are explained in the PDF?",
  "Are there any action items or recommendations listed?",
];

export function MessageList({
  messages,
  isLoading,
  onSendText,
  suggestedPrompts = DEFAULT_SUGGESTED_PROMPTS,
}: {
  messages: UIMessage[];
  isLoading: boolean;
  onSendText: (text: string) => void;
  suggestedPrompts?: string[];
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-0 min-w-0 flex-1 space-y-4 overflow-y-auto mb-4">
      {messages.length === 0 && (
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Try asking:
          </p>
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              disabled={isLoading}
              onClick={() => onSendText(prompt)}
              className="p-3 text-left border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {messages.map((m) => (
        <ChatMessage key={m.id} message={m} />
      ))}

      {isLoading && messages.at(-1)?.role !== "assistant" && (
        <div className="min-w-0 max-w-full overflow-hidden p-4 rounded-lg bg-gray-100 dark:bg-gray-800 mr-8 animate-pulse">
          <span className="font-semibold text-sm">Assistant</span>
          <p className="mt-1 text-gray-400">Thinking...</p>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
