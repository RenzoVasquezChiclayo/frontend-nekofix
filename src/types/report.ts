export type ReportDatePreset = "7d" | "30d" | "this-month" | "custom" | "month";

export interface ReportDateRange {
  preset: ReportDatePreset;
  startDate?: string;
  endDate?: string;
}

export interface DashboardMetrics {
  totalSales: number;
  pendingLeads: number;
  soldLeads: number;
  conversionRate: number;
  publishedProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalRevenue: number;
}

export interface MonthlySales {
  month: string;
  sales: number;
  revenue: number;
}

export interface LeadStatusReport {
  status: "PENDING" | "CONTACTED" | "SOLD" | "CANCELLED";
  count: number;
}

export interface TopSellingProduct {
  productId: string;
  name: string;
  imageUrl?: string | null;
  quantitySold: number;
  revenue: number;
}

export interface InventorySummary {
  publishedProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

export interface LowStockProduct {
  productId: string;
  name: string;
  imageUrl?: string | null;
  stock: number;
  minStock: number;
}
