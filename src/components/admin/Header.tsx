"use client";

type Props = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

/** Encabezado de página del panel (alias: `Header`). */
export function AdminHeader({ title, description, actions }: Props) {
  return (
    <header className="flex flex-col gap-4 border-b border-zinc-200 bg-white px-4 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <h1 className="text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm text-zinc-600">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          {actions}
        </div>
      ) : null}
    </header>
  );
}

export const Header = AdminHeader;
