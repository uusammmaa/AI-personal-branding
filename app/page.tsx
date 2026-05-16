"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import ReactMarkdown, { type Components } from "react-markdown";
import {
  useRef,
  useEffect,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

function messageTextContent(message: UIMessage): string {
  return message.parts
    .filter(
      (part): part is { type: "text"; text: string } => part.type === "text",
    )
    .map((part) => part.text)
    .join("");
}

/** Keeps fenced code inside the bubble: scroll horizontally instead of widening the layout. */
const assistantMarkdownComponents = {
  pre({ children }) {
    return (
      <div className="my-2 max-w-full min-w-0 overflow-x-auto overscroll-x-contain rounded-md border border-gray-300/70 dark:border-gray-600 bg-gray-900/6 dark:bg-black/30">
        <pre className="m-0 min-w-full w-max p-3 text-left text-xs leading-relaxed font-mono">
          {children}
        </pre>
      </div>
    );
  },
} satisfies Components;

const SUGGESTED_PROMPTS = [
  "Help me write a compelling LinkedIn headline",
  "Review my GitHub profile and suggest improvements",
  "Suggest 3 portfolio project ideas to showcase my skills",
  "How do I position myself for remote senior dev roles?",
];

export default function ChatPage() {
  const { messages, sendMessage, status, setMessages } = useChat();
  const [input, setInput] = useState("");
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  async function copyAssistantMessage(messageId: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      setCopiedMessageId(messageId);
      copyTimeoutRef.current = setTimeout(() => {
        setCopiedMessageId(null);
        copyTimeoutRef.current = null;
      }, 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

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

      <div className="min-h-0 min-w-0 flex-1 space-y-4 overflow-y-auto mb-4">
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

        {messages.map((m) => {
          const plain = messageTextContent(m);
          return (
            <div
              key={m.id}
              className={`min-w-0 max-w-full overflow-hidden p-4 rounded-lg ${
                m.role === "user"
                  ? "bg-blue-100 dark:bg-blue-900/40 ml-8"
                  : "bg-gray-100 dark:bg-gray-800 mr-8"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-sm">
                  {m.role === "user" ? "You" : "Assistant"}
                </span>
                {m.role === "assistant" && (
                  <button
                    type="button"
                    aria-label="Copy message"
                    disabled={plain.length === 0}
                    onClick={() => void copyAssistantMessage(m.id, plain)}
                    className="shrink-0 text-sm text-gray-500 hover:text-gray-800 disabled:opacity-40 disabled:pointer-events-none dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    {copiedMessageId === m.id ? "Copied" : "Copy"}
                  </button>
                )}
              </div>
              {m.role === "user" ? (
                <div className="mt-1 min-w-0 max-w-full whitespace-pre-wrap wrap-break-word text-sm">
                  {plain}
                </div>
              ) : (
                <div className="mt-1 min-w-0 w-full max-w-full prose prose-sm prose-neutral dark:prose-invert [&_p]:wrap-break-word [&_a]:wrap-break-word [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-0 [&_pre]:shadow-none">
                  {m.parts
                    .filter(
                      (p): p is { type: "text"; text: string } =>
                        p.type === "text",
                    )
                    .map((p, i) => (
                      <ReactMarkdown
                        key={`${m.id}-${i}`}
                        components={assistantMarkdownComponents}
                      >
                        {p.text}
                      </ReactMarkdown>
                    ))}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && messages.at(-1)?.role !== "assistant" && (
          <div className="min-w-0 max-w-full overflow-hidden p-4 rounded-lg bg-gray-100 dark:bg-gray-800 mr-8 animate-pulse">
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
