export const DEFAULT_CHAT_MODEL_ID = "gpt-5-nano" as const;

export const CHAT_MODELS = [
  {
    id: "gpt-5-nano",
    label: "GPT-5 nano",
    provider: "openai" as const,
    sdkModelId: "gpt-5-nano",
  },
  {
    id: "claude-haiku-4-5-20251001",
    label: "Claude Haiku 4.5",
    provider: "anthropic" as const,
    sdkModelId: "claude-haiku-4-5-20251001",
  },
] as const;

export type ChatModelId = (typeof CHAT_MODELS)[number]["id"];

export type ChatModelConfig = (typeof CHAT_MODELS)[number];

const CHAT_MODEL_BY_ID = new Map<string, ChatModelConfig>(
  CHAT_MODELS.map((m) => [m.id, m]),
);

export function getChatModelConfig(id: string): ChatModelConfig | undefined {
  return CHAT_MODEL_BY_ID.get(id);
}
