const API = process.env.NEXT_PUBLIC_API_URL!;

export type QuotePayload = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  product_of_interest?: string;
  quantity?: string;
  message: string;
};

export type QuoteResult =
  | { ok: true; id: number }
  | { ok: false; error: string; fields?: Record<string, string[]> };

export async function submitQuote(payload: QuotePayload): Promise<QuoteResult> {
  try {
    const res = await fetch(`${API}/inquiries/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.status === 201) {
      const data = await res.json();
      return { ok: true, id: data.id };
    }

    if (res.status === 400) {
      const data = await res.json();
      return {
        ok: false,
        error: "Please correct the errors below.",
        fields: data,
      };
    }

    return { ok: false, error: `Unexpected error (${res.status}). Please try again.` };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Network error. Please try again.",
    };
  }
}