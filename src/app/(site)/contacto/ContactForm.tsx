"use client";

import { useActionState } from "react";
import { submitContact } from "@/app/(site)/contacto/actions";

const initial: { ok: boolean; error?: string } = { ok: false };

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-8 text-center">
        <p className="font-semibold text-emerald-900">Mensaje enviado</p>
        <p className="mt-2 text-sm text-emerald-800">
          Te contactaremos pronto. También puedes escribirnos por WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-zinc-700">Nombre</span>
        <input
          name="name"
          required
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-zinc-700">Email</span>
        <input
          name="email"
          type="email"
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-zinc-700">Teléfono</span>
        <input
          name="phone"
          type="tel"
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-zinc-700">Mensaje</span>
        <textarea
          name="message"
          required
          rows={5}
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          placeholder="Describe tu equipo o lo que necesitas…"
        />
      </label>
      {state.error ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Enviar"}
      </button>
      <p className="text-xs text-zinc-500">
        El envío usa el endpoint de leads en NestJS. Si falla, verifica{" "}
        <code className="rounded bg-zinc-100 px-1">NEXT_PUBLIC_API_URL</code> y CORS.
      </p>
    </form>
  );
}
