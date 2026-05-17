"use client";

import { useState } from "react";

const apiBase =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export function FileUpload() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{
    filename: string;
    chunks: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${apiBase}/upload`, {
        method: "POST",
        body: formData,
      });

      const raw = await res.text();
      if (!res.ok) {
        let detail = raw;
        try {
          const parsed = JSON.parse(raw) as { detail?: unknown };
          if (typeof parsed.detail === "string") detail = parsed.detail;
          else if (Array.isArray(parsed.detail))
            detail = parsed.detail.map(String).join(", ");
        } catch {
          /* use raw */
        }
        setError(detail || `Upload failed (${res.status})`);
        return;
      }

      const data = JSON.parse(raw) as {
        filename?: string;
        chunks?: number;
      };
      if (typeof data.filename === "string" && typeof data.chunks === "number") {
        setResult({ filename: data.filename, chunks: data.chunks });
      } else {
        setError("Unexpected response from server");
      }
    } catch {
      setError("Network error — is the API running?");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      <label
        htmlFor="rag-pdf-upload"
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100"
      >
        Upload a PDF document
      </label>
      <input
        id="rag-pdf-upload"
        type="file"
        accept=".pdf,application/pdf"
        onChange={(e) => void handleUpload(e)}
        disabled={uploading}
        className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700 disabled:opacity-50 dark:text-gray-300"
      />
      {uploading && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Processing…
        </p>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {result && (
        <p className="mt-2 text-sm text-green-700 dark:text-green-400">
          {result.filename} — {result.chunks} chunks indexed
        </p>
      )}
    </div>
  );
}
