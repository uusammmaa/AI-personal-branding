import { RagDemoPanel } from "@/components/RagDemoPanel";

export default function RagPage() {
  return (
    <RagDemoPanel
      vectorStore="pinecone"
      title="Document Q&A — Pinecone"
      description="PDF upload, embeddings, and retrieval against a Pinecone index."
    />
  );
}
