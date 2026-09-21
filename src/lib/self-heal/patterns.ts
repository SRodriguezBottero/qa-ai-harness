export type FailureBucket =
  | "selector-drift"
  | "timeout-loading"
  | "hardcoded-data"
  | "network-assertion"
  | "rbac-gating"
  | "blocker"
  | "flaky";

export const FAILURE_BUCKETS: { id: FailureBucket; summary: string; standardFix: string }[] = [
  {
    id: "selector-drift",
    summary: "Locator resolves nothing or hits a strict-mode violation.",
    standardFix:
      "Rebuild the locator from a live snapshot using role → label → text → testId → CSS. Never patch with a brittle CSS-only selector.",
  },
  {
    id: "timeout-loading",
    summary: "Timeout waiting for navigation, network idle, or a loading state.",
    standardFix:
      "Wait on a stable UI signal (role/heading visible), not a fixed sleep. If the app never settles, this is a blocker.",
  },
  {
    id: "hardcoded-data",
    summary: "Assertion on a business value the test environment does not guarantee.",
    standardFix:
      "Assert on structure/role, or seed data in a fixture. Do not hardcode live names, amounts, or dates.",
  },
  {
    id: "network-assertion",
    summary: "Fragile matching of GraphQL/REST payloads or status codes.",
    standardFix:
      "Assert on user-visible outcome first. If a network assertion is required, match operation name + stable fields only.",
  },
  {
    id: "rbac-gating",
    summary: "Element gated by role/permission asserted without a condition.",
    standardFix:
      "Gate the assertion on the profile in use, or split the spec into base + RBAC variants.",
  },
  {
    id: "blocker",
    summary: "Root cause is the app or environment. Tests must not paper over it.",
    standardFix: "Do not change the test to pass. File/update a product bug and stop.",
  },
  {
    id: "flaky",
    summary: "Passed on retry; timing or isolation issue.",
    standardFix:
      "Stabilize waits and isolation. Do not treat a flake as a functional regression fix.",
  },
];

export function matchFailureBucket(error: string, retries = 0): FailureBucket {
  const text = error.toLowerCase();
  if (retries > 0 || /flaky|passed on retry/.test(text)) return "flaky";
  if (/500|application error|econnrefused|not a test/.test(text)) return "blocker";
  if (/strict mode|locator|tobevisible|not found|resolved to/.test(text)) return "selector-drift";
  if (/timeout|waiting for/.test(text)) return "timeout-loading";
  if (/graphql|route\.|status code|expect.*request/.test(text)) return "network-assertion";
  if (/permission|role|unauthorized|hidden for/.test(text)) return "rbac-gating";
  if (/tohave text|expected .* received|tobe\('/.test(text)) return "hardcoded-data";
  return "selector-drift";
}
