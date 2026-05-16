"use client";

import { useChat } from "@ai-sdk/react";
import {
  useRef,
  useEffect,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

const SUGGESTED_PROMPTS = [
  "Help me write a compelling LinkedIn headline",
  "Review my GitHub profile and suggest improvements",
  "Suggest 3 portfolio project ideas to showcase my skills",
  "How do I position myself for remote senior dev roles?",
];

export default function ChatPage() {
  const { messages, sendMessage, status, setMessages } = useChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function submitMessage() {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    sendMessage({ text });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    submitMessage();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing) return;
    e.preventDefault();
    submitMessage();
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
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

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 && (
          <div className="flex flex-col gap-2 mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Try asking:
            </p>
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                disabled={isLoading}
                onClick={() => sendMessage({ text: prompt })}
                className="p-3 text-left border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-4 rounded-lg ${
              m.role === "user"
                ? "bg-blue-100 dark:bg-blue-900/40 ml-8"
                : "bg-gray-100 dark:bg-gray-800 mr-8"
            }`}
          >
            <span className="font-semibold text-sm">
              {m.role === "user" ? "You" : "Assistant"}
            </span>
            <div className="mt-1 whitespace-pre-wrap">
              {m.parts
                .filter((p) => p.type === "text")
                .map((p, i) => (
                  <span key={i}>{p.text}</span>
                ))}
            </div>
          </div>
        ))}

        {isLoading && messages.at(-1)?.role !== "assistant" && (
          <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 mr-8 animate-pulse">
            <span className="font-semibold text-sm">Assistant</span>
            <p className="mt-1 text-gray-400">Thinking...</p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your personal brand... (Enter to send, Shift+Enter for new line)"
          rows={3}
          className="flex-1 min-h-18 max-h-48 resize-y py-3 px-3 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
