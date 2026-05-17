"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/coach", label: "Coach", description: "Next.js + streaming LLM" },
  {
    href: "/rag",
    label: "RAG — Pinecone",
    description: "FastAPI RAG + PDF + Pinecone",
  },
  {
    href: "/rag-supabase",
    label: "RAG — Supabase",
    description: "Same pipeline + pgvector in Postgres",
  },
] as const;

export function DemoSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="border-b border-gray-200 p-4 dark:border-gray-800">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Demo
        </p>
        <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
          AI Chat
        </p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-2">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              <span className="font-medium">{item.label}</span>
              <span
                className={`mt-0.5 block text-xs ${
                  active ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {item.description}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
