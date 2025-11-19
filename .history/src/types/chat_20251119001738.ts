export interface PictogramSuggestion {
  id: string | number;
  label: string;
  url: string;
  confidence?: number;
  token?: string;
}

export interface IntentProbability {
  intent: string;
  confidence: number;
}

export interface IntentBreakdown {
  decided: string;
  confidence: number;
  alternatives: IntentProbability[];
}

export interface AssistantResponse {
  text: string;
  tone: string;
  pictograms: PictogramSuggestion[];
}

export interface OrchestratorInfo {
  pipeline: string;
  llm_used: boolean;
  threshold: number;
}

export interface ChatResponsePayload {
  session_id: string;
  turn_id: string;
  received_at: string;
  intent: IntentBreakdown;
  response: AssistantResponse;
  orchestrator: OrchestratorInfo;
}

export interface ChatRequestPayload {
  text: string;
  includePictograms?: boolean;
}
