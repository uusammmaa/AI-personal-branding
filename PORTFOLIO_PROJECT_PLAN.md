# AI Chat Assistant
### Upwork Portfolio Project — Stage 1
**Next.js · Claude API · TypeScript · Tailwind CSS · pnpm**

---

## This repository (starter status)

This folder is the **ai-chat-portfolio** Next.js app. It was scaffolded with **pnpm**, **Next.js 16** (App Router), **React 19**, **Tailwind CSS 4**, and **ESLint**. Phase 1 dependencies **`ai`** (v6) and **`@ai-sdk/anthropic`** (v3) are already in `package.json`. **`.env.example`** and **`.env.local`** (placeholder key) exist; put your real key only in `.env.local`.

**Phases 2–4 are implemented:** [`app/api/chat/route.ts`](app/api/chat/route.ts) defines `POST /api/chat` using `streamText`, `convertToModelMessages`, `maxOutputTokens: 1024`, and `toUIMessageStreamResponse()`. [`app/page.tsx`](app/page.tsx) is a `'use client'` chat UI using the v6 `useChat` hook from `@ai-sdk/react`, with `sendMessage`, `status`, `m.parts`-based rendering, auto-scroll, a **multiline `<textarea>`** composer (**Enter** sends, **Shift+Enter** newline; respects `isComposing` for IME), dark-mode–aware Tailwind, a short **“Thinking…”** placeholder while the assistant has not started streaming, **Phase 4 suggested prompts** when `messages.length === 0`, and a **New Chat** button. If you are new to the codebase, read those two files, then continue from **Phase 5**.

If you cloned this repo, **skip Phase 1.1–1.2** unless you are reproducing the setup from scratch. Use **`pnpm dev`** / **`pnpm run build`** (not `npm`) so the lockfile stays consistent.

