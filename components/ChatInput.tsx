"use client";

import { type FormEvent, type KeyboardEvent } from "react";

const DEFAULT_PLACEHOLDER =
  "Message… (Enter to send, Shift+Enter for new line)";

export function ChatInput({
  value,
  onChange,
  onSend,
  isLoading,
  placeholder = DEFAULT_PLACEHOLDER,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  placeholder?: string;
  /** When true, blocks sending (e.g. no document indexed yet). */
  disabled?: boolean;
}) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSend();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing) return;
    e.preventDefault();
    onSend();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={3}
        className="flex-1 min-h-18 max-h-48 resize-y py-3 px-3 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        disabled={isLoading || disabled}
      />
      <button
        type="submit"
        disabled={isLoading || disabled || !value.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Send
      </button>
    </form>
  );
}
