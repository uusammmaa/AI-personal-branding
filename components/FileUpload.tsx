"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { VectorStoreId } from "@/lib/vector-store";

const apiBase =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type IndexedDocument = {
  doc_id: string;
  filename: string;
  chunks: number;
};

export function FileUpload({
  vectorStore,
  onIndexed,
}: {
  vectorStore?: VectorStoreId;
  onIndexed?: (doc: IndexedDocument) => void;
} = {}) {
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
    if (vectorStore) {
      formData.append("vector_store", vectorStore);
    }

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
        doc_id?: string;
        filename?: string;
        chunks?: number;
      };
      if (
        typeof data.doc_id === "string" &&
        typeof data.filename === "string" &&
        typeof data.chunks === "number"
      ) {
        setResult({ filename: data.filename, chunks: data.chunks });
        onIndexed?.({
          doc_id: data.doc_id,
          filename: data.filename,
          chunks: data.chunks,
        });
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
    <Card size="sm" className="mb-4 border-border/60 bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Upload a PDF document</CardTitle>
        <CardDescription>
          Index the file before asking questions in the chat below.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <input
          id="rag-pdf-upload"
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => void handleUpload(e)}
          disabled={uploading}
          className={cn(
            "block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground",
            "hover:file:bg-primary/90 disabled:opacity-50",
          )}
        />
        {uploading && (
          <p className="mt-2 text-sm text-muted-foreground">Processing…</p>
        )}
        {error && (
          <p className="mt-2 text-sm text-destructive">{error}</p>
        )}
        {result && (
          <p className="mt-2 text-sm text-primary">
            {result.filename} — {result.chunks} chunks indexed
          </p>
        )}
      </CardContent>
    </Card>
  );
}
