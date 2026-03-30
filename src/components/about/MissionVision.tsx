import { ABOUT_COPY } from "@/lib/site-contact";

function IconMission({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2L4 6v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V6l-8-4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconVision({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3c4 4 6 7.5 6 9a6 6 0 11-12 0c0-1.5 2-5 6-9z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

export function MissionVision() {
  return (
    <section className="border-b border-zinc-200 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          <article className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-8 shadow-sm transition hover:border-emerald-200/80 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-900/15">
              <IconMission className="h-6 w-6" />
            </div>
            <h2 className="mt-6 text-xl font-bold tracking-tight text-zinc-900">
              {ABOUT_COPY.mission.title}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-zinc-600">
              {ABOUT_COPY.mission.body}
            </p>
          </article>

          <article className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-emerald-50/80 via-white to-white p-8 shadow-sm transition hover:border-emerald-300/60 hover:shadow-md">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl transition group-hover:bg-emerald-400/20" />
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white">
                <IconVision className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-xl font-bold tracking-tight text-zinc-900">
                {ABOUT_COPY.vision.title}
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-zinc-600">
                {ABOUT_COPY.vision.body}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
