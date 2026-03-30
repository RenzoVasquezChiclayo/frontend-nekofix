import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: `Accede a tu cuenta de cliente · ${SITE_NAME}`,
  robots: { index: false, follow: true },
};

export default function IniciarSesionPage() {
  return <LoginForm />;
}
