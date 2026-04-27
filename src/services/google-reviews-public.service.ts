import { normalizeApiSingleResponse } from "@/lib/normalize-api-single";
import type {
  GoogleReviewPublic,
  GoogleReviewsPublicPayload,
} from "@/types/google-reviews-public";
import { apiFetch } from "@/services/api";

function pickString(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length > 0 ? t : undefined;
}

function pickNumber(v: unknown): number | undefined {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function normalizeReview(raw: unknown): GoogleReviewPublic | null {
  if (raw == null || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const text =
    pickString(r.text) ??
    pickString(r.comment) ??
    pickString(r.reviewText) ??
    "";
  if (!text) return null;
  const authorName =
    pickString(r.authorName) ??
    pickString(r.author_name) ??
    pickString(r.name) ??
    "Cliente";
  const ratingRaw = pickNumber(r.rating) ?? pickNumber(r.ratingValue) ?? 5;
  const rating = Math.min(5, Math.max(1, Math.round(ratingRaw)));
  const relativeTime =
    pickString(r.relativeTime) ??
    pickString(r.relative_time_description) ??
    pickString(r.time) ??
    "";
  const authorPhotoUrl =
    pickString(r.authorPhotoUrl) ??
    pickString(r.profile_photo_url) ??
    pickString(r.photoUrl) ??
    null;

  return {
    authorName,
    authorPhotoUrl,
    rating,
    text,
    relativeTime,
  };
}

function extractReviewsArray(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;
  if (raw != null && typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    for (const k of ["reviews", "items", "data"] as const) {
      const nested = o[k];
      if (Array.isArray(nested)) return nested;
      if (nested != null && typeof nested === "object") {
        const d = nested as Record<string, unknown>;
        if (Array.isArray(d.reviews)) return d.reviews;
      }
    }
  }
  return [];
}

/**
 * Normaliza cuerpos típicos de Nest: plano, `{ data: ... }` o `{ data: { reviews } }`.
 */
export function normalizePublicGoogleReviewsPayload(raw: unknown): GoogleReviewsPublicPayload {
  const unwrapped = (() => {
    try {
      return normalizeApiSingleResponse<Record<string, unknown>>(raw);
    } catch {
      return raw != null && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
    }
  })();

  const obj = unwrapped as Record<string, unknown>;
  const inner = obj.data != null && typeof obj.data === "object" ? (obj.data as Record<string, unknown>) : obj;

  const fromInner = extractReviewsArray(inner);
  const reviewsRaw = fromInner.length > 0 ? fromInner : extractReviewsArray(obj);

  const reviews = reviewsRaw
    .map(normalizeReview)
    .filter((x): x is GoogleReviewPublic => x != null);

  const avg =
    pickNumber(inner.averageRating) ??
    pickNumber(inner.average_rating) ??
    pickNumber(inner.rating) ??
    pickNumber(obj.averageRating) ??
    (reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0);

  const totalFromApi =
    pickNumber(inner.totalReviews) ??
    pickNumber(inner.total_reviews) ??
    pickNumber(inner.user_ratings_total) ??
    pickNumber(obj.totalReviews);
  const totalReviews =
    totalFromApi != null ? Math.max(0, Math.floor(totalFromApi)) : reviews.length;

  const mapsUrl =
    pickString(inner.mapsUrl) ??
    pickString(inner.googleMapsUrl) ??
    pickString(inner.url) ??
    pickString(obj.mapsUrl) ??
    pickString(obj.googleMapsUrl) ??
    null;

  const safeAvg = Number.isFinite(avg) ? avg : 0;

  return {
    averageRating: Math.min(5, Math.max(0, Number(safeAvg.toFixed(1)))),
    totalReviews: Math.max(reviews.length, totalReviews),
    reviews,
    mapsUrl,
  };
}

/**
 * `GET /public/google-reviews` — sin auth. Errores → `null` (fallback silencioso en UI).
 */
export async function getPublicGoogleReviews(): Promise<GoogleReviewsPublicPayload | null> {
  try {
    const raw = await apiFetch<unknown>("/public/google-reviews", {
      method: "GET",
      next: { revalidate: 3600 },
    });
    const payload = normalizePublicGoogleReviewsPayload(raw);
    if (!payload.reviews.length) return null;
    return payload;
  } catch {
    return null;
  }
}
