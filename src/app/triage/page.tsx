"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Row = {
  id: string;
  title: string;
  bucket: string;
  action: string;
  urgent: number;
  flaky: number;
  blocker: number;
  heuristic: string;
};

export default function TriagePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [source, setSource] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/triage", { method: "POST" });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Triage failed");
      setRows(json.rows);
      setSource(json.jev?.source ?? "mock");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <header>
        <h1 className="font-heading text-4xl">Jev triage</h1>
        <p className="mt-2 text-muted-foreground">
          Clasifica un reporte de Playwright JSON. Un bloqueador no se “arregla” cambiando el test.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Reporte de ejemplo</CardTitle>
          <CardDescription>
            Timeout, selector-drift, flake por retry y un 500 de aplicación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button type="button" onClick={run} disabled={loading}>
            {loading ? "Clasificando…" : "Correr triage"}
          </Button>
        </CardContent>
      </Card>
      {error ? (
        <Alert>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {rows.length ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Resultado
              {source ? <Badge variant="outline">{source}</Badge> : null}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test</TableHead>
                  <TableHead>Bucket</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead>Señales</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <p>{row.title}</p>
                      <p className="font-mono text-xs text-muted-foreground">{row.id}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{row.bucket}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={row.action === "blocker" ? "destructive" : "outline"}>
                        {row.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      urgent {row.urgent.toFixed(2)} · flaky {row.flaky.toFixed(2)} · blocker{" "}
                      {row.blocker.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <p className="text-sm text-muted-foreground">Todavía no hay filas. Corré el triage de ejemplo.</p>
      )}
    </div>
  );
}
