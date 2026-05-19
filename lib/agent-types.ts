export type AgentStepType =
  | "tool_call"
  | "tool_result"
  | "complete"
  | "error";

export type AgentStep = {
  type: AgentStepType;
  tool?: string;
  input?: string;
  output?: string;
  message?: string;
};

export type ResearchBrief = {
  role: string;
  company: string;
  location: string;
  tech_stack: string[];
  key_requirements: string[];
  company_summary: string;
  culture_signals: string[];
  talking_points: string[];
  red_flags: string[];
  sources: string[];
};
