import { requireUser, requireRole } from "../middleware/auth";
import { getReports, type ReportFilters } from "../reports/service";
import { buildDashboard } from "../dashboard/dashboard";

export function handleListReports(token: string | undefined, filters: ReportFilters) {
  const user = requireUser(token);
  requireRole(user, "admin", "analyst", "viewer");
  return getReports(user, filters);
}

export function handleDashboard(token: string | undefined, filters: ReportFilters) {
  const user = requireUser(token);
  return buildDashboard(user, filters);
}
 
export function handleExportCsv(token: string | undefined, filters: ReportFilters): string {
  const user = requireUser(token);
  requireRole(user, "admin", "analyst", "viewer");
  const reports = getReports(user, filters);
  const header = "id,region,date,revenue,orders";
  const rows = reports.map((r) => `${r.id},${r.region},${r.date},${r.revenue},${r.orders}`);
  return [header, ...rows].join("\\n");
}