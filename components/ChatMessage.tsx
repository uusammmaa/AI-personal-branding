"use client";

import type { UIMessage } from "ai";
import ReactMarkdown, { type Components } from "react-markdown";
import { useEffect, useRef, useState } from "react";

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

export function ChatMessage({ message: m }: { message: UIMessage }) {
  const plain = messageTextContent(m);
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  async function copyAssistantMessage(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      setCopied(true);
      copyTimeoutRef.current = setTimeout(() => {
        setCopied(false);
        copyTimeoutRef.current = null;
      }, 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div
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
            onClick={() => void copyAssistantMessage(plain)}
            className="shrink-0 text-sm text-gray-500 hover:text-gray-800 disabled:opacity-40 disabled:pointer-events-none dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
      {m.role === "user" ? (
        <div className="mt-1 min-w-0 max-w-full whitespace-pre-wrap wrap-break-word text-sm">
          {plain}
        </div>
      ) : (
        <div className="mt-1 min-w-0 w-full max-w-full prose prose-sm prose-neutral dark:prose-invert [&_p]:wrap-break-word [&_a]:wrap-break-word [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-0 [&_pre]:shadow-none">
          {m.parts.map((p, i) => {
            if (p.type === "text") {
              return (
                <ReactMarkdown
                  key={`${m.id}-t-${i}`}
                  components={assistantMarkdownComponents}
                >
                  {p.text}
                </ReactMarkdown>
              );
            }
            if (
              p.type === "reasoning" &&
              "text" in p &&
              typeof p.text === "string" &&
              p.text.trim().length > 0
            ) {
              return (
                <details
                  key={`${m.id}-r-${i}`}
                  className="not-prose my-2 rounded-md border border-gray-200 bg-gray-50/80 p-2 text-xs text-gray-600 dark:border-gray-600 dark:bg-gray-900/50 dark:text-gray-400"
                >
                  <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300">
                    Model reasoning
                  </summary>
                  <pre className="mt-2 max-h-48 overflow-y-auto whitespace-pre-wrap wrap-break-word font-sans">
                    {p.text}
                  </pre>
                </details>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}
