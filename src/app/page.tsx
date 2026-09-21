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
    body: "Lee criterios de aceptación, los parte en cláusulas atómicas y genera un spec de Playwright con page objects. Modo adversarial por defecto.",
  },
  {
    href: "/sync",
    title: "Sync",
    eyebrow: "Spec → ticket",
    body: "Un test = un caso. Crea tickets sin borrar lo existente y escribe el id de vuelta hacia el spec.",
  },
  {
    href: "/self-heal",
    title: "Self-heal",
    eyebrow: "CI → fix o bloqueo",
    body: "Clasifica fallas duras vs flaky. Un bloqueador de producto nunca se enmascara. Los fixes se agrupan por archivo disjunto.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <header className="space-y-3">
        <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          Primera rebanada usable
        </p>
        <h1 className="font-heading text-4xl sm:text-5xl">
          Un harness de QA que cualquier equipo con Playwright puede adoptar.
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Los workflows viven en skills genéricos. Lo específico de cada equipo (tracker, CI, carpetas)
          va en <code>harness.config.json</code> y en adaptadores. Jev decide barato: guardrail antes
          de una acción riesgosa, triage después de un fail.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/scaffold" className={cn(buttonVariants())}>
            Generar un spec
          </Link>
          <Link href="/mesa/login" className={cn(buttonVariants({ variant: "outline" }))}>
            Abrir Mesa
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
            <CardTitle>Jev en el loop</CardTitle>
            <CardDescription>
              System One: estado + preguntas tipadas, no un chat. Sin clave API corre el mock local.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge>noul</Badge>
            <Badge variant="secondary">choice</Badge>
            <Badge variant="outline">score</Badge>
            <p className="mt-2 w-full text-sm text-muted-foreground">
              Guardrail: ¿la acción toca producción o destruye datos? Triage: ¿regresión, flake o bloqueador?
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>App bajo prueba</CardTitle>
            <CardDescription>
              Mesa es un inbox de soporte mínimo. Usala para snapshots en vivo y para correr Playwright.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <p>
              Perfil QA: <code>qa@mesa.test</code> / <code>mesa-qa</code>
            </p>
            <p className="mt-2 text-muted-foreground">
              Selectores estables: roles, labels y <code>data-testid</code>. La jerarquía del harness es role →
              label → text → testId → CSS.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
