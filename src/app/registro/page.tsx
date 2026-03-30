import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Registro",
  description: `Crea tu cuenta de cliente · ${SITE_NAME}`,
  robots: { index: false, follow: true },
};

export default function RegistroPage() {
  return <RegisterForm />;
}
