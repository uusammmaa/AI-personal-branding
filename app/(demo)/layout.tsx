import { DemoSidebar } from "@/components/DemoSidebar";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DemoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen min-h-0 w-full flex-col bg-gray-50 dark:bg-gray-950">
      <header className="flex shrink-0 items-center border-b border-gray-200 bg-white px-4 py-2.5 dark:border-gray-800 dark:bg-gray-900">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
        >
          <ArrowLeft className="size-4 shrink-0" aria-hidden />
          Back to portfolio
        </Link>
      </header>
      <div className="flex min-h-0 min-w-0 flex-1">
        <DemoSidebar />
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
