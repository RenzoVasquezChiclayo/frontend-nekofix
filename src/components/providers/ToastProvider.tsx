"use client";

import { Toaster } from "sonner";

/**
 * Un solo `<Toaster />` en el árbol (layout raíz).
 * Estilo alineado con marca NekoFix (primarios, borde suave).
 */
export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      duration={4000}
      visibleToasts={4}
      toastOptions={{
        classNames: {
          toast:
            "group font-sans border border-zinc-200/90 bg-white text-zinc-900 shadow-lg shadow-zinc-900/5",
          title: "font-semibold text-zinc-900",
          description: "text-zinc-600",
        },
      }}
    />
  );
}
