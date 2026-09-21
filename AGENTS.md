# Agent notes

This repo is a QA AI harness, not a generic Next.js demo.

- Workflows live in `skills/`. Read `harness.config.json` before any adapter under `references/`.
- Do not put vendor ids in SKILL.md files.
- Never mask a product blocker in self-heal.
- Prefer Playwright locators: role → label → text → testId → CSS.
- Jev calls go through `src/lib/jev`. Mock if `TYPESAFE_API_KEY` is absent.
- The app under test is Mesa at `/mesa`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
