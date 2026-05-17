# RAG Document Chat — Portfolio Project
### Upwork Portfolio Project — Stage 2
**Next.js · FastAPI · Python · Claude API · Pinecone · Supabase pgvector**

---

## What This Document Is

Stage 2 of your AI learning path. You will build a chatbot that answers questions from uploaded documents using **Retrieval-Augmented Generation (RAG)** — the most in-demand AI pattern on Upwork right now.

You will gain experience with **both** Pinecone and Supabase pgvector by building a swappable vector DB layer. Same project, same code, two providers — you learn the difference by doing, not reading.

This document also introduces your first **Python FastAPI backend**. Your Next.js frontend from Stage 1 carries over.

---

## 1. Project Overview

| Item | Details |
|------|---------|
| **Purpose** | Chat with your own documents — PDF or plain text |
| **Scope** | Full RAG pipeline: upload → chunk → embed → store → retrieve → generate |
| **Build time** | ~2 weeks part-time (~2 hrs/day weekends, 30–45 min weekday evenings) |
| **Learning outcome** | Embeddings, vector DBs, RAG pipeline, Python FastAPI, provider abstraction |
| **Portfolio value** | Two live demos (Pinecone + Supabase), clean architecture, most-requested AI project type |

> 💡 **Why this project?** "Chat with my documents / website / knowledge base" is the #1 AI project request on Upwork. Every business has documents they want to query. This project directly maps to paid work.

---

## 2. What You Will Learn (and When)

| Phase | You Build | AI / Engineering Concept |
|-------|-----------|--------------------------|
| Phase 1: Python basics | FastAPI server, routes, env vars | Python project structure, virtual environments, FastAPI basics |
| Phase 2: Document processing | PDF upload, text extraction, chunking | Why chunking matters, chunk size tradeoffs |
| Phase 3: Embeddings | Convert chunks to vectors | What embeddings are, how semantic search works |
| Phase 4: Pinecone | Store + query vectors | Managed vector DB, namespaces, similarity search |
| Phase 5: RAG pipeline | Retrieve → prompt → generate | Full RAG loop, prompt construction with context |
| Phase 6: Frontend | Next.js UI with file upload + chat | Connecting existing Next.js skills to new backend |
| Phase 7: Supabase swap | Replace Pinecone with pgvector | Provider abstraction, SQL vectors, tradeoff understanding |
| Phase 8: Deploy | FastAPI on Railway + Next.js on Vercel | Production multi-service deployment |

---

## 3. Core Concepts to Understand Before You Code

Read this section fully before starting Phase 1. It will make every line of code make sense.

### 3.1 What is RAG?

RAG stands for **Retrieval-Augmented Generation**. Instead of relying on what an LLM already knows (its training data), you give it relevant information at query time — retrieved from your own documents.

Without RAG:
```
User: "What does our refund policy say?"
Claude: "I don't have access to your company's refund policy."
```

With RAG:
```
User: "What does our refund policy say?"
System: [retrieves relevant chunk from your policy PDF]
Claude: "Based on your policy document: refunds are processed within 7 days..."
```

The LLM is not "learning" your documents — it is reading the relevant parts fresh on every request.

### 3.2 The RAG Pipeline (memorise this)

```
Document → Chunk → Embed → Store (vector DB)   ← happens once at upload time
                                    ↓
User query → Embed query → Search vector DB → Retrieve top-K chunks
                                    ↓
         Inject chunks into prompt → Claude → Streaming answer
```

There are two phases:
- **Indexing** (upload time): process document, store vectors
- **Querying** (chat time): retrieve relevant chunks, generate answer

### 3.3 What are Embeddings?

An embedding is a list of numbers (a vector) that represents the *meaning* of a piece of text. Texts with similar meanings have vectors that are close together in space.

Example:
- "How do I reset my password?" → `[0.12, -0.45, 0.87, ...]` (384 numbers)
- "Steps to change my login credentials" → `[0.11, -0.44, 0.85, ...]` (very close)
- "What is the weather today?" → `[0.92, 0.13, -0.21, ...]` (very far)

This is how semantic search works — you embed the user's question and find the stored chunks whose vectors are closest to it.

> 💡 You will use `text-embedding-3-small` from OpenAI for embeddings (cheapest, fastest, widely supported). Anthropic does not have a public embeddings API yet.

### 3.4 What is a Vector Database?

