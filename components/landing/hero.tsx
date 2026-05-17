"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HeroCanvas = dynamic(
  () => import("./hero-canvas").then((m) => m.HeroCanvas),
  { ssr: false, loading: () => null }
);

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Hero() {
  return (
    <section className="relative isolate min-h-[92svh] overflow-hidden border-b border-border/60">
      <div className="mesh-blobs" aria-hidden />
      <HeroCanvas />

      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-background/20 via-transparent to-background" />

      <div className="relative z-10 mx-auto flex min-h-[92svh] max-w-6xl flex-col justify-center px-4 pb-24 pt-28 md:px-8 md:pb-32 md:pt-32">
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="font-display text-xs uppercase tracking-[0.4em] text-primary md:text-sm"
        >
          Jezerox · AI systems for ambitious businesses
        </motion.p>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="font-display mt-6 max-w-4xl text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.92] tracking-tight text-foreground"
        >
          I Build AI That Works For Your Business.
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl"
        >
          I&apos;m{" "}
          <span className="text-foreground">Usama Akram</span>, AI architect and
          full-stack engineer based in{" "}
          <span className="text-accent">Lahore, PK</span>. Through{" "}
          <a
            href="https://jezerox.com"
            className="text-primary underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Jezerox
          </a>
          , I turn messy real-world operations into reliable assistants, agentic
          pipelines, and production-grade AI products—not slides, shipped software.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-10 flex flex-wrap gap-3"
        >
          <a
            href="#work"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-11 px-6 text-base shadow-lg shadow-primary/10"
            )}
          >
            See My Work
          </a>
          <a
            href="#contact"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 border-primary/40 bg-background/40 px-6 text-base backdrop-blur-sm hover:bg-muted/50"
            )}
          >
            Let&apos;s Talk
          </a>
        </motion.div>
      </div>
    </section>
  );
}
