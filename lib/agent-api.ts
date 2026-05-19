export const agentApiBase =
  process.env.NEXT_PUBLIC_AGENT_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000";
