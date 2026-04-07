import { USED_GRADE_ORDER } from "@/lib/used-grade";
import { cn } from "@/lib/utils";

const COPY: Record<
  (typeof USED_GRADE_ORDER)[number],
  { title: string; body: string; accent: string }
> = {
  "A+": {
    title: "Casi impecable",
    body: "Apariencia cercana a nueva. Mínimas marcas invisibles a distancia habitual de uso.",
    accent: "from-emerald-500/15 to-emerald-50/80 ring-emerald-200/60",
  },
  A: {
    title: "Leves signos de uso",
    body: "Micro-rayones o marcas ligeras acordes al uso cotidiano con funda. Funcionamiento óptimo.",
    accent: "from-sky-500/12 to-sky-50/80 ring-sky-200/60",
  },
  B: {
    title: "Uso visible, funcional",
    body: "Desgaste estético más notorio; equipo revisado y 100 % operativo para tu día a día.",
    accent: "from-amber-500/12 to-amber-50/80 ring-amber-200/60",
  },
};

export function UsedGradeExplainer() {
  return (
    <section className="mt-16 border-t border-zinc-200 pt-14">
      <h2 className="text-center font-[family-name:var(--font-outfit)] text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
        ¿Qué significa cada estado?
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-zinc-600">
        Cada grado describe el <span className="font-medium text-zinc-800">estado estético</span> del
        equipo. Todos pasan por control técnico antes de publicarse.
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-3">
        {USED_GRADE_ORDER.map((g) => {
          const c = COPY[g];
          return (
            <li
              key={g}
              className={cn(
                "rounded-2xl bg-gradient-to-br p-6 ring-1",
                c.accent
              )}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Grado {g}</p>
              <p className="mt-2 font-semibold text-zinc-900">{c.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{c.body}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
