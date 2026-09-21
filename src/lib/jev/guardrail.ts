import type { HarnessConfig } from "@/lib/harness/types";
import { evaluateWithJev, type JevResponse } from "./client";

export type GuardrailDecision = "allow" | "review" | "block";

export type GuardrailInput = {
  action: string;
  target?: string;
  environment?: string;
  notes?: string;
};

export type GuardrailResult = {
  decision: GuardrailDecision;
  reasons: string[];
  jev: JevResponse;
};

export async function evaluateGuardrail(
  input: GuardrailInput,
  config: HarnessConfig,
): Promise<GuardrailResult> {
  const jev = await evaluateWithJev(
    {
      state: {
        proposed_action: input.action,
        target: input.target ?? "",
        environment: input.environment ?? "unknown",
        notes: input.notes ?? "",
      },
      questions: {
        destructive: {
          type: "noul",
          instructions:
            "Would this action mutate or destroy data, or hit a production system?",
        },
        production: {
          type: "noul",
          instructions: "Does the target or environment look like production?",
        },
        decision: {
          type: "choice",
          instructions: "How should an automation harness treat this action?",
          criteria: {
            allow:
              "Read-only, local, or clearly safe against a dedicated test environment.",
            review:
              "Write that may be legitimate in a test env but needs a human look.",
            block:
              "Destructive, production-facing, or otherwise unsafe to run unattended.",
          },
        },
      },
    },
    jevOptions(config),
  );

  const decisionAnswer = jev.answers.decision;
  const destructive = jev.answers.destructive?.type === "noul" ? jev.answers.destructive.noul : 0;
  const production = jev.answers.production?.type === "noul" ? jev.answers.production.noul : 0;
  let decision: GuardrailDecision =
    decisionAnswer?.type === "choice" ? (decisionAnswer.choice as GuardrailDecision) : "review";

  if (destructive >= config.jev.guardrailThreshold || production >= config.jev.guardrailThreshold) {
    decision = decision === "allow" ? "review" : "block";
  }

  const confidence =
    decisionAnswer?.type === "choice" ? decisionAnswer.confidence : 0.5;
  if (confidence < config.jev.triageConfidenceFloor && decision === "allow") {
    decision = "review";
  }

  const reasons = [
    `destructive=${destructive.toFixed(2)}`,
    `production=${production.toFixed(2)}`,
    decisionAnswer?.type === "choice"
      ? `choice=${decisionAnswer.choice} confidence=${decisionAnswer.confidence.toFixed(2)}`
      : "choice unavailable",
  ];

  return { decision, reasons, jev };
}

function jevOptions(config: HarnessConfig) {
  return {
    apiKey: process.env.TYPESAFE_API_KEY,
    apiUrl: process.env.TYPESAFE_API_URL,
    mode: config.jev.mode,
    model: config.jev.model,
  };
}
