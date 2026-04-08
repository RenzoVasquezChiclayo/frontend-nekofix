"use client";

import { usePathname } from "next/navigation";
import { WHATSAPP_REPAIR_MESSAGE } from "@/lib/repairs";
import { whatsappHref } from "@/lib/utils";
import { cn } from "@/lib/utils";

const REPAIR_PATH = "/reparaciones";

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/**
 * Flotante global. En `/reparaciones` muestra barra sticky con mensaje de cotización de reparación.
 */
export function WhatsAppFloat() {
  const pathname = usePathname();
  const isRepairPage = pathname === REPAIR_PATH;
  const href = whatsappHref(isRepairPage ? WHATSAPP_REPAIR_MESSAGE : undefined);

  if (isRepairPage) {
    return (
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 border-t border-primary-900/10 bg-white/95 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_32px_rgba(24,24,27,0.12)] backdrop-blur-md md:py-4"
        )}
      >
        <div className="mx-auto flex max-w-6xl justify-center px-4 sm:px-6">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full max-w-lg items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-900/20 transition hover:bg-[#20bd5a] hover:shadow-xl sm:text-base"
            aria-label="Cotizar reparación por WhatsApp"
          >
            <WhatsAppGlyph className="h-6 w-6 shrink-0" />
            Cotizar por WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-primary-900/25 transition hover:scale-105 hover:shadow-xl"
      aria-label="Contactar por WhatsApp"
    >
      <WhatsAppGlyph className="h-8 w-8" />
    </a>
  );
}
