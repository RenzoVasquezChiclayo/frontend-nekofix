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

type NavIcon = ComponentType<SVGProps<SVGSVGElement>>;

export type AdminNavLink = {
  href: string;
  label: string;
};

export type AdminNavEntry =
  | {
      type: "link";
      href: string;
      label: string;
      Icon: NavIcon;
      superAdminOnly?: boolean;
    }
  | {
      type: "group";
      label: string;
      Icon: NavIcon;
      children: AdminNavLink[];
    };

export type AdminNavItem = {
  href: string;
  label: string;
  Icon: NavIcon;
  superAdminOnly?: boolean;
};

export const ADMIN_CATALOG_NAV: AdminNavLink[] = [
  { href: "/admin/phone-series", label: "Series" },
  { href: "/admin/product-conditions", label: "Condiciones" },
  { href: "/admin/product-grades", label: "Grados" },
];

export const ADMIN_NAV_ENTRIES: AdminNavEntry[] = [
  { type: "link", href: "/admin/dashboard", label: "Dashboard", Icon: IconDashboard },
  {
    type: "link",
    href: "/admin/users",
    label: "Usuarios",
    Icon: IconUsers,
    superAdminOnly: true,
  },
  { type: "link", href: "/admin/products", label: "Productos", Icon: IconPackage },
  { type: "link", href: "/admin/phone-models", label: "Modelos", Icon: IconTag },
  { type: "link", href: "/admin/categories", label: "Categorías", Icon: IconFolderTree },
  { type: "link", href: "/admin/brands", label: "Marcas", Icon: IconTag },
  {
    type: "group",
    label: "Catálogos",
    Icon: IconFolderTree,
    children: ADMIN_CATALOG_NAV,
  },
  { type: "link", href: "/admin/leads", label: "Leads", Icon: IconMessage },
  { type: "link", href: "/admin/inventory", label: "Inventario", Icon: IconWarehouse },
];

export const ADMIN_NAV_ITEMS: AdminNavItem[] = ADMIN_NAV_ENTRIES.flatMap((entry) =>
  entry.type === "link"
    ? [{ href: entry.href, label: entry.label, Icon: entry.Icon, superAdminOnly: entry.superAdminOnly }]
    : entry.children.map((child) => ({
        href: child.href,
        label: child.label,
        Icon: entry.Icon,
      }))
);
