import type { Metadata } from "next";
import { PhoneModelsAdminView } from "@/views/admin/PhoneModelsAdminView";

export const metadata: Metadata = {
  title: "Modelos",
};

export default function AdminPhoneModelsPage() {
  return <PhoneModelsAdminView />;
}
