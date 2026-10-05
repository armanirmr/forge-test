import type { User } from "../auth/session";
import { getReports, summarize, type ReportFilters } from "../reports/service";

export function buildDashboard(user: User, filters: ReportFilters) {
  const reports = getReports(user, filters);
  return { filters, reports, summary: summarize(reports) };
}