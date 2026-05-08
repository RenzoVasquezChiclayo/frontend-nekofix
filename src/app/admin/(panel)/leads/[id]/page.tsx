import type { Metadata } from "next";
import { LeadDetailView } from "@/components/admin/LeadDetailView";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Detalle de lead",
};

export default async function AdminLeadDetailPage({ params }: Props) {
  const { id } = await params;
  return <LeadDetailView leadId={id} />;
}
