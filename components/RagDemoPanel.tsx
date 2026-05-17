"use client";

import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import type { UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChatInput } from "@/components/ChatInput";
import { FileUpload } from "@/components/FileUpload";
import { MessageList } from "@/components/MessageList";
import type { VectorStoreId } from "@/lib/vector-store";

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

export function RagDemoPanel({
  vectorStore,
  title,
  description,
}: {
  vectorStore: VectorStoreId;
  title: string;
  description?: string;
}) {
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [uploadKey, setUploadKey] = useState(0);
  const activeDocIdRef = useRef<string | null>(null);
  const vectorStoreRef = useRef(vectorStore);

  useEffect(() => {
    activeDocIdRef.current = activeDocId;
  }, [activeDocId]);

  useEffect(() => {
    vectorStoreRef.current = vectorStore;
  }, [vectorStore]);

  const transport = useMemo(
    () =>
      new TextStreamChatTransport({
        api: `${apiBase}/chat`,
        prepareSendMessagesRequest: ({ messages }) => {
          const lastUser = [...messages]
            .reverse()
            .find((m) => m.role === "user");
          const question = lastUser ? textFromUserMessage(lastUser) : "";
          return {
            body: {
              question,
              doc_id: activeDocIdRef.current ?? "",
              vector_store: vectorStoreRef.current,
            },
          };
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
        <div>
          <h1 className="shrink-0 text-2xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          ) : null}
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setMessages([]);
              setActiveDocId(null);
              setUploadKey((k) => k + 1);
            }}
            className="shrink-0 text-sm text-gray-500 transition-colors hover:text-gray-800 dark:hover:text-gray-200"
          >
            New Chat
          </button>
        )}
      </header>

      <FileUpload
        key={uploadKey}
        vectorStore={vectorStore}
        onIndexed={(doc) => setActiveDocId(doc.doc_id)}
      />

      <MessageList
        messages={messages}
        isLoading={isLoading}
        suggestionsDisabled={!activeDocId}
        onSendText={(text) => sendMessage({ text })}
      />

      <ChatInput
        value={input}
        onChange={setInput}
        onSend={submitMessage}
        isLoading={isLoading}
        disabled={!activeDocId}
        placeholder={
          activeDocId
            ? "Ask a question about your uploaded document… (Enter to send, Shift+Enter for new line)"
            : "Upload a PDF above, then ask a question…"
        }
      />
    </div>
  );
}
