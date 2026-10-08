import { describe, it, expect } from "vitest";
import { getReports } from "../src/reports/service";
import { handleExportCsv as apiExported } from "../src/api/reports";
import { handleExportCsv as indexExported } from "../src/index";
import { createSession } from "../src/auth/session";
import { UnauthorizedError } from "../src/middleware/auth";

const analyst = { id: "u1", email: "a@x.com", role: "analyst" as const, regions: ["emea"] };
const analystNoReports = { id: "u2", email: "b@x.com", role: "analyst" as const, regions: ["nonexistent"] };

describe("getReports", () => {
  it("only returns reports in the user's regions", () => {
    expect(getReports(analyst).every((r) => r.region === "emea")).toBe(true);
  });

  it("applies date filters", () => {
    expect(getReports(analyst, { from: "2025-02-01" })).toHaveLength(1);
  });
});

describe("handleExportCsv", () => {
  it("returns CSV with header and data rows", () => {
    const token = createSession(analyst);
    const csv = apiExported(token, { from: "2025-01-01", to: "2025-02-28", region: "emea" });
    expect(csv).toContain("id,region,date,revenue,orders");
    const lines = csv.split("\\n");
    expect(lines.length).toBe(3);
    expect(lines[1]).toContain("r1");
    expect(lines[2]).toContain("r2");
  });

  it("returns only header when no reports", () => {
    const token = createSession(analystNoReports);
    const csv = apiExported(token, {});
    const lines = csv.split("\\n");
    expect(lines.length).toBe(1);
    expect(lines[0]).toBe("id,region,date,revenue,orders");
  });

  it("throws UnauthorizedError when token undefined", () => {
    expect(() => apiExported(undefined, {})).toThrow(UnauthorizedError);
  });

  it("is exported via index", () => {
    expect(indexExported).toBeDefined();
  });
});