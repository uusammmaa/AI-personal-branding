import { DemoSidebar } from "@/components/DemoSidebar";

export default function DemoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen min-h-0 w-full bg-gray-50 dark:bg-gray-950">
      <DemoSidebar />
      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
