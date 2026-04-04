"use client";

import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useId, useRef, useState } from "react";
import { resolveProductMediaUrl, sortProductImages } from "@/lib/product-images";
import { notifyApiError } from "@/lib/toast";
import { adminUploadProductImage } from "@/services/admin/product.service";
import type { ProductImagePayload } from "@/types/admin-product";
import type { ProductImage } from "@/types/product";

const ACCEPT = "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";

export type ProductImageDraft = {
  clientId: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  uploading?: boolean;
  error?: string | null;
};

function newClientId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `img-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function draftsFromProductImages(
  images: ProductImage[] | undefined | null
): ProductImageDraft[] {
  const sorted = sortProductImages(images);
  return sorted.map((img) => ({
    clientId: img.id,
    url: img.url,
    alt: img.alt ?? "",
    isPrimary: img.isPrimary,
  }));
}

export function draftsToPayload(drafts: ProductImageDraft[]): ProductImagePayload[] {
  if (drafts.length === 0) return [];
  const withPrimary = drafts.some((d) => d.isPrimary)
    ? drafts
    : drafts.map((d, i) => ({ ...d, isPrimary: i === 0 }));
  return withPrimary.map((d, i) => ({
    url: d.url.trim(),
    alt: d.alt.trim() || null,
    sortOrder: i,
    isPrimary: d.isPrimary,
  }));
}

function isAllowedImageFile(file: File): boolean {
  if (/^image\/(jpeg|png|webp)$/i.test(file.type)) return true;
  return /\.(jpe?g|png|webp)$/i.test(file.name);
}

type Props = {
  accessToken: string;
  defaultAltHint: string;
  drafts: ProductImageDraft[];
  onChange: Dispatch<SetStateAction<ProductImageDraft[]>>;
};

export function ProductImagesEditor({ accessToken, defaultAltHint, drafts, onChange }: Props) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [reorderFrom, setReorderFrom] = useState<number | null>(null);

  const setPrimary = useCallback(
    (clientId: string) => {
      onChange((prev) =>
        prev.map((d) => ({
          ...d,
          isPrimary: d.clientId === clientId,
        }))
      );
    },
    [onChange]
  );

  const remove = useCallback(
    (clientId: string) => {
      onChange((prev) => {
        const next = prev.filter((d) => d.clientId !== clientId);
        if (next.length > 0 && !next.some((d) => d.isPrimary)) {
          next[0] = { ...next[0], isPrimary: true };
        }
        return next;
      });
    },
    [onChange]
  );

  const move = useCallback(
    (from: number, to: number) => {
      onChange((prev) => {
        if (to < 0 || to >= prev.length) return prev;
        const next = [...prev];
        const [item] = next.splice(from, 1);
        next.splice(to, 0, item);
        return next;
      });
    },
    [onChange]
  );

  const updateAlt = useCallback(
    (clientId: string, alt: string) => {
      onChange((prev) => prev.map((d) => (d.clientId === clientId ? { ...d, alt } : d)));
    },
    [onChange]
  );

  const uploadOne = useCallback(
    async (file: File) => {
      const clientId = newClientId();
      onChange((prev) => {
        const isEmpty = prev.length === 0;
        return [
          ...prev,
          {
            clientId,
            url: "",
            alt: defaultAltHint,
            isPrimary: isEmpty,
            uploading: true,
            error: null,
          },
        ];
      });

      try {
        const url = await adminUploadProductImage(accessToken, file);
        onChange((prev) => {
          const mapped = prev.map((d) =>
            d.clientId === clientId ? { ...d, url, uploading: false, error: null } : d
          );
          const hasPrimaryWithUrl = mapped.some((d) => d.isPrimary && d.url);
          if (!hasPrimaryWithUrl) {
            const idx = mapped.findIndex((d) => d.clientId === clientId);
            return mapped.map((d, i) => ({ ...d, isPrimary: i === idx }));
          }
          return mapped;
        });
      } catch (e) {
        notifyApiError(e, "No se pudo subir la imagen. Revisa el formato y el tamaño.");
        const msg = e instanceof Error ? e.message : "Error al subir";
        onChange((prev) =>
          prev.map((d) =>
            d.clientId === clientId ? { ...d, uploading: false, error: msg } : d
          )
        );
      }
    },
    [accessToken, defaultAltHint, onChange]
  );

  const handleFiles = useCallback(
    async (list: FileList | File[] | null) => {
      if (!list?.length) return;
      const files = Array.from(list).filter(isAllowedImageFile);
      for (const file of files) {
        await uploadOne(file);
      }
    },
    [uploadOne]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      void handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const onReorderDragStart = (index: number) => {
    setReorderFrom(index);
  };

  const onReorderDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (reorderFrom === null || reorderFrom === index) return;
    move(reorderFrom, index);
    setReorderFrom(index);
  };

  const onReorderDragEnd = () => {
    setReorderFrom(null);
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Imágenes del producto
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            JPG, PNG o WebP. Arrastra aquí o usa el botón. Una imagen será la principal.
          </p>
        </div>
        <div>
          <input
            ref={fileRef}
            id={inputId}
            type="file"
            accept={ACCEPT}
            multiple
            className="sr-only"
            onChange={(e) => {
              void handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <label
            htmlFor={inputId}
            className="inline-flex cursor-pointer rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50"
          >
            Subir imágenes
          </label>
        </div>
      </div>

      <div
        role="presentation"
        onDragEnter={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(false);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className={`rounded-2xl border-2 border-dashed p-4 transition ${
          dragOver ? "border-primary-400 bg-primary-50/50" : "border-zinc-200 bg-zinc-50/40"
        }`}
      >
        {drafts.length === 0 ? (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 py-10 text-center text-sm text-zinc-500"
          >
            <span className="font-medium text-zinc-700">Suelta archivos o haz clic para elegir</span>
            <span className="text-xs">Vista previa y reordenación debajo</span>
          </button>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {drafts.map((d, index) => (
              <li
                key={d.clientId}
                draggable={!d.uploading}
                onDragStart={() => onReorderDragStart(index)}
                onDragOver={(e) => onReorderDragOver(e, index)}
                onDragEnd={onReorderDragEnd}
                className={`relative overflow-hidden rounded-xl border bg-white shadow-sm ${
                  d.isPrimary ? "border-primary-300 ring-1 ring-primary-200" : "border-zinc-200"
                }`}
              >
                <div className="relative aspect-[4/3] bg-zinc-100">
                  {d.uploading ? (
                    <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-200" />
                  ) : d.url ? (
                    <Image
                      src={resolveProductMediaUrl(d.url)}
                      alt={d.alt || defaultAltHint}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 640px) 100vw, 33vw"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                      Sin vista previa
                    </div>
                  )}
                  {d.isPrimary ? (
                    <span className="absolute left-2 top-2 rounded-full bg-primary-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Principal
                    </span>
                  ) : null}
                </div>

                <div className="space-y-2 p-3">
                  <label className="block text-xs font-medium text-zinc-600">
                    Texto alternativo (SEO)
                    <input
                      value={d.alt}
                      onChange={(e) => updateAlt(d.clientId, e.target.value)}
                      disabled={d.uploading}
                      className="mt-1 w-full rounded-lg border border-zinc-200 px-2 py-1.5 text-sm"
                      placeholder={defaultAltHint}
                    />
                  </label>

                  {d.error ? (
                    <p className="rounded-lg border border-red-200 bg-red-50 px-2 py-1.5 text-xs text-red-800">
                      {d.error}
                    </p>
                  ) : null}

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={d.uploading || d.isPrimary || !d.url}
                      onClick={() => setPrimary(d.clientId)}
                      className="rounded-lg border border-zinc-200 px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Usar como principal
                    </button>
                    <button
                      type="button"
                      disabled={d.uploading}
                      onClick={() => move(index, index - 1)}
                      className="rounded-lg border border-zinc-200 px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={d.uploading}
                      onClick={() => move(index, index + 1)}
                      className="rounded-lg border border-zinc-200 px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      disabled={d.uploading}
                      onClick={() => remove(d.clientId)}
                      className="ml-auto rounded-lg border border-red-200 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                    >
                      Quitar
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-400">Arrastra la tarjeta para reordenar</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
