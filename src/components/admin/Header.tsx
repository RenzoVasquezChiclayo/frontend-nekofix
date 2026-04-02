"use client";

type Props = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

/** Encabezado de página del panel (alias: `Header`). */
export function AdminHeader({ title, description, actions }: Props) {
  return (
    <header className="flex flex-col gap-4 border-b border-zinc-200 bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm text-zinc-600">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export const Header = AdminHeader;
