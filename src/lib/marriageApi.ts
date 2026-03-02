/**
 * Marriage API client
 * Base URL: https://digital-invite-be.vercel.app
 * Override with VITE_API_URL for local dev (e.g. http://localhost:5000)
 */

const API_BASE = import.meta.env.VITE_API_URL ?? "https://digital-invite-be.vercel.app";

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

// ---------------------------------------------------------------------------
// Feedback API
// ---------------------------------------------------------------------------

export interface FeedbackPayload {
  description?: string;
  number?: string;
}

export interface FeedbackSuccessResponse {
  success: true;
  data?: unknown;
}

export interface FeedbackErrorResponse {
  success?: false;
  error: string;
  details?: string;
}

export type FeedbackResponse = FeedbackSuccessResponse | FeedbackErrorResponse;

export interface FeedbackResult {
  ok: true;
}

export interface FeedbackApiError {
  ok: false;
  error: string;
  details?: string;
  status: number;
}

export type FeedbackApiResult = FeedbackResult | FeedbackApiError;

/**
 * Submit feedback. Both description and number are optional.
 */
export async function postFeedback(payload: FeedbackPayload): Promise<FeedbackApiResult> {
  try {
    const res = await fetch(`${API_BASE}/api/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: payload.description?.trim() || undefined,
        number: payload.number?.trim() || undefined,
      }),
    });

    const data: FeedbackResponse = await res.json();

    if (!res.ok) {
      const err = data as FeedbackErrorResponse;
      return {
        ok: false,
        error: err.error ?? "Request failed",
        details: err.details,
        status: res.status,
      };
    }

    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Network error";
    return {
      ok: false,
      error: "Unable to submit feedback. Please check your connection.",
      details: msg,
      status: 0,
    };
  }
}

// ---------------------------------------------------------------------------
// Feedback List API (Admin)
// ---------------------------------------------------------------------------

export interface FeedbackEntry {
  _id: string;
  description?: string;
  number?: string;
  createdAt: string;
}

export interface FeedbackListSuccessResponse {
  success: true;
  data: FeedbackEntry[];
  page: number;
  limit: number;
  total: number;
}

export interface FeedbackListErrorResponse {
  success?: false;
  error: string;
}

/**
 * Fetch paginated feedback list (admin use).
 */
export async function getFeedbackList(
  page = 1,
  limit = 20
): Promise<
  | { ok: true; data: FeedbackEntry[]; page: number; limit: number; total: number }
  | FeedbackApiError
> {
  try {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    const res = await fetch(`${API_BASE}/api/feedback?${params}`);
    const json: FeedbackListSuccessResponse | FeedbackListErrorResponse = await res.json();

    if (!res.ok) {
      const err = json as FeedbackListErrorResponse;
      return {
        ok: false,
        error: err.error ?? "Failed to fetch feedback",
        status: res.status,
      };
    }

    const data = json as FeedbackListSuccessResponse;
    if (!data.success || !data.data) {
      return {
        ok: false,
        error: "Invalid response from server",
        status: res.status,
      };
    }

    return {
      ok: true,
      data: data.data,
      page: data.page,
      limit: data.limit,
      total: data.total,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Network error";
    return {
      ok: false,
      error: "Unable to fetch feedback. Please check your connection.",
      details: msg,
      status: 0,
    };
  }
}
