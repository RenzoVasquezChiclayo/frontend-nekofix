type Props = {
  title: string;
  description: string;
  /** Sin marco punteado; útil dentro de una tarjeta ya enmarcada. */
  embedded?: boolean;
};

export function AdminPlaceholder({ title, description, embedded }: Props) {
  const body = (
    <>
      <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-zinc-600">{description}</p>
    </>
  );
  if (embedded) {
    return <div className="text-center">{body}</div>;
  }
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 bg-white/80 p-10 text-center">
      {body}
    </div>
  );
}