A vector database is a database optimised for storing and searching vectors by similarity (not exact match like SQL). You give it a query vector and it returns the most similar stored vectors — and their associated text.

**Pinecone** — dedicated managed vector DB. No SQL. Simple API. Great for learning vector concepts in isolation.

**Supabase pgvector** — PostgreSQL with a vector extension. Vectors live in a SQL table alongside other columns. Great for SaaS projects where you already have a relational DB.

### 3.5 Chunking

You cannot embed an entire 50-page PDF as one vector — it would lose specificity. You split it into chunks (paragraphs or fixed-size windows), embed each chunk separately, and store them individually.

Chunk size tradeoffs:
- **Too small** (50 tokens) → loses context, fragments sentences
- **Too large** (2000 tokens) → loses specificity, retrieves too much irrelevant content
- **Sweet spot** (300–500 tokens with 50-token overlap) → good for most documents

### 3.6 Why Python for the Backend?

The RAG/AI ecosystem is Python-native:
- LangChain, LlamaIndex, Haystack — all Python
- Most embedding libraries — Python first
- Most vector DB SDKs — Python first
- Most Upwork AI projects — Python backend

Your Node.js/TypeScript skills stay relevant for the frontend. Python handles the AI heavy lifting.

### 3.7 Provider Abstraction (the architecture lesson)

You will write a `VectorStore` abstract class in Python with two methods: `upsert()` and `query()`. Pinecone and Supabase each implement this interface. Your RAG pipeline only talks to the interface — it does not care which provider is underneath.

This is the same pattern used in production AI systems. It is also a great talking point in Upwork proposals.

---

## 4. Tech Stack

| Layer | Technology | Why This Choice |
|-------|------------|-----------------|
| **Frontend** | Next.js 14+ (from Stage 1) | Already built. Add file upload + new API calls. |
| **Backend** | Python 3.11+ + FastAPI | AI ecosystem standard. Async. Fast. Clean API design. |
| **Embeddings** | OpenAI `text-embedding-3-small` | Cheapest, fastest, widely supported. ~$0.00002 per 1K tokens. |
| **Vector DB (Week 1)** | Pinecone (free tier) | Managed, zero SQL, ideal for learning vector concepts cleanly |
| **Vector DB (Week 2)** | Supabase pgvector (free tier) | SQL-based, great for SaaS, teaches vector-in-relational-DB pattern |
| **PDF parsing** | `pypdf` | Simple, reliable, no system dependencies |
| **Text chunking** | `langchain_text_splitters` | Best chunking utilities, no need for full LangChain |
| **AI generation** | Anthropic Claude via `anthropic` SDK | Carry over from Stage 1 |
| **Deployment** | Railway (FastAPI) + Vercel (Next.js) | Free tiers, simple config, production-grade |

> 💡 **Why not LangChain for everything?** LangChain is powerful but abstracts too much for a learner. You will use only its text splitter — and build the rest yourself. This means you actually understand the pipeline, not just the framework.

---

## 5. Prerequisites

