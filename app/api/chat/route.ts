import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import {
  DEFAULT_CHAT_MODEL_ID,
  getChatModelConfig,
} from "@/lib/chat-models";

const SYSTEM = `You are a personal branding coach for software engineers.
        Help with LinkedIn optimization, portfolio presentation,
        GitHub profiles, resume tailoring, and thought leadership.
        Be concise, actionable, and specific to software engineering.`;

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, model: modelIdRaw } = body as {
      messages: UIMessage[];
      model?: unknown;
    };

    const modelId =
      typeof modelIdRaw === "string" && modelIdRaw.trim()
        ? modelIdRaw.trim()
        : DEFAULT_CHAT_MODEL_ID;

    const config = getChatModelConfig(modelId);
    if (!config) {
      return jsonError(`Unknown model: ${modelId}`, 400);
    }

    let model;
    if (config.provider === "openai") {
      const apiKey = process.env.OPEN_AI_API_KEY;
      if (!apiKey) {
        return jsonError(
          "OPEN_AI_API_KEY is not set. Add it to use OpenAI models.",
          500,
        );
      }
      model = createOpenAI({ apiKey })(config.sdkModelId);
    } else {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        return jsonError(
          "ANTHROPIC_API_KEY is not set. Add it to use Anthropic models.",
          500,
        );
      }
      model = createAnthropic({ apiKey })(config.sdkModelId);
    }

    const result = streamText({
      model,
      system: SYSTEM,
      messages: await convertToModelMessages(
        messages as Parameters<typeof convertToModelMessages>[0],
      ),
      // GPT-5 family uses internal reasoning; default "medium" + low cap can
      // consume the whole budget with no visible answer text.
      ...(config.provider === "openai"
        ? {
            maxOutputTokens: 4096,
            providerOptions: {
              openai: {
                reasoningEffort: "minimal" as const,
              },
            },
          }
        : { maxOutputTokens: 1024 }),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return jsonError(
      error instanceof Error ? error.message : "Failed",
      500,
    );
  }
}
