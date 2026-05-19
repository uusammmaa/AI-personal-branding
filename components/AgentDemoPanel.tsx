"use client";

import { useState } from "react";

import { AgentSteps } from "@/components/AgentSteps";
import { ResearchBriefCard } from "@/components/ResearchBrief";
import { Button } from "@/components/ui/button";
import { useAgentStream } from "@/lib/use-agent-stream";

export function AgentDemoPanel() {
  const [url, setUrl] = useState("");
  const { steps, brief, error, running, run, reset } = useAgentStream();

  const hasResults = steps.length > 0 || brief !== null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!url.trim() || running) return;
    run(url);
  }

  function handleReset() {
    setUrl("");
    reset();
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col px-4 py-6 md:px-8 md:py-8">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-3xl tracking-wide text-foreground md:text-4xl">
            Job Research Agent
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
            Paste a job posting URL — the agent fetches the listing, searches
            the company, and streams each tool step in real time.
          </p>
        </div>
        {hasResults ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={running}
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            New Research
          </Button>
        ) : null}
      </header>

      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://jobs.example.com/senior-engineer"
          disabled={running}
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        />
        <Button type="submit" disabled={running || !url.trim()}>
          {running ? "Running…" : "Research"}
        </Button>
      </form>

      {error ? (
        <p className="mb-4 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <div
        className={
          brief
            ? "grid min-h-0 flex-1 gap-6 md:grid-cols-2 md:items-start"
            : "min-h-0 flex-1"
        }
      >
        <div className="min-h-0 space-y-3 overflow-y-auto">
          {running && steps.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Agent is starting…
            </p>
          ) : null}
          <AgentSteps steps={steps} />
        </div>

        {brief ? (
          <div className="min-h-0 overflow-y-auto">
            <ResearchBriefCard brief={brief} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
