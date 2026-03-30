import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthCard({ title, subtitle, children, footer }: Props) {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 sm:px-0 sm:py-16">
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex rounded-lg bg-emerald-600 px-1.5 py-0.5 text-xs font-bold text-white"
          >
            NF
          </Link>
          <p className="mt-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
            {SITE_NAME}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 text-sm text-zinc-600">{subtitle}</p>
          ) : null}
        </div>
        <div className="mt-8">{children}</div>
        {footer ? <div className="mt-8 border-t border-zinc-100 pt-6">{footer}</div> : null}
      </div>
    </div>
  );
}