Implementation details for chat (`streamText`, streaming `Response`, `useChat`) change between **AI SDK** major versions. This repo pins **v6** — when the **snippets below** diverge from your installed major version or from the checked-in files, follow the official docs: [AI SDK](https://ai-sdk.dev/docs).

---

## What This Document Is

This is your complete build guide for Stage 1 of your AI learning path. Every section is designed with two goals in mind: **ship a real portfolio project** AND **understand what you built** — so you carry the knowledge into Stage 2 and beyond.

Read each section before coding. The explanations are intentional — they are the learning, not filler.

---

## 1. Project Overview

| Item | Details |
|------|---------|
| **Purpose** | AI assistant that helps software engineers build their personal brand |
| **Scope** | Chatbot with Claude API, conversation history, streaming, clean UI |
| **Build time** | 2–4 days (part-time friendly, ~2 hrs/day) |
| **Learning outcome** | LLMs, prompt engineering, streaming, token management, API integration |
| **Portfolio value** | Live demo on Vercel + GitHub repo showcasing real AI integration |

> 💡 **Why personal branding assistant?** It's a niche chatbot — not just "another ChatGPT clone". Niched projects stand out on Upwork because they show product thinking, not just coding ability.

---

## 2. What You Will Learn (and When)

Each phase of the build teaches a specific AI concept. Don't skip ahead — the sequence is intentional.

| Phase | You Build | AI Concept You Learn |
|-------|-----------|----------------------|
| Phase 1: Setup | Project scaffold + env vars | How API keys work, what the Anthropic SDK is |
| Phase 2: API Route | POST /api/chat endpoint | How LLMs receive input, tokens, **`maxOutputTokens`**, system prompt as behaviour control |
| Phase 3: Chat UI | Main page + `useChat` + streaming to the browser | Multi-turn history (client-held), SSE-style streaming UX |
| Phase 4: Suggested prompts | Empty-state starter buttons | Guiding users without extra model calls |
| Phase 5: Polish | Markdown, copy (New Chat already in repo) | Production-style presentation of model output |
| Phase 6: Components | Optional refactor into `components/*` | Code organisation for portfolio review |
| Phase 7: Deploy | Live Vercel URL | Env var management, production API key safety |

---

## 3. Core AI Concepts to Understand Before You Code

These are the fundamentals. Read this section once, refer back as you build.

### 3.1 How LLMs Work (Simple Version)

A Large Language Model (LLM) like Claude is a statistical model trained on massive amounts of text. It predicts the most likely next token (word fragment) given everything it has seen so far. That's it — no memory, no understanding, just very sophisticated pattern completion.

This is why:
- You must send the full conversation history every request — it has no memory between calls
- Longer conversations cost more — every token in the history is re-processed
- The system prompt shapes behaviour — it's the first thing Claude sees

### 3.2 Tokens

Tokens are the unit of text LLMs work with. A token is roughly 3/4 of a word in English. "Hello world" = 2 tokens. A typical paragraph = ~100 tokens.

Why this matters for you:
- **Cost** — you pay per token (input + output)
- **Context window** — Claude has a maximum number of tokens it can process per request
- **Output token cap** — the cap you set on how long the model’s reply can be (in **AI SDK v6** this is `maxOutputTokens` on `streamText` / `generateText`)

> 💡 For this project: set **`maxOutputTokens: 1024`** in the API route. Enough for detailed advice, not wasteful.

### 3.3 The Messages Array

Every call to Claude uses a `messages` array — an ordered list of turns in the conversation. Each message has a `role` (`user` or `assistant`) and `content` (the text).

```ts
messages: [
  { role: "user",      content: "Help me write a LinkedIn headline" },
  { role: "assistant", content: "Here are 3 options for you..." },
  { role: "user",      content: "I like option 2, make it punchier" }
]
```

The `useChat` hook from the Vercel AI SDK (React package **`@ai-sdk/react`** in v6) manages this array automatically. Understanding it manually helps you debug and extend it later.

### 3.4 System Prompt

The system prompt is a special instruction you provide before the conversation starts. It defines who Claude is, how it should behave, what it should focus on, and what it should avoid. This is prompt engineering at its most basic — and most powerful.

The system prompt in this project turns a general-purpose AI into a personal branding coach. In Stage 2 and 3, you will learn more advanced prompting techniques.

### 3.5 Streaming

Without streaming: the user waits for the entire response to be generated, then sees it all at once. With streaming: tokens arrive in real time, like someone typing. Streaming is standard UX for AI products. The Vercel AI SDK handles all the complexity — your job is to understand why it exists.

---

## 4. Tech Stack

| Layer | Technology | Why This Choice |
|-------|------------|-----------------|
| **Framework** | Next.js 16+ (App Router) | API routes = backend built-in. No separate server needed. |
| **Package manager** | pnpm | Fast installs, strict `node_modules` layout; this repo uses a `pnpm-lock.yaml`. |
| **AI SDK** | `@ai-sdk/anthropic` + `ai` (Vercel AI SDK v6) | Streaming, chat UI patterns, and provider calls — check docs for v6 APIs |
| **Model** | `claude-haiku-4-5-20251001` (see `app/api/chat/route.ts`) | Fast and cost-effective Haiku model supported by **`@ai-sdk/anthropic` v3**; Anthropic periodically retires older model strings — if calls fail, pick a current id from [Anthropic’s docs](https://docs.anthropic.com) or your installed package typings |
| **Styling** | Tailwind CSS | Fast, consistent, already in your Next.js setup |
| **State** | `useChat` hook (in-memory) | Manages message history automatically |
| **Deployment** | Vercel | Zero config for Next.js. Free tier works. Live URL for portfolio. |

> 💡 **Why not the raw Anthropic SDK?** The Vercel AI SDK wraps it and adds streaming support, the `useChat` hook, and message formatting. For Stage 1, this saves significant complexity. In Stage 3 (Agents), you will use the raw SDK to understand what is happening underneath.

---

## 5. Prerequisites

- Node.js 18 or higher installed
- **pnpm** — install via [pnpm.io/installation](https://pnpm.io/installation) or `corepack enable` + `corepack prepare pnpm@latest --activate`
- Anthropic API key — get one at [console.anthropic.com](https://console.anthropic.com)
- Vercel account (free) for deployment
- Basic familiarity with Next.js App Router and TypeScript

> 💡 Get your API key before Day 1. You will need it immediately in Phase 1. Keep it secret — never commit it to GitHub.

---

## 6. Architecture

Understanding the data flow before you build it makes the code make sense.

### Data Flow

1. User types a message in the chat UI
2. `useChat` hook appends it to the messages array and sends the full array to `/api/chat`
3. The API route receives the messages array and calls the Claude API with streaming enabled
4. Claude streams tokens back to the API route
5. The API route forwards the stream to the frontend via Server-Sent Events (SSE)
6. `useChat` receives the stream and updates the UI in real time
7. When streaming ends, the assistant message is added to the messages array
8. Next message includes the full updated history — Claude sees the whole conversation

> 💡 **The key insight:** Claude has no memory. Your frontend is the memory. Every request sends the full conversation history. This is why long conversations cost more.

---

## 7. Step-by-Step Build Guide

### Phase 1: Project Setup

**1.1 — Initialise Next.js** (skip if you already have this repo)

From the **parent** directory if you want a new sibling folder named `ai-chat-portfolio`:

```bash
pnpm create next-app@latest ai-chat-portfolio --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-pnpm
cd ai-chat-portfolio
```

**1.2 — Install AI dependencies**

```bash
pnpm add ai @ai-sdk/anthropic
```

What these packages do:
- `ai` — Vercel AI SDK core (`streamText`, streaming helpers, transports)
- `@ai-sdk/anthropic` — Anthropic provider for the Vercel AI SDK
- **`@ai-sdk/react`** (add when you build the UI: `pnpm add @ai-sdk/react`) — React hooks such as `useChat` in AI SDK v6

**1.3 — Create environment file**

Create `.env.local` in the project root (never commit this file):

```env
ANTHROPIC_API_KEY=sk-ant-your-api-key-here
```

**1.4 — Verify .gitignore**

Open `.gitignore` and confirm secret env files are ignored. The default Next template often has `.env*`, which would also ignore **`.env.example`** — add a negation rule so the example can be committed:

```gitignore
.env*
!.env.example
```

**1.5 — Git remote (first push to GitHub)**

`create-next-app` initializes a local repo only. If `git push` says **no configured push destination**, create a repository on GitHub, then:

```bash
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git push -u origin main
```

---

### Phase 2: API Route (Backend)

**AI SDK v6:** Older articles use `maxTokens` and `toDataStreamResponse()`. In **`ai` v6**, prefer **`maxOutputTokens`** and the streaming **`Response`** helpers described in the [AI SDK reference](https://ai-sdk.dev/docs) (names differ by pattern: UI message stream vs plain text stream). The snippet below keeps the **original teaching shape**; adjust field and method names to match your installed major version.

This is where your Next.js backend calls the Claude API. The snippet and callouts below explain each decision.

**`app/api/chat/route.ts` (already in this repo — reproduce from scratch if learning)**

```ts
import { anthropic } from '@ai-sdk/anthropic';
import { streamText, convertToModelMessages } from 'ai';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: anthropic('claude-haiku-4-5-20251001'),
      system: `You are a personal branding coach for software engineers.
        Help with LinkedIn optimization, portfolio presentation,
        GitHub profiles, resume tailoring, and thought leadership.
        Be concise, actionable, and specific to software engineering.`,
      messages: await convertToModelMessages(messages),
      maxOutputTokens: 1024,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
```

> **`convertToModelMessages`:** The v6 `useChat` transport sends `UIMessage[]` (with `parts`) to the API, but `streamText` expects `ModelMessage[]`. This function bridges the two formats.

> **Model id:** Anthropic may reject deprecated ids — use a **current** Sonnet (or Haiku) string that appears in **`@ai-sdk/anthropic`** types or Anthropic’s model list, then keep this doc in sync when you change it.

> 💡 **Learning checkpoint:** Why do we send `messages` (array) and not just the latest user message? Because Claude has no memory — the full history is context. Remove history and Claude won't know what was said 2 messages ago.

---

### Phase 3: Chat UI

**`app/page.tsx` (already in this repo — reproduce from scratch if learning)**

The `useChat` hook manages messages state, sends requests via the default transport (`POST /api/chat`), handles streaming, and updates the UI. Study it.

**v6 API differences from older tutorials:** The v6 `useChat` (from `@ai-sdk/react`) does **not** provide `input`, `handleInputChange`, `handleSubmit`, `isLoading`, or `append`. Instead:
- Manage input state yourself with `useState`
- Send messages with `sendMessage({ text })`
- Derive loading from `status` (`'submitted'` or `'streaming'`)
- Render message content via `m.parts` (array of `{ type: 'text', text }` etc.), not `m.content`
- The default API path is `/api/chat` — no need to pass `{ api: '/api/chat' }`

**Checked-in `app/page.tsx` (beyond this minimal snippet):** multiline **`<textarea>`** with shared `submitMessage()` from **form `onSubmit`** and **`onKeyDown`** (**Enter** = send if not composing; **Shift+Enter** = newline), **`rows` / `resize-y` / `max-h-*`**, **`items-end`** on the form so **Send** aligns with the composer, **dark:** Tailwind on bubbles and inputs, **suggested prompts** when the thread is empty (see Phase 4), and a **“Thinking…”** row when `isLoading` and the last message is not yet from the assistant.

```tsx
'use client';
import { useChat } from '@ai-sdk/react';
import { useRef, useEffect, useState, type FormEvent } from 'react';

export default function ChatPage() {
  const { messages, sendMessage, status, setMessages } = useChat();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const isLoading = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');
    sendMessage({ text });
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Personal Branding Assistant</h1>
        {messages.length > 0 && (
          <button type="button" onClick={() => setMessages([])}>New Chat</button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((m) => (
          <div key={m.id} className={`p-4 rounded-lg ${
            m.role === 'user' ? 'bg-blue-100 ml-8' : 'bg-gray-100 mr-8'
          }`}>
            <span className="font-semibold text-sm">
              {m.role === 'user' ? 'You' : 'Assistant'}
            </span>
            <div className="mt-1 whitespace-pre-wrap">
              {m.parts.filter(p => p.type === 'text').map((p, i) => (
                <span key={i}>{p.text}</span>
              ))}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your personal brand..."
          className="flex-1 p-3 border rounded-lg"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Send
        </button>
      </form>
    </div>
  );
}
```

---

### Phase 4: Suggested Prompts (Empty State)

**Already implemented in this repo** in [`app/page.tsx`](app/page.tsx). When the chat is empty, show starter prompts. This improves UX and guides first-time users — important for a portfolio demo. The live code uses `type="button"`, `disabled={isLoading}` on each chip, and `dark:` styles so prompts match the rest of the UI.

Minimal teaching shape (reproduce if learning from scratch):

```tsx
const SUGGESTED_PROMPTS = [
  'Help me write a compelling LinkedIn headline',
  'Review my GitHub profile and suggest improvements',
  'Suggest 3 portfolio project ideas to showcase my skills',
  'How do I position myself for remote senior dev roles?',
];

// Add inside the messages container, before messages.map():
{messages.length === 0 && (
  <div className="flex flex-col gap-2 mt-4">
    <p className="text-sm text-gray-500">Try asking:</p>
    {SUGGESTED_PROMPTS.map((prompt) => (
      <button
        key={prompt}
        onClick={() => sendMessage({ text: prompt })}
        className="p-3 text-left border rounded-lg hover:bg-gray-50"
      >
        {prompt}
      </button>
    ))}
  </div>
)}
```

---

### Phase 5: Polish

**Markdown rendering**

```bash
pnpm add react-markdown
```

```tsx
import ReactMarkdown from 'react-markdown';

// In the parts rendering, wrap text in ReactMarkdown instead of a plain <span>:
{m.parts.filter(p => p.type === 'text').map((p, i) => (
  <ReactMarkdown key={i} className="prose dark:prose-invert">{p.text}</ReactMarkdown>
))}
```

**Copy-to-clipboard button (assistant messages only)**

```tsx
const copy = (text: string) => navigator.clipboard.writeText(text);
// Add a button next to each assistant message bubble
```

**New Chat button**

```tsx
// Already implemented in app/page.tsx (Phases 3–4):
const { messages, setMessages, ... } = useChat();
<button onClick={() => setMessages([])}>New Chat</button>
```

> 💡 **Optional but impressive:** Add a token counter in the UI showing approximate token usage. Formula: total characters in all messages / 4. Shows Upwork clients you understand AI cost management.

---

### Phase 6: Component Extraction (Optional but Recommended)

Once Phase 5 works, refactor into components. This shows code organisation skills to Upwork clients reviewing your repo.

- `components/ChatMessage.tsx` — single message bubble with role styling and copy button
- `components/MessageList.tsx` — scrollable list of messages + suggested prompts empty state
- `components/ChatInput.tsx` — multiline composer (`textarea`) + send button + loading / keyboard behaviour

---

### Phase 7: Deployment

**7.1 — Deploy to Vercel**

```bash
pnpm add -g vercel
vercel
```

Or connect your GitHub repo at [vercel.com](https://vercel.com) for automatic deploys on every push.

**7.2 — Add environment variable in Vercel**

Go to Vercel Dashboard → Your Project → Settings → Environment Variables. Add `ANTHROPIC_API_KEY` with your key value. Set to Production (and Preview).

**7.3 — Redeploy**

Trigger a new deployment after adding the env var. The env var is not available until a new deployment runs.

---

## 8. Part-Time Build Schedule

| Day | Task | Est. Time |
|-----|------|-----------|
| **Saturday** | Setup (Phases 1–2): Init project, install deps, create API route, test with Postman | 2 hrs |
| **Sunday** | UI + Streaming (Phases 3–4): Build chat UI, confirm streaming works, add suggested prompts | 2 hrs |
| **Monday eve** | Read Phase 2 code again. Ask Claude.ai to explain anything unclear. No coding needed. | 30 min |
| **Tuesday eve** | Polish (Phase 5): Add markdown, copy button, New Chat button | 45 min |
| **Wednesday eve** | Refactor (Phase 6): Extract components, clean up code | 45 min |
| **Thursday eve** | Deploy (Phase 7): Deploy to Vercel, test live URL, write README | 45 min |
| **Friday** | Buffer / polish. Take screenshots for portfolio. Done. | 30 min |

---

## 9. File Checklist

| File | Purpose |
|------|---------|
| `app/api/chat/route.ts` | Chat API endpoint — calls Claude with streaming |
| `app/page.tsx` | Main chat page with `useChat`, multiline composer, empty-state prompts |
| `components/ChatMessage.tsx` | Single message bubble (after refactor) |
| `components/ChatInput.tsx` | Input form (after refactor) |
| `components/MessageList.tsx` | Message list + empty state (after refactor) |
| `.env.local` | API key — gitignored, NEVER committed |
| `.env.example` | Template with placeholder key — safe to commit |
| `README.md` | Setup steps, tech stack badges, live demo link, screenshots |

---

## 10. Upwork Portfolio Showcase Guide

Building it is half the work. Showcasing it well is the other half.

### 10.1 — GitHub README Must-Haves

- Tech stack badges (Next.js, Tailwind, Claude, TypeScript, Vercel, **pnpm**)
- Live demo link at the top — above everything else
- `.env.example` with placeholder key so reviewers can run it locally
- 2–3 screenshots: desktop view, streaming in progress, mobile view
- Brief explanation of the AI architecture (1 paragraph) — shows you understand what you built
- Descriptive commit history — shows your build process, not just the final result

### 10.2 — What Makes This Stand Out

- It is a niche chatbot, not a generic "ask me anything" clone
- The target user (software engineers) is your actual Upwork client base — relatable
- Streaming shows real AI UX knowledge, not just a simple API call
- Deployed live URL — Upwork clients can try it immediately

### 10.3 — Upwork Profile Description Snippet

> Built a niche AI assistant using Next.js App Router and the Anthropic Claude API with real-time streaming responses, conversation history management, and Vercel deployment. Demonstrates full-stack AI integration from API design to production deployment.

---

## 11. Troubleshooting

| Issue | Solution |
|-------|---------|
| `git push` → **No configured push destination** | Add a remote: `git remote add origin <repo-url>` then `git push -u origin main` (see Phase 1.5). |
| **Another next dev server is already running** / port conflict | Only one `next dev` per project directory. Stop the other terminal or `taskkill /PID <pid> /F` (Windows) / `kill <pid>` (macOS/Linux). |
| `ANTHROPIC_API_KEY` not found | Ensure `.env.local` exists in project root (not `src/`). Restart dev server after creating it. |
| Stream or logs show **invalid / unknown model** (e.g. old `claude-3-5-sonnet-*`) | Update `anthropic('…')` in [`app/api/chat/route.ts`](app/api/chat/route.ts) to a **supported** model id from Anthropic or your installed `@ai-sdk/anthropic` typings. |
| Streaming not working | Confirm the API route returns a streaming **`Response`** compatible with your client transport (see AI SDK v6 docs). Check the chat hook targets `/api/chat`. |
| Messages not persisting on refresh | Expected — in-memory only for Stage 1. Intentional for simplicity. |
| CORS errors | Next.js API routes are same-origin. Only relevant if frontend and backend are on separate domains. |
| Rate limit errors | Add a user-friendly error message. Handle 429 status in the catch block. |
| Vercel env var not found in production | Trigger a new deployment after adding the env var in Vercel dashboard. |

---

## 12. Quick Reference Commands

```bash
# Create project (from parent directory)
pnpm create next-app@latest ai-chat-portfolio --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-pnpm

# Install dependencies (AI + optional markdown)
pnpm add ai @ai-sdk/anthropic react-markdown
pnpm add @ai-sdk/react

# Run dev server
pnpm dev

# Build for production
pnpm run build

# Deploy to Vercel (global CLI)
pnpm add -g vercel
vercel
```

---

*Stage 1 of your AI learning path. Build it, understand it, then move to Stage 2: RAG & Knowledge Bases.*