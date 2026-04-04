import type { ProductCondition, ProductType } from "@/types/product";

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  NEW: "Nuevo",
  USED: "Usado",
  ACCESSORY: "Accesorio",
};

export const PRODUCT_CONDITION_LABELS: Record<ProductCondition, string> = {
  NEW: "Nuevo",
  SEMINUEVO: "Seminuevo",
  REFURBISHED: "Reacondicionado",
  REPAIRED: "Reparado",
  FOR_PARTS: "Para repuestos",
};
