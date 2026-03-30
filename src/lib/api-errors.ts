import { ApiError } from "@/services/api";

/** Extrae mensaje legible desde respuestas NestJS / class-validator */
export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const b = error.body as
      | { message?: string | string[]; error?: string }
      | undefined;
    if (typeof b?.message === "string") return b.message;
    if (Array.isArray(b?.message)) return b.message.join(". ");
    if (typeof b?.error === "string") return b.error;
    return error.message || `Error ${error.status}`;
  }
  if (error instanceof Error) return error.message;
  return "Ha ocurrido un error. Intenta de nuevo.";
}
