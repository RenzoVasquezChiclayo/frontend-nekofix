import { AdminUsersSectionLayout } from "@/components/admin/AdminUsersSectionLayout";

export default function AdminUsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminUsersSectionLayout>{children}</AdminUsersSectionLayout>;
}
