import { anthropic } from "@ai-sdk/anthropic";
import { streamText, convertToModelMessages } from "ai";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: anthropic("claude-haiku-4-5-20251001"),
      system: `You are a personal branding coach for software engineers.
        Help with LinkedIn optimization, portfolio presentation,
        GitHub profiles, resume tailoring, and thought leadership.
        Be concise, actionable, and specific to software engineering.`,
      messages: await convertToModelMessages(messages),
      maxOutputTokens: 1024,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
