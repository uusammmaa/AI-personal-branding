"use client";

import type { UIMessage } from "ai";
import ReactMarkdown, { type Components } from "react-markdown";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      <div className="my-2 max-w-full min-w-0 overflow-x-auto overscroll-x-contain rounded-md border border-border bg-card/80">
        <pre className="m-0 min-w-full w-max p-3 text-left font-mono text-xs leading-relaxed">
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
      className={cn(
        "min-w-0 max-w-full overflow-hidden rounded-lg border border-border/50 p-4",
        m.role === "user"
          ? "ml-6 border-primary/25 bg-primary/10 sm:ml-10"
          : "mr-6 border-border/40 bg-muted/40 sm:mr-10",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-foreground">
          {m.role === "user" ? "You" : "Assistant"}
        </span>
        {m.role === "assistant" && (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            aria-label="Copy message"
            disabled={plain.length === 0}
            onClick={() => void copyAssistantMessage(plain)}
            className="h-auto shrink-0 py-1 text-muted-foreground hover:text-foreground"
          >
            {copied ? "Copied" : "Copy"}
          </Button>
        )}
      </div>
      {m.role === "user" ? (
        <div className="mt-1 min-w-0 max-w-full wrap-break-word whitespace-pre-wrap text-sm text-foreground">
          {plain}
        </div>
      ) : (
        <div className="prose prose-sm prose-neutral mt-1 min-w-0 w-full max-w-full text-foreground dark:prose-invert [&_a]:wrap-break-word [&_p]:wrap-break-word [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-0 [&_pre]:shadow-none">
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
                  className="not-prose my-2 rounded-md border border-border/60 bg-card/50 p-2 text-xs text-muted-foreground"
                >
                  <summary className="cursor-pointer font-medium text-foreground">
                    Model reasoning
                  </summary>
                  <pre className="mt-2 max-h-48 overflow-y-auto wrap-break-word whitespace-pre-wrap font-sans">
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
