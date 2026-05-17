"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { ReactLenis } from "lenis/react";

function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = React.useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fn = () => setReduce(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  return reduce;
}

export function MarketingProviders({ children }: { children: React.ReactNode }) {
  const reduceMotion = usePrefersReducedMotion();

  const inner = reduceMotion ? (
    children
  ) : (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      forcedTheme="dark"
      disableTransitionOnChange
    >
      {inner}
    </ThemeProvider>
  );
}
