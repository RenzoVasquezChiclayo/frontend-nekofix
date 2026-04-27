import type { Metadata } from "next";
import { ReparacionesLanding } from "@/components/repairs/ReparacionesLanding";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Reparación de iPhone en Trujillo | NekoFix",
  description:
    "Servicio técnico especializado Apple, cambio de pantalla, batería y más.",
  openGraph: {
    title: `Reparación de iPhone en Trujillo | ${SITE_NAME}`,
    description:
      "Servicio técnico especializado Apple, cambio de pantalla, batería y más.",
  },
};

export default function ReparacionesPage() {
  return <ReparacionesLanding />;
}
