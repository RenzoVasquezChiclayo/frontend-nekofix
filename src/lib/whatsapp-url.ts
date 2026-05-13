/** Valida que la URL devuelta por el backend sea de WhatsApp antes de redirigir. */
export function resolveSafeWhatsAppUrl(
  rawUrl: string | undefined,
  fallbackUrl: string
): string {
  if (!rawUrl) return fallbackUrl;
  try {
    const parsed = new URL(rawUrl);
    const host = parsed.hostname.toLowerCase();
    const isWhatsAppHost = host === "wa.me" || host.endsWith(".whatsapp.com");
    return isWhatsAppHost ? parsed.toString() : fallbackUrl;
  } catch {
    return fallbackUrl;
  }
}
