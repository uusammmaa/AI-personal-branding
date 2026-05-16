# AI Chat Assistant — Portfolio (Stage 1)

Personal-branding chatbot for software engineers: Next.js + Anthropic Claude (streaming), built as an Upwork portfolio piece.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![pnpm](https://img.shields.io/badge/pnpm-package%20manager-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Claude](https://img.shields.io/badge/Claude-Anthropic-D4A574)](https://www.anthropic.com/)

## Tech stack

| Layer | Choice |
|--------|--------|
| App | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| AI | [`ai`](https://sdk.vercel.ai/docs) (Vercel AI SDK v6), [`@ai-sdk/anthropic`](https://sdk.vercel.ai/providers/ai-sdk-providers/anthropic) |
| Package manager | **pnpm** (see `pnpm-lock.yaml`) |

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/installation)
- [Anthropic API key](https://console.anthropic.com/)

## Local setup

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Environment variables**

   Copy the example file and add your key (never commit real secrets):

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and set `ANTHROPIC_API_KEY`. Restart the dev server after changes.

3. **Run the dev server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Only one `next dev` instance should run per project folder; if the port is busy, stop the other process first.

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Development server (Turbopack) |
| `pnpm run build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |

## Build guide

Step-by-step phases (API route, streaming chat UI, polish, Vercel) live in **[PORTFOLIO_PROJECT_PLAN.md](./PORTFOLIO_PROJECT_PLAN.md)**.

## Deploy (Vercel)

1. Push the repo to GitHub and import it in [Vercel](https://vercel.com/).
2. Add **`ANTHROPIC_API_KEY`** under Project → Settings → Environment Variables (Production and Preview).
3. Redeploy so new variables are picked up.

---

Scaffolded with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) using **pnpm**.
