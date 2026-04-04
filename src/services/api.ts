import { env } from "@/config/env";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type FetchOptions = RequestInit & {
  /** Query string plano */
  searchParams?: Record<string, string | number | boolean | undefined>;
  /** Next.js: revalidación en fetch de servidor */
  next?: { revalidate?: number | false; tags?: string[] };
};

function buildUrl(path: string, searchParams?: FetchOptions["searchParams"]): string {
  const base = env.apiBaseUrl.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${base}${p}`);
  if (searchParams) {
    for (const [k, v] of Object.entries(searchParams)) {
      if (v === undefined) continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

/**
 * Cliente HTTP hacia el backend NestJS.
 * En Server Components puede usarse directamente; en cliente, preferir route handlers o CORS configurado en Nest.
 */
export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { searchParams, headers, next, ...rest } = options;
  const url = buildUrl(path, searchParams);
  const isGet = (rest.method ?? "GET").toUpperCase() === "GET";
  const isServer = typeof window === "undefined";

  const body = rest.body;
  const isFormData =
    typeof FormData !== "undefined" &&
    body != null &&
    typeof body === "object" &&
    body instanceof FormData;

  const res = await fetch(url, {
    ...rest,
    ...(isServer
      ? { next: next ?? (isGet ? { revalidate: 60 } : undefined) }
      : {}),
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(headers as Record<string, string>),
    },
  });

  if (!res.ok) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = await res.text();
    }
    throw new ApiError(res.statusText || "Error API", res.status, body);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
