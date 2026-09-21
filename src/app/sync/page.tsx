"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SyncPage() {
  const [parent, setParent] = useState("MESA-12");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{ key: string; title: string; folder: string; specFile: string }[]>(
    [],
  );

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parent,
          specs: [
            {
              file: "_tests/web/agent-can-resolve-an-inbox-ticket.spec.ts",
              titles: [
                "Verify that the QA profile can open Inbox",
                "Verify that a ticket can be marked resolved",
              ],
            },
          ],
        }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Sync failed");
      setCreated(json.created);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <header>
        <h1 className="font-heading text-4xl">Sync to tracker</h1>
        <p className="mt-2 text-muted-foreground">
          With <code>testManagement: none</code> only case tickets are created, with no external
          manager. It never deletes or moves what already exists.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Parent ticket</CardTitle>
          <CardDescription>New cases are linked to this id.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="parent">Parent</Label>
            <Input id="parent" value={parent} onChange={(e) => setParent(e.target.value)} />
          </div>
          <Button type="button" onClick={run} disabled={loading}>
            {loading ? "Creating…" : "Create cases"}
          </Button>
        </CardContent>
      </Card>
      {error ? (
        <Alert>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {created.length ? (
        <div className="space-y-3">
          {created.map((ticket) => (
            <Card key={ticket.key}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge>{ticket.key}</Badge>
                  {ticket.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {ticket.folder} · {ticket.specFile}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No cases created yet.</p>
      )}
    </div>
  );
}
