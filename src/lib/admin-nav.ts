import type { ComponentType, SVGProps } from "react";
import {
  IconDashboard,
  IconFolderTree,
  IconMessage,
  IconPackage,
  IconPanel,
  IconSettings,
  IconTag,
  IconUsers,
  IconWarehouse,
} from "@/components/admin/icons";

export type AdminNavItem = {
  href: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", Icon: IconDashboard },
  { href: "/admin/products", label: "Productos", Icon: IconPackage },
  { href: "/admin/phone-models", label: "Modelos", Icon: IconTag },
  { href: "/admin/categories", label: "Categorías", Icon: IconFolderTree },
  { href: "/admin/brands", label: "Marcas", Icon: IconTag },
  { href: "/admin/inventory", label: "Inventario", Icon: IconWarehouse },
  { href: "/admin/leads", label: "Leads WhatsApp", Icon: IconMessage },
  { href: "/admin/clients", label: "Clientes", Icon: IconUsers },
  { href: "/admin/landing", label: "Landing CMS", Icon: IconPanel },
  { href: "/admin/settings", label: "Configuración", Icon: IconSettings },
];
