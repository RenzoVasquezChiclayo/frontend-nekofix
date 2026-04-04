import type { Metadata } from "next";
import { LandingAdminView } from "@/components/admin/LandingAdminView";

export const metadata: Metadata = {
  title: "Landing CMS",
};

export default function AdminLandingPage() {
  return <LandingAdminView />;
}
