import { describe, it, expect } from "vitest";
import { getReports } from "../src/reports/service";

const analyst = { id: "u1", email: "a@x.com", role: "analyst" as const, regions: ["emea"] };

describe("getReports", () => {
  it("only returns reports in the user's regions", () => {
    expect(getReports(analyst).every((r) => r.region === "emea")).toBe(true);
  });

  it("applies date filters", () => {
    expect(getReports(analyst, { from: "2025-02-01" })).toHaveLength(1);
  });
});