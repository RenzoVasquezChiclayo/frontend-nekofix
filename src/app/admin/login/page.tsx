import Link from "next/link";
import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <p className="text-center text-sm font-semibold uppercase tracking-wider text-primary-800">
          Panel administrador
        </p>
        <h1 className="mt-2 text-center text-2xl font-bold tracking-tight text-zinc-900">
          {SITE_NAME}
        </h1>
        <div className="mt-10">
          <AdminLoginForm />
        </div>
        <p className="mt-8 text-center text-xs text-zinc-500">
          <Link href="/" className="text-primary-700 hover:underline">
            Volver al sitio
          </Link>
        </p>
      </div>
    </div>
  );
}
