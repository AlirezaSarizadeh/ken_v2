const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL && typeof window === "undefined") {
  console.warn("NEXT_PUBLIC_API_BASE_URL is not set");
}

type ApiResult<T> = { data: T; error: null } | { data: null; error: string };

export async function apiFetch<T>(
  path: string,
  locale: string = "fa",
  options: RequestInit & { revalidate?: number } = {},
  token?: string
): Promise<ApiResult<T>> {
  const { revalidate, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
    "X-Locale": locale,
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (fetchOptions.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...fetchOptions,
      headers,
      next: revalidate !== undefined ? { revalidate } : undefined,
    });

    if (!res.ok) {
      let errorMessage = `API error ${res.status}`;
      try {
        const body = await res.json();
        errorMessage = body?.message ?? body?.error ?? errorMessage;
      } catch {
        // non-JSON error body
      }
      return { data: null, error: errorMessage };
    }

    const json = await res.json();
    const data: T = json?.data !== undefined ? json.data : json;
    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

export async function apiPost<T>(
  path: string,
  body: unknown,
  locale: string = "fa",
  token?: string
): Promise<ApiResult<T>> {
  return apiFetch<T>(
    path,
    locale,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    token
  );
}
