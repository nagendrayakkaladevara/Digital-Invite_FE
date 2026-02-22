/**
 * Marriage API client
 * Base URL (development): http://localhost:5000
 */

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export type ChatModel =
  | "gemini"
  | "gemini-3-flash-preview"
  | "sarvam"
  | "sarvam-m";

export interface ChatSuccessResponse {
  success: true;
  data: {
    question: string;
    response: string;
    model: string;
    id: string;
    createdAt: string;
  };
}

export interface ChatErrorResponse {
  success?: false;
  error: string;
  details?: string;
}

export type ChatResponse = ChatSuccessResponse | ChatErrorResponse;

export interface ChatResult {
  ok: true;
  response: string;
  model: string;
  id: string;
  createdAt: string;
}

export interface ChatError {
  ok: false;
  error: string;
  details?: string;
  status: number;
}

export type ChatApiResult = ChatResult | ChatError;

/**
 * Send a question to the AI chat endpoint.
 * @param model - Model identifier (gemini, gemini-3-flash-preview, sarvam, sarvam-m)
 * @param question - The user's question (non-empty)
 * @returns Resolved result or error
 */
export async function sendChatMessage(
  model: ChatModel,
  question: string
): Promise<ChatApiResult> {
  const trimmed = question.trim();
  if (!trimmed) {
    return {
      ok: false,
      error: "question cannot be empty",
      status: 400,
    };
  }

  try {
    const res = await fetch(`${API_BASE}/api/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, question: trimmed }),
    });

    const data: ChatResponse = await res.json();

    if (!res.ok) {
      const err = data as ChatErrorResponse;
      return {
        ok: false,
        error: err.error ?? "Request failed",
        details: err.details,
        status: res.status,
      };
    }

    const success = data as ChatSuccessResponse;
    if (!success.success || !success.data) {
      return {
        ok: false,
        error: "Invalid response from server",
        status: res.status,
      };
    }

    return {
      ok: true,
      response: success.data.response,
      model: success.data.model,
      id: success.data.id,
      createdAt: success.data.createdAt,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Network error";
    return {
      ok: false,
      error: "Unable to reach the AI service. Please check your connection.",
      details: msg,
      status: 0,
    };
  }
}
