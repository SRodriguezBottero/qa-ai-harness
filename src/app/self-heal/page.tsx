"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Unit = {
  files: string[];
  failures: string[];
  bucket: string;
  standardFix: string;
};

export default function SelfHealPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [blockers, setBlockers] = useState<string[]>([]);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/self-heal", { method: "POST" });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Self-heal failed");
      setUnits(json.units);
      setBlockers(json.blockers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <header>
        <h1 className="font-heading text-4xl">Self-heal</h1>
        <p className="mt-2 text-muted-foreground">
          Parte las fallas en unidades sin archivos compartidos. Verificación en vivo es un gate: el
          diff solo no alcanza. Un bloqueador no se parchea.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Plan desde el reporte de CI</CardTitle>
          <CardDescription>Fuente configurada: playwright-json.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button type="button" onClick={run} disabled={loading}>
            {loading ? "Armando plan…" : "Armar unidades de fix"}
          </Button>
        </CardContent>
      </Card>
      {error ? (
        <Alert>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {blockers.length ? (
        <Alert>
          <AlertTitle>Bloqueadores — no enmascarar</AlertTitle>
          <AlertDescription>{blockers.join(" · ")}</AlertDescription>
        </Alert>
      ) : null}
      {units.map((unit) => (
        <Card key={unit.files.join()}>
          <CardHeader>
            <CardTitle className="flex flex-wrap items-center gap-2">
              {unit.files[0]}
              <Badge>{unit.bucket}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground">{unit.standardFix}</p>
            <p className="mt-2 font-mono text-xs">{unit.failures.join(" · ")}</p>
          </CardContent>
        </Card>
      ))}
      {!units.length && !blockers.length ? (
        <p className="text-sm text-muted-foreground">Todavía no hay plan.</p>
      ) : null}
    </div>
  );
}
