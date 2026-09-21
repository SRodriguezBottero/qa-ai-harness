import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

const pipelines = [
  {
    href: "/scaffold",
    title: "Scaffold",
    eyebrow: "Ticket → spec",
    body: "Reads acceptance criteria, splits them into atomic clauses, and generates a Playwright spec with page objects. Adversarial mode by default.",
  },
  {
    href: "/sync",
    title: "Sync",
    eyebrow: "Spec → ticket",
    body: "One test = one case. Creates tickets without deleting existing ones and writes the id back into the spec.",
  },
  {
    href: "/self-heal",
    title: "Self-heal",
    eyebrow: "CI → fix or block",
    body: "Classifies hard failures vs flakes. A product blocker is never masked. Fixes are grouped by disjoint files.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <header className="space-y-3">
        <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          First usable slice
        </p>
        <h1 className="font-heading text-4xl sm:text-5xl">
          A QA harness any Playwright team can adopt.
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Workflows live in generic skills. Team-specific pieces (tracker, CI, folders) go in{" "}
          <code>harness.config.json</code> and adapters. Jev decides cheaply: guardrail before a
          risky action, triage after a fail.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/scaffold" className={cn(buttonVariants())}>
            Generate a spec
          </Link>
          <Link href="/mesa/login" className={cn(buttonVariants({ variant: "outline" }))}>
            Open Mesa
          </Link>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {pipelines.map((item) => (
          <Link key={item.href} href={item.href} className="block">
            <Card className="h-full transition-colors hover:ring-primary/40">
              <CardHeader>
                <CardDescription className="font-mono text-[11px] tracking-wider uppercase">
                  {item.eyebrow}
                </CardDescription>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{item.body}</CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Jev in the loop</CardTitle>
            <CardDescription>
              System One: state plus typed questions, not a chat. Without an API key the local mock
              runs.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge>noul</Badge>
            <Badge variant="secondary">choice</Badge>
            <Badge variant="outline">score</Badge>
            <p className="mt-2 w-full text-sm text-muted-foreground">
              Guardrail: does the action touch production or destroy data? Triage: regression, flake,
              or blocker?
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>App under test</CardTitle>
            <CardDescription>
              Mesa is a minimal support inbox. Use it for live snapshots and to run Playwright.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <p>
              QA profile: <code>qa@mesa.test</code> / <code>mesa-qa</code>
            </p>
            <p className="mt-2 text-muted-foreground">
              Stable selectors: roles, labels, and <code>data-testid</code>. The harness hierarchy is
              role → label → text → testId → CSS.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
