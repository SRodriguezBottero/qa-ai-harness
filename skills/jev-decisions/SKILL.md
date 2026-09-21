---
name: jev-decisions
description: Call TypeSafe Jev (System One) for cheap typed decisions inside the harness: action guardrails and failure triage. Falls back to a local mock when TYPESAFE_API_KEY is missing.
---

# Jev decisions

Jev is not an LLM. Send `state` + typed `questions`, get probabilities. HTTP:

`POST https://api.typesafe.ai/v1/systemone`  
`Authorization: Bearer $TYPESAFE_API_KEY`

Question types: `noul` (yes/no probability), `choice` (options + confidence), `score` (ordered levels).

Config: `harness.config.json` → `jev`.

- `mode: auto` — live API if a key exists, otherwise mock
- `mode: mock` — always local
- `mode: live` — require a key

## Guardrail (before a tool call)

State: `{ proposed_action, target, environment, notes }`

Questions:

- noul `destructive`
- noul `production`
- choice `allow | review | block`

Code policy: if either noul ≥ `guardrailThreshold`, promote `allow` → `review` and `review` → `block`. Low confidence cannot stay `allow`.

## Triage (after CI)

See `skills/self-heal-regression/triage.md`. One Jev request per failure, decisions composed in TypeScript (`src/lib/jev`).

The playgrounds `/guardrail` and `/triage` exercise both paths.
