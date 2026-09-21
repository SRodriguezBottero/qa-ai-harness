import { adapterHint, loadHarnessConfig } from "@/lib/harness/load-config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConfigPage() {
  const config = loadHarnessConfig();
  const adapters = adapterHint(config);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <header>
        <h1 className="font-heading text-4xl">harness.config.json</h1>
        <p className="mt-2 text-muted-foreground">
          The central decoupler. Each skill reads this and loads only the matching adapter.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Active config</CardTitle>
          <CardDescription>Copy harness.config.example.json for a new team.</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-auto rounded-lg bg-background p-3 font-mono text-xs">
            {JSON.stringify(config, null, 2)}
          </pre>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Resolved adapters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 font-mono text-xs">
          {Object.entries(adapters).map(([key, value]) => (
            <p key={key}>
              <span className="text-muted-foreground">{key}:</span> {value}
            </p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
