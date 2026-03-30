import { SectionTitle } from "@/components/shared/SectionTitle";

type Props = {
  address?: string;
  hours?: string;
};

export function Location({
  address = "Av. Ejemplo 123, Col. Centro, Ciudad",
  hours = "Lun–Sáb 10:00–20:00 · Dom cerrado",
}: Props) {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle
          eyebrow="Ubicación"
          title="Visítanos"
          subtitle={hours}
        />
        <p className="mx-auto mt-6 max-w-xl text-center text-zinc-600">{address}</p>
      </div>
    </section>
  );
}
