import { ABOUT_COPY } from "@/lib/site-contact";

export function AboutStory() {
  return (
    <section className="bg-zinc-50 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-block rounded-full bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-200">
            Conócenos
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            {ABOUT_COPY.whoWeAre.title}
          </h2>
        </div>
        <div className="mt-12 space-y-6 rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm sm:p-10">
          {ABOUT_COPY.whoWeAre.paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-[17px] leading-[1.75] text-zinc-600 first:text-lg first:font-medium first:text-zinc-800"
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
