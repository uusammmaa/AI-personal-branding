import type { ResearchBrief } from "@/lib/agent-types";

export function extractBriefFromText(text: string): ResearchBrief | null {
  const fence = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/i);
  const candidates = [fence?.[1]?.trim(), text.trim()].filter(Boolean) as string[];

  for (const source of candidates) {
    let idx = source.indexOf("{");
    while (idx !== -1) {
      try {
        const parsed = JSON.parse(source.slice(idx)) as ResearchBrief;
        if (parsed.role && parsed.company) return parsed;
      } catch {
        // try next opening brace
      }
      idx = source.indexOf("{", idx + 1);
    }
  }

  return null;
}

export function parseBriefOutput(output: string | undefined): ResearchBrief | null {
  if (!output) return null;
  try {
    return JSON.parse(output) as ResearchBrief;
  } catch {
    return extractBriefFromText(output);
  }
}
