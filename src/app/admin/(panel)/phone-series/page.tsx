import type { Metadata } from "next";
import { PhoneSeriesAdminView } from "@/components/admin/PhoneSeriesAdminView";

export const metadata: Metadata = {
  title: "Series",
};

export default function AdminPhoneSeriesPage() {
  return <PhoneSeriesAdminView />;
}
