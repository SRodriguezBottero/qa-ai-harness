export type IssueTrackerType = "jira" | "linear" | "github-issues";
export type TestManagementType = "tricentis" | "testrail" | "xray" | "none";
export type CiSourceType = "currents" | "github-actions" | "playwright-json";
export type JevMode = "auto" | "live" | "mock";

export type PlatformConfig = {
  name: string;
  testDir: string;
  pageObjectDir: string;
  authProfilesFile: string;
  defaultProfile: string;
  baseUrl?: string;
};

export type HarnessConfig = {
  platforms: PlatformConfig[];
  issueTracker: {
    type: IssueTrackerType;
    cloudId?: string;
    fieldMapping?: string;
  };
  testManagement: {
    type: TestManagementType;
    folderTaxonomy?: string;
  };
  ciSource: {
    type: CiSourceType;
    projectIds?: Record<string, string>;
  };
  codeStyle: string;
  jev: {
    enabled: boolean;
    mode: JevMode;
    model: string;
    guardrailThreshold: number;
    triageConfidenceFloor: number;
  };
};

export const defaultHarnessConfig: HarnessConfig = {
  platforms: [
    {
      name: "mesa",
      testDir: "_tests/web",
      pageObjectDir: "page_objects/pages/web",
      authProfilesFile: "fixtures/tests.ts",
      defaultProfile: "defaultUserTest",
      baseUrl: "http://127.0.0.1:4477",
    },
  ],
  issueTracker: {
    type: "github-issues",
    fieldMapping: "config/issue-fields.json",
  },
  testManagement: { type: "none", folderTaxonomy: "config/test-mgmt-folders.json" },
  ciSource: { type: "playwright-json", projectIds: { mesa: "local" } },
  codeStyle: "use-repo-prettier-config",
  jev: {
    enabled: true,
    mode: "auto",
    model: "jev-latest",
    guardrailThreshold: 0.72,
    triageConfidenceFloor: 0.55,
  },
};
