import { type NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const IS_DEV = process.env.NODE_ENV === "development";

interface ProxyPayload {
  path: string;
  method?: string;
  locale?: string;
  token?: string;
  body?: string;
}

/**
 * Browser-side API proxy.
 *
 * Mobile Safari/Chrome reject the API's SSL cert (issued for *.irandns.com,
 * not api.kaizenryu.org). Desktop users work because they've accepted the
 * cert exception manually; mobile has no such escape hatch.
 *
 * Solution: browser calls this same-origin route, which forwards the request
 * server-side using node:https with rejectUnauthorized:false — the same
 * workaround already in place for SSR GET requests.
 */
export async function POST(request: NextRequest) {
  let payload: ProxyPayload;
  try {
    payload = (await request.json()) as ProxyPayload;
  } catch {
    return NextResponse.json({ error: "Invalid proxy request body" }, { status: 400 });
  }

  const { path, method = "GET", locale = "fa", token, body } = payload;

  if (!path) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  const fullUrl = `${API_BASE}${path}`;

  if (IS_DEV) {
    console.log(`[proxy] → ${method} ${fullUrl} (locale=${locale})`);
  }

  try {
    const https = await import("node:https");
    const { URL: NodeURL } = await import("node:url");
    const parsed = new NodeURL(fullUrl);

    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Locale": locale,
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (body) headers["Content-Length"] = Buffer.byteLength(body).toString();

    const { status, text } = await new Promise<{ status: number; text: string }>(
      (resolve, reject) => {
        const req = https.request(
          {
            hostname: parsed.hostname,
            port: parsed.port || 443,
            path: parsed.pathname + parsed.search,
            method,
            headers,
            rejectUnauthorized: false,
          },
          (res) => {
            const chunks: Buffer[] = [];
            res.on("data", (chunk: Buffer) => chunks.push(chunk));
            res.on("end", () =>
              resolve({
                status: res.statusCode ?? 0,
                text: Buffer.concat(chunks).toString("utf8"),
              })
            );
          }
        );
        req.on("error", reject);
        if (body) req.write(body);
        req.end();
      }
    );

    if (IS_DEV) {
      console.log(`[proxy] ← ${status} ${fullUrl} — ${text.slice(0, 200)}`);
    }

    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      if (IS_DEV) {
        console.error(`[proxy] non-JSON from upstream: ${text.slice(0, 200)}`);
      }
      return NextResponse.json(
        { error: "Non-JSON response from upstream" },
        { status: 502 }
      );
    }

    return NextResponse.json(json, { status });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Proxy network error";
    if (IS_DEV) {
      console.error(`[proxy] ✗ ${fullUrl}:`, err);
    }
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
