"use client";

import { RequireSuperAdmin } from "@/components/admin/RequireSuperAdmin";

type Props = { children: React.ReactNode };

export function AdminUsersSectionLayout({ children }: Props) {
  return <RequireSuperAdmin>{children}</RequireSuperAdmin>;
}
