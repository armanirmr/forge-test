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