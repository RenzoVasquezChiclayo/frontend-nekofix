import type { ComponentType, SVGProps } from "react";
import {
  IconDashboard,
  IconFolderTree,
  IconMessage,
  IconPackage,
  IconTag,
  IconUsers,
  IconWarehouse,
} from "@/components/admin/icons";

export type AdminNavItem = {
  href: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** Solo para `role === SUPER_ADMIN` (p. ej. gestión de usuarios). */
  superAdminOnly?: boolean;
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", Icon: IconDashboard },
  { href: "/admin/users", label: "Usuarios", Icon: IconUsers, superAdminOnly: true },
  { href: "/admin/products", label: "Productos", Icon: IconPackage },
  { href: "/admin/phone-models", label: "Modelos", Icon: IconTag },
  { href: "/admin/categories", label: "Categorías", Icon: IconFolderTree },
  { href: "/admin/brands", label: "Marcas", Icon: IconTag },
  { href: "/admin/leads", label: "Leads", Icon: IconMessage },
  { href: "/admin/inventory", label: "Inventario", Icon: IconWarehouse },
  // Leads, clientes, landing CMS, ajustes: ver `components/admin/icons` y añadir aquí.
];
