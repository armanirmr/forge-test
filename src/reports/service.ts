import type { User } from "../auth/session";

export type Report = { id: string; region: string; date: string; revenue: number; orders: number };
export type ReportFilters = { from?: string; to?: string; region?: string };

const REPORTS: Report[] = [
  { id: "r1", region: "emea", date: "2025-01-05", revenue: 1200, orders: 14 },
  { id: "r2", region: "emea", date: "2025-02-11", revenue: 980, orders: 9 },
  { id: "r3", region: "amer", date: "2025-01-20", revenue: 2300, orders: 31 },
  { id: "r4", region: "apac", date: "2025-03-02", revenue: 1500, orders: 18 },
];

// Applies authorization (user's regions) and then the requested filters.
export function getReports(user: User, filters: ReportFilters = {}): Report[] {
  return REPORTS.filter((r) => {
    if (user.role !== "admin" && !user.regions.includes(r.region)) return false;
    if (filters.region && r.region !== filters.region) return false;
    if (filters.from && r.date < filters.from) return false;
    if (filters.to && r.date > filters.to) return false;
    return true;
  });
}

export function summarize(reports: Report[]) {
  return {
    totalRevenue: reports.reduce((sum, r) => sum + r.revenue, 0),
    totalOrders: reports.reduce((sum, r) => sum + r.orders, 0),
    count: reports.length,
  };
}