# QA AI Harness

Harness genérico de QA asistido por IA para equipos que ya usan Playwright. Separa **workflow** (skills publicables) de **adaptador** (Jira, Linear, GitHub Issues, CI, gestor de casos).

Cursor genera y repara specs. Playwright los ejecuta. **Jev** (TypeSafe System One) toma decisiones baratas: guardrail antes de una acción riesgosa, triage después de un fail. Sin `TYPESAFE_API_KEY` esas decisiones corren un mock local.

No incluye nombres de productos ni cuentas de un cliente concreto.

## Qué incluye esta rebanada

- Skills: `scaffold-tests-from-ticket`, `sync-tests-to-tracker`, `self-heal-regression`, `jev-decisions`
- `harness.config.json` + adaptadores documentados
- Consola Next.js para correr los tres pipelines
- **Mesa**, un inbox de soporte mínimo como aplicación bajo prueba
- Page objects y un spec de Playwright de ejemplo

## Cómo correrlo

```bash
npm install
npx playwright install chromium
npm run dev
```

La consola queda en [http://127.0.0.1:4477](http://127.0.0.1:4477).

Perfil de Mesa: `qa@mesa.test` / `mesa-qa`.

```bash
npm test
```

Jev en vivo (opcional):

```bash
cp .env.example .env.local
# TYPESAFE_API_KEY=...
```

## Config

Copiá `harness.config.example.json`. Los skills leen `issueTracker.type`, `testManagement.type`, `ciSource.type` y cargan un solo archivo en `references/`. Cómo agregar un proveedor: `docs/writing-an-adapter.md`.

## Selector hierarchy

`role` → `label` → `text` → `testId` → `CSS`. Los specs no llevan selectores inline.
