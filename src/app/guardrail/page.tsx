"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function GuardrailPage() {
  const [action, setAction] = useState("Delete all tickets in production Mesa");
  const [target, setTarget] = useState("https://prod.example.com/admin");
  const [environment, setEnvironment] = useState("production");
  const [notes, setNotes] = useState("Playwright MCP click on Wipe data");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    decision: string;
    reasons: string[];
    jev: { source: string; answers: Record<string, unknown> };
  } | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/guardrail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, target, environment, notes }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Guardrail failed");
      setResult(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <header>
        <h1 className="font-heading text-4xl">Jev guardrail</h1>
        <p className="mt-2 text-muted-foreground">
          Antes de que un agente ejecute Playwright contra un entorno real, Jev evalúa si la acción es
          destructiva o de producción. Sin <code>TYPESAFE_API_KEY</code> corre el mock calibrado.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Acción propuesta</CardTitle>
          <CardDescription>Probá una acción de lectura vs una de wipe.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="action">Acción</Label>
            <Input id="action" value={action} onChange={(e) => setAction(e.target.value)} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="target">Target</Label>
              <Input id="target" value={target} onChange={(e) => setTarget(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="env">Entorno</Label>
              <Input id="env" value={environment} onChange={(e) => setEnvironment(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="notes">Notas</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={run} disabled={loading}>
              {loading ? "Evaluando…" : "Evaluar con Jev"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setAction("Open Inbox and take a snapshot");
                setTarget("http://127.0.0.1:4477/mesa/inbox");
                setEnvironment("local-test");
                setNotes("Read-only Playwright snapshot");
              }}
            >
              Cargar acción segura
            </Button>
          </div>
        </CardContent>
      </Card>
      {error ? (
        <Alert>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {result ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Decisión
              <Badge variant={result.decision === "block" ? "destructive" : "secondary"}>
                {result.decision}
              </Badge>
              <Badge variant="outline">{result.jev.source}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="mb-3 list-disc pl-5 text-sm text-muted-foreground">
              {result.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
            <pre className="overflow-auto rounded-lg bg-background p-3 font-mono text-xs">
              {JSON.stringify(result.jev.answers, null, 2)}
            </pre>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
