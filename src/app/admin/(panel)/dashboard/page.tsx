import type { Metadata } from "next";
import { DashboardHome } from "@/components/admin/DashboardHome";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function AdminDashboardPage() {
  return <DashboardHome />;
}
