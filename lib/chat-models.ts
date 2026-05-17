export type ChatModelId =
  | "claude-haiku-4-5-20251001"
  | "gpt-5-mini";

export type ChatModelConfig = {
  id: ChatModelId;
  label: string;
  provider: "anthropic" | "openai";
  sdkModelId: string;
};

export const CHAT_MODELS: ChatModelConfig[] = [
  {
    id: "claude-haiku-4-5-20251001",
    label: "Claude Haiku 4.5",
    provider: "anthropic",
    sdkModelId: "claude-haiku-4-5-20251001",
  },
  {
    id: "gpt-5-mini",
    label: "GPT-5 mini",
    provider: "openai",
    sdkModelId: "gpt-5-mini",
  },
];

export const DEFAULT_CHAT_MODEL_ID: ChatModelId = "claude-haiku-4-5-20251001";

export function getChatModelConfig(
  modelId: string,
): ChatModelConfig | undefined {
  return CHAT_MODELS.find((m) => m.id === modelId);
}
