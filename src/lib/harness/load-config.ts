import { readFileSync } from "node:fs";
import { join } from "node:path";
import { defaultHarnessConfig, type HarnessConfig } from "./types";

export function loadHarnessConfig(): HarnessConfig {
  try {
    const raw = readFileSync(join(process.cwd(), "harness.config.json"), "utf8");
    return { ...defaultHarnessConfig, ...JSON.parse(raw) } as HarnessConfig;
  } catch {
    return defaultHarnessConfig;
  }
}

export function adapterHint(config: HarnessConfig) {
  return {
    issueTracker: `skills/scaffold-tests-from-ticket/references/issue-tracker-${config.issueTracker.type}.md`,
    testManagement: `skills/sync-tests-to-tracker/references/test-mgmt-${config.testManagement.type}.md`,
    ciSource:
      config.ciSource.type === "playwright-json"
        ? "skills/self-heal-regression/references/ci-source-playwright-json-reporter.md"
        : `skills/self-heal-regression/references/ci-source-${config.ciSource.type}.md`,
    jev: "skills/jev-decisions/SKILL.md",
  };
}
