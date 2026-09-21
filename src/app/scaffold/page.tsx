"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const SAMPLE = {
  id: "MESA-12",
  title: "Agent can resolve an inbox ticket",
  body: `Acceptance criteria
- Given I am logged in as the QA profile, when I open Inbox, then I see at least one ticket in the list
- Given I am on Inbox, when I click a ticket, then I see its subject, requester, and status
- Given I am on a ticket, when I change status to Resolved and save, then the inbox shows that ticket as Resolved
- The system should email the requester (out of scope for UI)
- Optional: I can filter tickets by status
- The payouts ledger must show yesterday's volume (not implemented)`,
};

type ScaffoldResponse = {
  error?: string;
  ticket: { id: string; title: string; mode: string };
  spec: { file: string; source: string };
  traceability: { clauseId: string; clause: string; layer: string; note: string }[];
};

export default function ScaffoldPage() {
  const [title, setTitle] = useState(SAMPLE.title);
  const [id, setId] = useState(SAMPLE.id);
  const [body, setBody] = useState(SAMPLE.body);
  const [mode, setMode] = useState<"adversarial" | "conformance">("adversarial");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScaffoldResponse | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/scaffold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title, body, mode }),
      });
      const json = (await response.json()) as ScaffoldResponse;
      if (!response.ok) throw new Error(json.error || "No se pudo generar el spec");
      setResult(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header>
        <h1 className="font-heading text-4xl">Scaffold from ticket</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          El skill genérico lee el ticket, descompone cada criterio y solo usa page objects conocidos.
          Adversarial genera un test rojo si un requisito firme no está implementado.
        </p>
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ticket</CardTitle>
            <CardDescription>Pegá criterios de aceptación, uno por línea.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="ticket-id">ID</Label>
                <Input id="ticket-id" value={id} onChange={(e) => setId(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="ticket-title">Título</Label>
                <Input id="ticket-title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="ticket-body">Cuerpo</Label>
              <Textarea
                id="ticket-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-56 font-mono text-xs"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={mode === "adversarial" ? "default" : "outline"}
                onClick={() => setMode("adversarial")}
              >
                Adversarial
              </Button>
              <Button
                type="button"
                variant={mode === "conformance" ? "default" : "outline"}
                onClick={() => setMode("conformance")}
              >
                Conformance
              </Button>
              <Button type="button" onClick={run} disabled={loading}>
                {loading ? "Generando…" : "Generar spec"}
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Spec</CardTitle>
            <CardDescription>
              {result?.spec.file ?? "Todavía no hay archivo. Generá un spec para verlo."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <Alert>
                <AlertTitle>No se pudo generar</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : result ? (
              <pre className="max-h-[28rem] overflow-auto rounded-lg bg-background p-3 font-mono text-xs">
                {result.spec.source}
              </pre>
            ) : (
              <p className="text-sm text-muted-foreground">El resultado aparece acá.</p>
            )}
          </CardContent>
        </Card>
      </div>
      {result ? (
        <Card>
          <CardHeader>
            <CardTitle>Matriz de trazabilidad</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cláusula</TableHead>
                  <TableHead>Capa</TableHead>
                  <TableHead>Nota</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.traceability.map((row) => (
                  <TableRow key={row.clauseId}>
                    <TableCell>
                      <span className="font-mono text-xs">{row.clauseId}</span>
                      <p>{row.clause}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={row.layer === "DIVERGENCE" ? "destructive" : "secondary"}>
                        {row.layer}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{row.note}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
