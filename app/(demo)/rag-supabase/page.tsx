import { RagDemoPanel } from "@/components/RagDemoPanel";

export default function RagSupabasePage() {
  return (
    <RagDemoPanel
      vectorStore="supabase"
      title="Document Q&A — Supabase pgvector"
      description="Same RAG pipeline with vectors stored in Postgres (pgvector) and similarity via SQL RPC."
    />
  );
}
