export type CoverageLayer =
  | "PLAYWRIGHT"
  | "DIVERGENCE"
  | "MANUAL-QA"
  | "NON-UI"
  | "NOT COVERED";

export type ScaffoldMode = "adversarial" | "conformance";

export type AtomicClause = {
  id: string;
  text: string;
  kind: "ui-firm" | "ui-optional" | "non-ui" | "manual";
  implemented: boolean;
  pageObject?: string;
  method?: string;
};

export type TraceRow = {
  clauseId: string;
  clause: string;
  layer: CoverageLayer;
  note: string;
};

export type TicketInput = {
  id?: string;
  title: string;
  body: string;
  mode?: ScaffoldMode;
};

const KNOWN_CAPABILITIES: {
  match: RegExp;
  pageObject: string;
  method: string;
  implemented: boolean;
  kind?: AtomicClause["kind"];
}[] = [
  {
    match: /log(in|ged in)|qa profile|sign in/i,
    pageObject: "LoginPage",
    method: "loginAsDefault",
    implemented: true,
  },
  {
    match: /inbox|ticket list|at least one ticket/i,
    pageObject: "InboxPage",
    method: "expectTicketList",
    implemented: true,
  },
  {
    match: /click a ticket|open (a |the )?ticket|see (its )?subject/i,
    pageObject: "InboxPage",
    method: "openTicket",
    implemented: true,
  },
  {
    match: /requester|status/i,
    pageObject: "TicketPage",
    method: "expectDetails",
    implemented: true,
  },
  {
    match: /change status|resolved and save|mark.*resolved/i,
    pageObject: "TicketPage",
    method: "resolveTicket",
    implemented: true,
  },
  {
    match: /filter tickets by status/i,
    pageObject: "InboxPage",
    method: "filterByStatus",
    implemented: true,
  },
  {
    match: /email the requester|notify by mail|out of scope/i,
    pageObject: "",
    method: "",
    implemented: false,
    kind: "non-ui",
  },
];

export function parseClauses(body: string): AtomicClause[] {
  const lines = body
    .split(/\n+/)
    .map((line) => line.replace(/^[-*]\s+/, "").replace(/^\d+\.\s+/, "").trim())
    .filter((line) => line.length > 8 && !/^#+\s/.test(line) && !/^acceptance/i.test(line));

  return lines.map((text, index) => {
    const optional = /optional|nice to have/i.test(text);
    const manual = /manual|exploratory/i.test(text);
    const nonUi = /email the requester|notify by mail|out of scope|non-ui|backend only/i.test(
      text,
    );
    const known = nonUi ? undefined : KNOWN_CAPABILITIES.find((cap) => cap.match.test(text));
    const kind: AtomicClause["kind"] = nonUi
      ? "non-ui"
      : (known?.kind ?? (manual ? "manual" : optional ? "ui-optional" : "ui-firm"));
    return {
      id: `C${index + 1}`,
      text,
      kind,
      implemented: Boolean(known?.implemented) && kind.startsWith("ui"),
      pageObject: known?.pageObject,
      method: known?.method,
    };
  });
}

export function classifyClauses(clauses: AtomicClause[], mode: ScaffoldMode) {
  const rows: TraceRow[] = [];
  const tests: AtomicClause[] = [];

  for (const clause of clauses) {
    if (clause.kind === "non-ui") {
      rows.push({
        clauseId: clause.id,
        clause: clause.text,
        layer: "NON-UI",
        note: "Not a browser assertion. Track outside Playwright.",
      });
      continue;
    }
    if (clause.kind === "manual") {
      rows.push({
        clauseId: clause.id,
        clause: clause.text,
        layer: "MANUAL-QA",
        note: "Requires a human pass.",
      });
      continue;
    }
    if (clause.implemented) {
      tests.push(clause);
      rows.push({
        clauseId: clause.id,
        clause: clause.text,
        layer: "PLAYWRIGHT",
        note: `${clause.pageObject}.${clause.method}`,
      });
      continue;
    }
    if (clause.kind === "ui-optional") {
      rows.push({
        clauseId: clause.id,
        clause: clause.text,
        layer: "NOT COVERED",
        note: "Optional clause. No red test.",
      });
      continue;
    }
    if (mode === "adversarial") {
      tests.push(clause);
      rows.push({
        clauseId: clause.id,
        clause: clause.text,
        layer: "DIVERGENCE",
        note: "Firm requirement not implemented. Spec is expected to fail.",
      });
    } else {
      rows.push({
        clauseId: clause.id,
        clause: clause.text,
        layer: "NOT COVERED",
        note: "Conformance mode leaves unimplemented firm clauses unmarked.",
      });
    }
  }

  return { rows, tests };
}

export function renderPlaywrightSpec(ticket: TicketInput, clauses: AtomicClause[], tests: AtomicClause[]) {
  const specName = slug(`${ticket.id ?? "ticket"} ${ticket.title}`);
  const divergence = tests.some((t) => !t.implemented);
  const uniqueImplemented: AtomicClause[] = [];
  const seen = new Set<string>();
  for (const clause of tests.filter((item) => item.implemented && item.pageObject && item.method)) {
    if (clause.pageObject === "LoginPage") continue;
    const key = `${clause.pageObject}.${clause.method}`;
    if (seen.has(key)) continue;
    seen.add(key);
    uniqueImplemented.push(clause);
  }
  const steps = uniqueImplemented
    .map((t) => `    await ${uncapitalize(t.pageObject!)}.${t.method}();`)
    .join("\n");
  const failing = tests
    .filter((t) => !t.implemented)
    .map(
      (t) =>
        `    // @divergence ${t.id}: ${t.text.replace(/\s+/g, " ")}\n    await expect(page.getByText(${JSON.stringify(t.text.slice(0, 48))})).toBeVisible();`,
    )
    .join("\n");

  const source = `import { test, expect } from "../fixtures/tests";
import { LoginPage } from "../../page_objects/pages/web/LoginPage";
import { InboxPage } from "../../page_objects/pages/web/InboxPage";
import { TicketPage } from "../../page_objects/pages/web/TicketPage";

test.describe(${JSON.stringify(ticket.title)}, () => {
  test(${JSON.stringify(`Verify that ${ticket.title.toLowerCase()}`)}${divergence ? ", { tag: ['@divergence'] }" : ""}, async ({ page, defaultUserTest }) => {
    const loginPage = new LoginPage(page);
    const inboxPage = new InboxPage(page);
    const ticketPage = new TicketPage(page);

    await loginPage.goto();
    await loginPage.loginAsDefault(defaultUserTest);
${steps}
${failing}
  });
});
`;

  return {
    file: `_tests/web/${specName}.spec.ts`,
    source,
    clauses,
  };
}

export function scaffoldFromTicket(ticket: TicketInput) {
  const mode = ticket.mode ?? "adversarial";
  const clauses = parseClauses(ticket.body);
  const { rows, tests } = classifyClauses(clauses, mode);
  const spec = renderPlaywrightSpec(ticket, clauses, tests);
  return {
    ticket: { id: ticket.id ?? "LOCAL-1", title: ticket.title, mode },
    spec,
    traceability: rows,
  };
}

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function uncapitalize(value: string) {
  return value.charAt(0).toLowerCase() + value.slice(1);
}
