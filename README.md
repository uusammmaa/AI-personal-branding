# AI Chat Assistant — Portfolio (Stage 1)

**Live demo:** _After you deploy to Vercel, put your production URL here so clients can try the app in one click._

A niche **personal-branding coach** for software engineers: streaming chat with **Anthropic Claude** (Haiku), built with **Next.js App Router** and the **Vercel AI SDK v6** as an Upwork-style portfolio project. Conversation history lives in the browser (in-memory); each request sends the full thread to the model—see [Architecture](#architecture).

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![pnpm](https://img.shields.io/badge/pnpm-package%20manager-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Claude](https://img.shields.io/badge/Claude-Anthropic-D4A574)](https://www.anthropic.com/)
[![Vercel](https://img.shields.io/badge/Vercel-deploy-000000?logo=vercel&logoColor=white)](https://vercel.com/)

## Features

- **Streaming replies** — `streamText` + `toUIMessageStreamResponse()` on `POST /api/chat`; UI uses `useChat` from `@ai-sdk/react` (v6 message shape with `parts`).
- **System prompt** — Coach focused on LinkedIn, portfolio, GitHub, resume, and thought leadership for engineers (`app/api/chat/route.ts`).
- **Suggested prompts** — Empty-state chips so first-time users know what to ask (`MessageList`).
- **Polished assistant output** — Assistant messages render with **react-markdown** + Tailwind Typography (`prose`); user messages stay plain text. **Copy** per assistant message; fenced code scrolls inside the bubble (`min-w-0`, overflow-safe layout).
- **Composer** — Multiline textarea: **Enter** sends, **Shift+Enter** newline; respects IME composition. **New Chat** clears the thread.
- **Component layout** — `ChatMessage`, `MessageList`, and `ChatInput` under `components/` for easier review.

## Architecture

The React client keeps the conversation. On each send, **`useChat`** posts the full **`UIMessage[]`** to **`/api/chat`**. The route converts them with **`convertToModelMessages`**, calls **`streamText`** against **`claude-haiku-4-5-20251001`** with **`maxOutputTokens: 1024`**, and returns a UI message stream. The hook applies incoming chunks so the assistant bubble updates in real time—no server-side session store in Stage 1.

For API naming across AI SDK majors, use the official docs: [AI SDK](https://ai-sdk.dev/docs).

## Tech stack

| Layer | Choice |
|--------|--------|
| App | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, `@tailwindcss/typography` (`app/globals.css`) |
| AI | `ai` v6, `@ai-sdk/anthropic`, `@ai-sdk/react` (`useChat`, `sendMessage`, `status`) |
| Markdown | `react-markdown` (assistant bubbles only) |
| Package manager | **pnpm** (`pnpm-lock.yaml`) |
| Hosting | Vercel (recommended; env var `ANTHROPIC_API_KEY`) |

## Project layout

| Path | Role |
|------|------|
| [`app/api/chat/route.ts`](app/api/chat/route.ts) | `POST /api/chat` — Claude streaming + system prompt + `maxOutputTokens` |
| [`app/page.tsx`](app/page.tsx) | Chat shell: `useChat`, header, **New Chat** |
| [`app/globals.css`](app/globals.css) | Tailwind + `@plugin "@tailwindcss/typography"` |
| [`components/ChatMessage.tsx`](components/ChatMessage.tsx) | Bubble, markdown vs plain text, copy |
| [`components/MessageList.tsx`](components/MessageList.tsx) | Scroll area, suggested prompts, “Thinking…” |
| [`components/ChatInput.tsx`](components/ChatInput.tsx) | Textarea + send + keyboard behavior |
| [`.env.example`](.env.example) | Template for `ANTHROPIC_API_KEY` (safe to commit) |
| `.env.local` | Create locally from `.env.example`; holds your real key — **gitignored**, never commit |

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/installation) (this repo expects pnpm, not npm, so the lockfile stays consistent)
- [Anthropic API key](https://console.anthropic.com/)

## Local setup

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Set `ANTHROPIC_API_KEY` in `.env.local`. Restart `pnpm dev` after changes.

3. **Run the dev server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Only one `next dev` per project directory; free the port if another instance is running.

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Development server |
| `pnpm run build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |

## Build guide & troubleshooting

Phased walkthrough (setup through deploy), learning goals, and a **troubleshooting** table (model ids, streaming, `maxOutputTokens`, layout) are in **[PORTFOLIO_PROJECT_PLAN.md](./PORTFOLIO_PROJECT_PLAN.md)**.

## Deploy (Vercel)

1. Push the repo to GitHub and import it in [Vercel](https://vercel.com/).
2. Add **`ANTHROPIC_API_KEY`** under Project → Settings → Environment Variables (Production and Preview).
3. Trigger a **new deployment** so the variable is available, then add the site URL at the top of this README.

---

Scaffolded with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) using **pnpm**.
