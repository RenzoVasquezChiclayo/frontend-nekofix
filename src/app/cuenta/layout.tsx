import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Mi cuenta",
  description: `Área de cliente · ${SITE_NAME}`,
  robots: { index: false, follow: true },
};

export default function CuentaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
