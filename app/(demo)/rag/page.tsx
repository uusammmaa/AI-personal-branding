"use client";

import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import type { UIMessage } from "ai";
import { useMemo, useState } from "react";
import { ChatInput } from "@/components/ChatInput";
import { FileUpload } from "@/components/FileUpload";
import { MessageList } from "@/components/MessageList";

const apiBase =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function textFromUserMessage(message: UIMessage): string {
  return message.parts
    .filter(
      (part): part is { type: "text"; text: string } => part.type === "text",
    )
    .map((part) => part.text)
    .join("");
}

export default function RagPage() {
  const transport = useMemo(
    () =>
      new TextStreamChatTransport({
        api: `${apiBase}/chat`,
        prepareSendMessagesRequest: ({ messages }) => {
          const lastUser = [...messages]
            .reverse()
            .find((m) => m.role === "user");
          const question = lastUser ? textFromUserMessage(lastUser) : "";
          return { body: { question } };
        },
      }),
    [],
  );

  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
  });
  const [input, setInput] = useState("");

  const isLoading = status === "submitted" || status === "streaming";

  function submitMessage() {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    sendMessage({ text });
  }

  return (
    <div className="flex h-full min-h-0 w-full max-w-2xl flex-col mx-auto p-4">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="shrink-0 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Document Q&A
        </h1>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => setMessages([])}
            className="shrink-0 text-sm text-gray-500 transition-colors hover:text-gray-800 dark:hover:text-gray-200"
          >
            New Chat
          </button>
        )}
      </header>

      <FileUpload />

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
        placeholder="Ask a question about your uploaded documents… (Enter to send, Shift+Enter for new line)"
      />
    </div>
  );
}
