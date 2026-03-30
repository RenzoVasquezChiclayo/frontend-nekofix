import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/admin" className="text-sm font-semibold text-zinc-900">
            Admin · {SITE_NAME}
          </Link>
          <Link
            href="/"
            className="text-sm text-zinc-600 hover:text-zinc-900"
          >
            Ver sitio
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
