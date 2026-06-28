const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL && typeof window === "undefined") {
  console.warn("[apiFetch] NEXT_PUBLIC_API_BASE_URL is not set");
}

const IS_DEV = process.env.NODE_ENV === "development";

type ApiResult<T> = { data: T; error: null } | { data: null; error: string };

/**
 * Server-side fetch using node:https so we can pass a custom agent.
 * The API cert is issued for *.irandns.com (wrong domain) — Node.js rejects
 * it by default. We disable rejectUnauthorized only for this specific host.
 */
async function serverFetch(url: string, headers: Record<string, string>, method = "GET", body?: string): Promise<{ status: number; text: () => Promise<string> }> {
  const https = await import("node:https");
  const { URL } = await import("node:url");
  const parsed = new URL(url);

  return new Promise((resolve, reject) => {
    const options = {
      hostname: parsed.hostname,
      port: parsed.port || 443,
      path: parsed.pathname + parsed.search,
      method,
      headers: {
        ...headers,
        ...(body ? { "Content-Length": Buffer.byteLength(body).toString() } : {}),
      },
      rejectUnauthorized: false,
    };

    const req = https.request(options, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => {
        const text = Buffer.concat(chunks).toString("utf8");
        resolve({
          status: res.statusCode ?? 0,
          text: () => Promise.resolve(text),
        });
      });
    });

    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

export async function apiFetch<T>(
  path: string,
  locale: string = "fa",
  options: RequestInit & { revalidate?: number } = {},
  token?: string
): Promise<ApiResult<T>> {
  const { revalidate: _revalidate, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
    "X-Locale": locale,
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const bodyStr = fetchOptions.body as string | undefined;
  if (bodyStr && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const fullUrl = `${BASE_URL}${path}`;
  const method = (fetchOptions.method ?? "GET").toUpperCase();

  if (IS_DEV) {
    console.log(`[apiFetch] → ${method} ${fullUrl} (locale=${locale})`);
  }

  try {
    let status: number;
    let rawText: string;

    if (typeof window === "undefined") {
      // Server-side: use node:https with rejectUnauthorized:false for this host
      const res = await serverFetch(fullUrl, headers, method, bodyStr);
      status = res.status;
      rawText = await res.text();
    } else {
      // Browser: route through /api/proxy (same-origin) so mobile Safari/Chrome
      // are not blocked by the API's SSL cert mismatch (*.irandns.com).
      // The proxy forwards server-side with rejectUnauthorized:false.
      const proxyRes = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path,
          method,
          locale,
          token,
          body: bodyStr,
        }),
      });
      status = proxyRes.status;
      rawText = await proxyRes.text();
      if (IS_DEV) {
        console.log(
          `[apiFetch/browser] → ${method} ${fullUrl} via /api/proxy → HTTP ${status}`
        );
      }
    }

    if (IS_DEV) {
      console.log(`[apiFetch] ← ${status} ${fullUrl} — body: ${rawText.slice(0, 300)}`);
    }

    if (status < 200 || status >= 300) {
      let errorMessage = `API error ${status}`;
      try {
        const parsed = JSON.parse(rawText);
        errorMessage = parsed?.message ?? parsed?.error ?? errorMessage;
      } catch {
        // non-JSON
      }
      if (IS_DEV) {
        console.error(`[apiFetch] ✗ ${status} ${fullUrl} — ${errorMessage}`);
        console.error(`[apiFetch]   body: ${rawText.slice(0, 500)}`);
      }
      return { data: null, error: errorMessage };
    }

    let json: unknown;
    try {
      json = JSON.parse(rawText);
    } catch (parseErr) {
      if (IS_DEV) {
        console.error(`[apiFetch] ✗ JSON parse failed ${fullUrl}:`, parseErr);
        console.error(`[apiFetch]   raw: ${rawText.slice(0, 500)}`);
      }
      return { data: null, error: "Invalid JSON response" };
    }

    const obj = json as Record<string, unknown> | null;
    const data: T = (obj && obj.data !== undefined ? obj.data : json) as T;
    return { data, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Network error";
    const isBrowser = typeof window !== "undefined";
    // Always log network errors — critical for debugging mobile failures
    console.error(
      `[apiFetch] ✗ ${method} ${isBrowser ? "(browser→proxy)" : "(server)"} ${fullUrl}`,
      `— ${msg}`
    );
    return { data: null, error: msg };
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
