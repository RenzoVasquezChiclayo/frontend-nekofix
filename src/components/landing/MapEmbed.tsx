import { env } from "@/config/env";

export function MapEmbed() {
  if (!env.mapEmbedUrl) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 py-20 text-center">
          <p className="text-sm font-medium text-zinc-700">Mapa</p>
          <p className="mt-2 max-w-md text-sm text-zinc-500">
            Configura <code className="rounded bg-zinc-200 px-1">NEXT_PUBLIC_MAP_EMBED_URL</code>{" "}
            con el iframe de Google Maps para mostrar la ubicación.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="aspect-video overflow-hidden rounded-2xl border border-zinc-200 shadow-sm">
        <iframe
          title="Ubicación NekoFix"
          src={env.mapEmbedUrl}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
}
