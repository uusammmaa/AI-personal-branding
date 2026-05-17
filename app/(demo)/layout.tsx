import { DemoShell } from "@/components/DemoShell";
import {
  marketingFontVariableClassName,
  marketingRootClassName,
} from "@/lib/marketing-fonts";
import { cn } from "@/lib/utils";

import "../(marketing)/marketing.css";

export default function DemoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={cn(marketingRootClassName, marketingFontVariableClassName)}
    >
      <DemoShell>{children}</DemoShell>
    </div>
  );
}
