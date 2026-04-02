import type { Metadata } from "next";
import { LeadsAdminView } from "@/components/admin/LeadsAdminView";

export const metadata: Metadata = {
  title: "Leads WhatsApp",
};

export default function AdminLeadsPage() {
  return <LeadsAdminView />;
}
