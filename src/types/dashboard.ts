/** Respuesta de `GET /admin/dashboard/stats` (NestJS). */
export interface DashboardStats {
  totalProducts: number;
  publishedProducts: number;
  lowStockProducts: number;
  featuredProducts: number;
}
