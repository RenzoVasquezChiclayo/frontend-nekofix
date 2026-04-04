/**
 * Helpers centralizados para notificaciones (Sonner).
 * Usar solo desde componentes cliente o efectos; no desde Server Components.
 */

import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-errors";
import { ApiError } from "@/services/api";

const DURATION = {
  success: 4000,
  error: 6000,
  warning: 5000,
  info: 4000,
} as const;

export function notifySuccess(message: string, description?: string): void {
  toast.success(message, {
    description,
    duration: DURATION.success,
  });
}

export function notifyError(message: string, description?: string): void {
  toast.error(message, {
    description,
    duration: DURATION.error,
  });
}

export function notifyWarning(message: string, description?: string): void {
  toast.warning(message, {
    description,
    duration: DURATION.warning,
  });
}

export function notifyInfo(message: string, description?: string): void {
  toast.info(message, {
    description,
    duration: DURATION.info,
  });
}

export function notifyLoading(message: string): string | number {
  return toast.loading(message);
}

export function notifyDismiss(id?: string | number): void {
  toast.dismiss(id);
}

type PromiseMessages<T> = {
  loading: string;
  success: string | ((data: T) => string);
  error?: string | ((error: unknown) => string);
};

export function notifyPromise<T>(
  promise: Promise<T>,
  messages: PromiseMessages<T>
): ReturnType<typeof toast.promise> {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error:
      messages.error ??
      ((err: unknown) => {
        const extracted = getApiErrorMessage(err);
        if (err instanceof ApiError) {
          const friendly = friendlyStatusMessage(err.status);
          if (friendly != null && isGenericApiMessage(extracted, err.status)) {
            return friendly;
          }
        }
        return extracted;
      }),
  });
}

/** Mensajes UX cuando el cuerpo del error es genérico o falta. */
function friendlyStatusMessage(status: number): string | null {
  switch (status) {
    case 400:
      return "Revisa los datos e inténtalo de nuevo.";
    case 401:
      return "Sesión expirada. Vuelve a iniciar sesión.";
    case 403:
      return "No tienes permiso para realizar esta acción.";
    case 404:
      return "No encontramos lo solicitado.";
    case 408:
    case 504:
      return "Tiempo de espera agotado. Intenta de nuevo.";
    default:
      if (status >= 500) {
        return "Error en el servidor. Intenta de nuevo más tarde.";
      }
      return null;
  }
}

function isGenericApiMessage(msg: string, status: number): boolean {
  const t = msg.trim();
  if (!t) return true;
  if (t === `Error ${status}`) return true;
  if (/^Error \d{3}$/.test(t)) return true;
  if (t === "Bad Request" && status === 400) return true;
  if (t === "Unauthorized" && status === 401) return true;
  if (t === "Forbidden" && status === 403) return true;
  if (t === "Not Found" && status === 404) return true;
  return false;
}

/**
 * Muestra un toast de error a partir de cualquier error (prioriza `getApiErrorMessage` + códigos HTTP).
 */
export function notifyApiError(error: unknown, contextFallback?: string): void {
  const extracted = getApiErrorMessage(error);

  if (error instanceof ApiError) {
    const friendly = friendlyStatusMessage(error.status);
    const useFriendly = friendly != null && isGenericApiMessage(extracted, error.status);
    const message = useFriendly
      ? friendly
      : extracted.length > 0
        ? extracted
        : friendly ?? contextFallback ?? "Error inesperado. Intenta nuevamente.";
    notifyError(message);
    return;
  }

  notifyError(contextFallback ?? extracted ?? "Error inesperado. Intenta nuevamente.");
}