- Stage 1 completed (Next.js frontend, Claude API familiarity)
- Python 3.11+ installed (`python --version`)
- Basic Python knowledge (functions, classes, imports, `pip`) — you mentioned you have this
- OpenAI API key — get one at [platform.openai.com](https://platform.openai.com) (embeddings only, very cheap)
- Pinecone account (free) — [pinecone.io](https://pinecone.io)
- Supabase account (free) — [supabase.com](https://supabase.com)
- Anthropic API key (carry over from Stage 1)

---

## 6. Architecture

### Full System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Next.js Frontend                   │
│  File Upload UI  │  Chat UI  │  Document List UI     │
└────────────┬─────────────────────────┬───────────────┘
             │ POST /upload            │ POST /chat
             ▼                         ▼
┌─────────────────────────────────────────────────────┐
│                  FastAPI Backend                      │
│                                                       │
│  /upload → chunk → embed → VectorStore.upsert()      │
│  /chat   → embed query → VectorStore.query()         │
│          → build prompt → Claude API → stream        │
│                                                       │
│  ┌─────────────────────────────────────────────┐    │
│  │         VectorStore (abstract interface)     │    │
│  │  upsert(chunks, vectors) / query(vector, k) │    │
│  └──────────────┬──────────────────────────────┘    │
│                 │                                     │
│       ┌─────────┴─────────┐                          │
│       ▼                   ▼                          │
│   PineconeStore      SupabaseStore                   │
└─────────────────────────────────────────────────────┘
             │                   │
             ▼                   ▼
        Pinecone DB        Supabase pgvector
```

### Request Flow: Upload

1. User uploads a PDF via Next.js UI
2. Frontend sends file to `POST /upload` on FastAPI
3. FastAPI extracts text with `pypdf`
4. Text is split into chunks (~400 tokens, 50 overlap)
5. Each chunk is embedded via OpenAI embeddings API
6. Chunk text + vector stored in active VectorStore
7. FastAPI returns success + document metadata

### Request Flow: Chat

1. User sends a question via Next.js chat UI
2. Frontend sends question to `POST /chat` on FastAPI
3. FastAPI embeds the question via OpenAI
4. VectorStore returns top-5 most similar chunks
5. FastAPI builds a prompt: system + retrieved chunks + user question
6. Claude streams the answer back
7. FastAPI streams response to Next.js frontend
8. UI renders streaming answer in real time

---

## 7. Project Structure

```
stage2-rag/
├── backend/                    # FastAPI Python backend
│   ├── main.py                 # FastAPI app, routes
│   ├── config.py               # Settings, env vars
│   ├── services/
│   │   ├── document.py         # PDF extraction + chunking
│   │   ├── embeddings.py       # OpenAI embeddings wrapper
│   │   ├── vector_store.py     # Abstract VectorStore interface
│   │   ├── pinecone_store.py   # Pinecone implementation
│   │   ├── supabase_store.py   # Supabase pgvector implementation
│   │   └── rag.py              # RAG pipeline: retrieve → prompt → generate
│   ├── requirements.txt
│   └── .env                    # API keys (gitignored)
│
├── frontend/                   # Next.js app (from Stage 1, extended)
│   ├── app/
│   │   ├── page.tsx            # Chat UI (extended)
│   │   ├── upload/page.tsx     # New: file upload UI
│   │   └── api/                # Remove — backend is now FastAPI
│   ├── components/
│   │   ├── ChatMessage.tsx
│   │   ├── ChatInput.tsx
│   │   ├── MessageList.tsx
│   │   └── FileUpload.tsx      # New component
│   └── .env.local              # NEXT_PUBLIC_API_URL=http://localhost:8000
│
├── .env.example
└── README.md
```

---

## 8. Step-by-Step Build Guide

---

### Phase 1: Python FastAPI Backend Setup

**1.1 — Create the backend folder and virtual environment**

```bash
mkdir stage2-rag && cd stage2-rag
mkdir backend && cd backend
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows
```

> 💡 **What is a virtual environment?** A sandboxed Python installation just for this project. It keeps your dependencies isolated — the same reason `node_modules` exists in Node projects. Always activate it before running your backend.

**1.2 — Install dependencies**

```bash
pip install fastapi uvicorn python-multipart pypdf \
            langchain-text-splitters openai anthropic \
            pinecone supabase python-dotenv
```

**1.3 — Create requirements.txt**

```bash
pip freeze > requirements.txt
```

**1.4 — Create the environment file**

Create `backend/.env`:

```env
ANTHROPIC_API_KEY=sk-ant-your-key
OPENAI_API_KEY=sk-your-openai-key
PINECONE_API_KEY=your-pinecone-key
PINECONE_INDEX_NAME=rag-documents
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
VECTOR_STORE=pinecone          # Switch to "supabase" in Week 2
```

**1.5 — Create config.py**

```python
# backend/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    anthropic_api_key: str
    openai_api_key: str
    pinecone_api_key: str
    pinecone_index_name: str = "rag-documents"
    supabase_url: str = ""
    supabase_key: str = ""
    vector_store: str = "pinecone"  # "pinecone" or "supabase"

    class Config:
        env_file = ".env"

settings = Settings()
```

**1.6 — Create main.py**

```python
# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="RAG Document Chat API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok"}
```

**1.7 — Run the server**

```bash
uvicorn main:app --reload --port 8000
```

Visit `http://localhost:8000/health` — you should see `{"status": "ok"}`.

> 💡 **Learning checkpoint:** `--reload` restarts the server on file changes, like `next dev`. `uvicorn` is the ASGI server that runs FastAPI, like how Node.js runs your Next.js app.

---

### Phase 2: Document Processing

**Create `backend/services/document.py`**

```python
# backend/services/document.py
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from typing import List
import io

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract all text from a PDF file."""
    reader = PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

def chunk_text(text: str, chunk_size: int = 400, overlap: int = 50) -> List[str]:
    """Split text into overlapping chunks for embedding."""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=overlap,
        separators=["\n\n", "\n", ".", " ", ""]
    )
    return splitter.split_text(text)
```

> 💡 **Learning checkpoint:** Why `RecursiveCharacterTextSplitter`? It tries to split on paragraph breaks first (`\n\n`), then newlines, then sentences, then words — so chunks are as semantically clean as possible rather than cutting mid-sentence.

---

### Phase 3: Embeddings Service

**Create `backend/services/embeddings.py`**

```python
# backend/services/embeddings.py
from openai import OpenAI
from config import settings
from typing import List

client = OpenAI(api_key=settings.openai_api_key)

def embed_texts(texts: List[str]) -> List[List[float]]:
    """Embed a list of text chunks. Returns a list of vectors."""
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=texts
    )
    return [item.embedding for item in response.data]

def embed_query(query: str) -> List[float]:
    """Embed a single query string."""
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=[query]
    )
    return response.data[0].embedding
```

> 💡 **Learning checkpoint:** `text-embedding-3-small` outputs vectors of 1536 dimensions. Every chunk you embed and every query you embed will be a list of 1536 floats. Similarity is measured by cosine distance between these vectors.

---

### Phase 4: Vector Store — Abstract Interface

**Create `backend/services/vector_store.py`**

```python
# backend/services/vector_store.py
from abc import ABC, abstractmethod
from typing import List, Dict, Any

class VectorStore(ABC):
    """Abstract interface for vector database providers.
    
    Both Pinecone and Supabase implement this interface.
    The RAG pipeline only talks to this — never to providers directly.
    """

    @abstractmethod
    def upsert(self, chunks: List[str], vectors: List[List[float]], doc_id: str) -> None:
        """Store text chunks and their vectors."""
        pass

    @abstractmethod
    def query(self, vector: List[float], top_k: int = 5) -> List[Dict[str, Any]]:
        """Find the most similar chunks to a query vector.
        
        Returns: list of dicts with 'text' and 'score' keys.
        """
        pass

def get_vector_store() -> VectorStore:
    """Factory: return the active vector store based on config."""
    from config import settings
    if settings.vector_store == "pinecone":
        from services.pinecone_store import PineconeStore
        return PineconeStore()
    elif settings.vector_store == "supabase":
        from services.supabase_store import SupabaseStore
        return SupabaseStore()
    else:
        raise ValueError(f"Unknown vector store: {settings.vector_store}")
```

> 💡 **This is the key architectural decision.** The `get_vector_store()` factory reads `VECTOR_STORE` from your `.env` file and returns the right implementation. To switch providers: change one env var. No other code changes needed.

---

### Phase 5: Pinecone Implementation (Week 1)

**5.1 — Create your Pinecone index**

1. Sign in at [pinecone.io](https://pinecone.io)
2. Create a new index:
   - Name: `rag-documents`
   - Dimensions: `1536` (matches `text-embedding-3-small`)
   - Metric: `cosine`
   - Plan: Free (Starter)

**5.2 — Create `backend/services/pinecone_store.py`**

```python
# backend/services/pinecone_store.py
from pinecone import Pinecone
from services.vector_store import VectorStore
from config import settings
from typing import List, Dict, Any
import uuid

class PineconeStore(VectorStore):
    def __init__(self):
        pc = Pinecone(api_key=settings.pinecone_api_key)
        self.index = pc.Index(settings.pinecone_index_name)

    def upsert(self, chunks: List[str], vectors: List[List[float]], doc_id: str) -> None:
        """Store chunks in Pinecone with metadata."""
        records = []
        for i, (chunk, vector) in enumerate(zip(chunks, vectors)):
            records.append({
                "id": f"{doc_id}-{i}",
                "values": vector,
                "metadata": {"text": chunk, "doc_id": doc_id}
            })
        # Pinecone recommends batches of 100
        batch_size = 100
        for i in range(0, len(records), batch_size):
            self.index.upsert(vectors=records[i:i + batch_size])

    def query(self, vector: List[float], top_k: int = 5) -> List[Dict[str, Any]]:
        """Search Pinecone for similar chunks."""
        result = self.index.query(
            vector=vector,
            top_k=top_k,
            include_metadata=True
        )
        return [
            {"text": match.metadata["text"], "score": match.score}
            for match in result.matches
        ]
```

---

### Phase 6: RAG Pipeline

**Create `backend/services/rag.py`**

```python
# backend/services/rag.py
from anthropic import Anthropic
from services.embeddings import embed_query
from services.vector_store import get_vector_store
from typing import Iterator

client = Anthropic()

def build_context_prompt(chunks: list[dict], question: str) -> str:
    """Build the prompt that injects retrieved chunks into Claude's context."""
    context = "\n\n---\n\n".join([c["text"] for c in chunks])
    return f"""You are a helpful assistant that answers questions based on provided document context.

Use ONLY the context below to answer the question. If the answer is not in the context, say so clearly.
Do not make up information.

CONTEXT:
{context}

QUESTION:
{question}

ANSWER:"""

def rag_stream(question: str) -> Iterator[str]:
    """Full RAG pipeline: embed → retrieve → prompt → stream."""
    # 1. Embed the question
    query_vector = embed_query(question)

    # 2. Retrieve top-5 relevant chunks
    store = get_vector_store()
    chunks = store.query(query_vector, top_k=5)

    # 3. Build prompt with retrieved context
    prompt = build_context_prompt(chunks, question)

    # 4. Stream Claude's answer
    with client.messages.stream(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    ) as stream:
        for text in stream.text_stream:
            yield text
```

> 💡 **Learning checkpoint:** Notice the prompt says "Use ONLY the context below". This is called **grounding** — you are preventing Claude from using its general knowledge and forcing it to answer only from your documents. This is what makes RAG reliable for business use cases.

---

### Phase 7: FastAPI Routes

**Update `backend/main.py`**

```python
# backend/main.py
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from services.document import extract_text_from_pdf, chunk_text
from services.embeddings import embed_texts
from services.vector_store import get_vector_store
from services.rag import rag_stream
import uuid

app = FastAPI(title="RAG Document Chat API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """Upload a PDF, chunk it, embed it, store in vector DB."""
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files supported")

    file_bytes = await file.read()
    doc_id = str(uuid.uuid4())

    # Process document
    text = extract_text_from_pdf(file_bytes)
    chunks = chunk_text(text)
    vectors = embed_texts(chunks)

    # Store in vector DB
    store = get_vector_store()
    store.upsert(chunks, vectors, doc_id)

    return {
        "doc_id": doc_id,
        "filename": file.filename,
        "chunks": len(chunks)
    }

class ChatRequest(BaseModel):
    question: str

@app.post("/chat")
async def chat(request: ChatRequest):
    """RAG chat: embed question → retrieve → stream Claude answer."""
    return StreamingResponse(
        rag_stream(request.question),
        media_type="text/plain"
    )
```

---

### Phase 8: Frontend — Extend Stage 1

**8.1 — Update `.env.local`**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**8.2 — Create `components/FileUpload.tsx`**

```tsx
'use client';
import { useState } from 'react';

export default function FileUpload() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ filename: string; chunks: number } | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setResult({ filename: data.filename, chunks: data.chunks });
    setUploading(false);
  };

  return (
    <div className="p-4 border rounded-lg">
      <label className="block text-sm font-medium mb-2">Upload a PDF document</label>
      <input type="file" accept=".pdf" onChange={handleUpload} disabled={uploading} />
      {uploading && <p className="text-sm text-gray-500 mt-2">Processing...</p>}
      {result && (
        <p className="text-sm text-green-600 mt-2">
          ✓ {result.filename} — {result.chunks} chunks indexed
        </p>
      )}
    </div>
  );
}
```

**8.3 — Update `app/page.tsx` to call FastAPI instead of `/api/chat`**

Replace the `useChat` api path:

```tsx
const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
  api: `${process.env.NEXT_PUBLIC_API_URL}/chat`,
  streamProtocol: 'text',   // FastAPI streams plain text, not Vercel AI SDK format
});
```

Add `<FileUpload />` above the chat UI.

---

### Phase 9: Supabase pgvector Swap (Week 2)

This is where you learn the difference between a dedicated vector DB and vectors inside a relational DB.

**9.1 — Set up Supabase**

1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run:

```sql
-- Enable pgvector extension
create extension if not exists vector;

-- Create documents table
create table documents (
  id        text primary key,
  doc_id    text not null,
  content   text not null,
  embedding vector(1536),
  created_at timestamp default now()
);

-- Create index for fast similarity search
create index on documents
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);
```

**9.2 — Create `backend/services/supabase_store.py`**

```python
# backend/services/supabase_store.py
from supabase import create_client
from services.vector_store import VectorStore
from config import settings
from typing import List, Dict, Any
import uuid

class SupabaseStore(VectorStore):
    def __init__(self):
        self.client = create_client(settings.supabase_url, settings.supabase_key)

    def upsert(self, chunks: List[str], vectors: List[List[float]], doc_id: str) -> None:
        """Insert chunks into Supabase documents table."""
        records = [
            {
                "id": f"{doc_id}-{i}",
                "doc_id": doc_id,
                "content": chunk,
                "embedding": vector
            }
            for i, (chunk, vector) in enumerate(zip(chunks, vectors))
        ]
        self.client.table("documents").insert(records).execute()

    def query(self, vector: List[float], top_k: int = 5) -> List[Dict[str, Any]]:
        """Use pgvector cosine similarity search."""
        result = self.client.rpc(
            "match_documents",
            {"query_embedding": vector, "match_count": top_k}
        ).execute()
        return [
            {"text": row["content"], "score": row["similarity"]}
            for row in result.data
        ]
```

**9.3 — Create the Supabase SQL function**

In Supabase SQL Editor:

```sql
create or replace function match_documents(
  query_embedding vector(1536),
  match_count int default 5
)
returns table (
  id text,
  content text,
  similarity float
)
language sql stable
as $$
  select id, content,
    1 - (embedding <=> query_embedding) as similarity
  from documents
  order by embedding <=> query_embedding
  limit match_count;
$$;
```

**9.4 — Switch providers**

In `backend/.env`, change one line:

```env
VECTOR_STORE=supabase
```

Restart the server. Everything else — the RAG pipeline, the routes, the frontend — stays identical. That is the power of the abstraction.

---

### Phase 10: Deployment

**10.1 — Deploy FastAPI to Railway**

1. Create an account at [railway.app](https://railway.app)
2. Create a `Procfile` in `backend/`:

```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

3. Push to GitHub, import in Railway, add all env vars from `.env`
4. Railway gives you a public URL like `https://your-app.railway.app`

**10.2 — Update Next.js for production**

In Vercel, update the environment variable:

```env
NEXT_PUBLIC_API_URL=https://your-app.railway.app
```

Update CORS in `backend/main.py`:

```python
allow_origins=["https://your-nextjs-app.vercel.app"]
```

**10.3 — Deploy Next.js to Vercel (same as Stage 1)**

```bash
vercel
```

---

## 9. Part-Time Build Schedule

### Week 1 — Pinecone

| Day | Task | Est. Time |
|-----|------|-----------|
| **Saturday** | Phases 1–2: FastAPI setup, PDF extraction, chunking working | 2 hrs |
| **Sunday** | Phases 3–5: Embeddings + Pinecone store + test upsert via `/upload` | 2 hrs |
| **Monday eve** | Read the RAG pipeline code. Ask Claude.ai to explain anything unclear. | 30 min |
| **Tuesday eve** | Phase 6: RAG pipeline complete, `/chat` endpoint streaming | 45 min |
| **Wednesday eve** | Phase 7: Frontend file upload + chat connected to FastAPI | 45 min |
| **Thursday eve** | Test full flow end-to-end. Upload a real PDF. Ask questions about it. | 30 min |
| **Friday** | Polish, fix bugs, push to GitHub | 30 min |

### Week 2 — Supabase Swap

| Day | Task | Est. Time |
|-----|------|-----------|
| **Saturday** | Phase 8: Supabase project setup, SQL table + pgvector extension + SQL function | 1.5 hrs |
| **Sunday** | Phase 8 cont: SupabaseStore implementation, swap env var, test full flow | 1.5 hrs |
| **Monday eve** | Compare the two implementations. Write notes on differences. | 30 min |
| **Tuesday eve** | Deploy FastAPI to Railway | 45 min |
| **Wednesday eve** | Deploy Next.js to Vercel, test production | 45 min |
| **Thursday eve** | Write README, take screenshots, record a short Loom demo | 45 min |
| **Friday** | Done. Add to Upwork portfolio. | 30 min |

---

## 10. File Checklist

| File | Purpose |
|------|---------|
| `backend/main.py` | FastAPI app with `/upload` and `/chat` routes |
| `backend/config.py` | Settings loaded from `.env` |
| `backend/services/document.py` | PDF extraction + text chunking |
| `backend/services/embeddings.py` | OpenAI embeddings wrapper |
| `backend/services/vector_store.py` | Abstract VectorStore interface + factory |
| `backend/services/pinecone_store.py` | Pinecone implementation |
| `backend/services/supabase_store.py` | Supabase pgvector implementation |
| `backend/services/rag.py` | RAG pipeline: retrieve → prompt → stream |
| `backend/requirements.txt` | Python dependencies |
| `backend/.env` | API keys (gitignored) |
| `backend/.env.example` | Template (safe to commit) |
| `backend/Procfile` | Railway deployment config |
| `frontend/components/FileUpload.tsx` | PDF upload UI component |
| `frontend/.env.local` | `NEXT_PUBLIC_API_URL` pointing to FastAPI |
| `README.md` | Architecture diagram, setup steps, live demo link |

---

## 11. What Changes Between Pinecone and Supabase

This is worth understanding deeply — it's what you'll explain in Upwork proposals.

| Aspect | Pinecone | Supabase pgvector |
|--------|----------|-------------------|
| **Data model** | Key-value + vector. No SQL. | SQL table with a vector column. |
| **Query method** | Pinecone SDK `.query()` | SQL function via Supabase RPC |
| **Filtering** | Metadata filters (JSON-like) | Full SQL WHERE clauses |
| **Other data** | Only vector data | Vectors alongside relational data (users, docs, etc.) |
| **Best for** | Pure vector search, fast setup | SaaS apps where vectors are one part of a bigger DB |
| **Pricing** | Free tier → $70/mo | Free tier → $25/mo (full Postgres included) |
| **Code change to swap** | One env var: `VECTOR_STORE=supabase` | Same |

---

## 12. Upwork Portfolio Showcase Guide

### 12.1 — What to Highlight

- "Built a production RAG pipeline from scratch — no LangChain black boxes"
- "Implemented provider abstraction pattern supporting Pinecone and Supabase pgvector"
- "Full-stack: Python FastAPI backend + Next.js frontend, deployed on Railway + Vercel"
- "Real streaming responses — users see answers as they are generated"

### 12.2 — GitHub README Must-Haves

- Architecture diagram (the ASCII one above works)
- Live demo link (two if you deploy both providers)
- Loom video walkthrough (2–3 min) — big differentiator on Upwork
- `.env.example` with all required keys
- Clear setup instructions for running locally

### 12.3 — Upwork Profile Snippet

> Built a full RAG pipeline from scratch using Python FastAPI, OpenAI embeddings, and Anthropic Claude — with a swappable vector store layer supporting both Pinecone and Supabase pgvector. Users upload PDF documents and ask questions; the system retrieves the most relevant chunks and generates grounded, streaming answers. Full-stack: Next.js frontend, FastAPI backend, deployed on Vercel + Railway.

---

## 13. Troubleshooting

| Issue | Solution |
|-------|---------|
| `ModuleNotFoundError` | Ensure your virtual environment is activated: `source venv/bin/activate` |
| CORS error from frontend | Check `allow_origins` in `main.py` matches your Next.js URL exactly |
| Pinecone dimension mismatch | Index must be created with `1536` dimensions to match `text-embedding-3-small` |
| Empty retrieval results | Check that `/upload` succeeded before `/chat`. Verify chunks were stored. |
| Supabase vector search slow | Ensure the `ivfflat` index was created after data was inserted |
| Railway deployment fails | Ensure `Procfile` exists, `requirements.txt` is complete (`pip freeze > requirements.txt`) |
| Streaming not working in production | Check CORS `allow_origins` updated to production Vercel URL |
| PDF text extraction empty | Some PDFs are scanned images — `pypdf` can't extract from images. Note this as a known limitation. |

---

## 14. Quick Reference Commands

```bash
# Activate virtual environment (run this every time you open a new terminal)
source venv/bin/activate          # Mac/Linux
venv\Scripts\activate             # Windows

# Install dependencies
pip install -r requirements.txt

# Run FastAPI dev server
uvicorn main:app --reload --port 8000

# Freeze dependencies after installing new packages
pip freeze > requirements.txt

# Test upload endpoint (replace with your PDF path)
curl -X POST http://localhost:8000/upload \
  -F "file=@/path/to/your/document.pdf"

# Test chat endpoint
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What is this document about?"}'
```

---

*Stage 2 of your AI learning path. Build it, understand every part, then move to Stage 3: AI Agents & Tool Use.*
