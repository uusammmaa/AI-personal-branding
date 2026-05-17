"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MuxPlayer = dynamic(
  () => import("@mux/mux-player-react").then((m) => m.default),
  { ssr: false, loading: () => null }
);

export function CaseStudyMux() {
  const id = process.env.NEXT_PUBLIC_MUX_PLAYBACK_ID;
  if (!id) return null;

  return (
    <div className="mt-16 rounded-xl border border-border/80 bg-card/40 p-4 md:p-6">
      <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-xs uppercase tracking-[0.3em] text-primary">
            Featured reel
          </p>
          <h3 className="font-display mt-1 text-2xl text-foreground">
            Product walkthrough
          </h3>
        </div>
        <Link
          href="/coach"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-muted-foreground"
          )}
        >
          Open live demos →
        </Link>
      </div>
      <MuxPlayer
        playbackId={id}
        accentColor="#2dd4bf"
        className="aspect-video w-full overflow-hidden rounded-lg"
      />
    </div>
  );
}
