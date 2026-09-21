export type NoulQuestion = {
  type: "noul";
  instructions: string;
  criteria?: { true?: string; false?: string };
};

export type ChoiceQuestion = {
  type: "choice";
  instructions: string;
  criteria: Record<string, string | null>;
};

export type ScoreQuestion = {
  type: "score";
  instructions: string;
  criteria: string[];
};

export type JevQuestion = NoulQuestion | ChoiceQuestion | ScoreQuestion;

export type NoulAnswer = { type: "noul"; noul: number };
export type ChoiceAnswer = {
  type: "choice";
  choice: string;
  probabilities: Record<string, number>;
  confidence: number;
};
export type ScoreAnswer = {
  type: "score";
  score: number;
  legend: Record<string, string>;
  probabilities: Record<string, number>;
  confidence: number;
};

export type JevAnswer = NoulAnswer | ChoiceAnswer | ScoreAnswer;

export type JevRequest = {
  state: unknown;
  model?: string;
  questions: Record<string, JevQuestion>;
};

export type JevResponse = {
  model: string;
  answers: Record<string, JevAnswer>;
  usage: { input_tokens: number; output_tokens: number };
  source: "live" | "mock";
};

const STATE_TEXT_LIMIT = 12_000;

export function flattenState(state: unknown): string {
  if (typeof state === "string") return state;
  try {
    return JSON.stringify(state, null, 2);
  } catch {
    return String(state);
  }
}

function softmaxLike(scores: number[]): number[] {
  const max = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

function confidenceFromProbs(probs: number[]): number {
  const sorted = [...probs].sort((a, b) => b - a);
  const top = sorted[0] ?? 0;
  const second = sorted[1] ?? 0;
  return Math.max(0, Math.min(1, top - second + (top > 0.8 ? 0.15 : 0)));
}

function tokenish(text: string) {
  return Math.max(40, Math.round(text.length / 4));
}

export function mockEvaluate(request: JevRequest, model = "jev-mock"): JevResponse {
  const text = flattenState(request.state).toLowerCase();
  const answers: Record<string, JevAnswer> = {};

  for (const [key, question] of Object.entries(request.questions)) {
    if (question.type === "noul") {
      answers[key] = { type: "noul", noul: mockNoul(text, question) };
    } else if (question.type === "choice") {
      answers[key] = mockChoice(text, question);
    } else {
      answers[key] = mockScore(text, question);
    }
  }

  return {
    model,
    answers,
    usage: {
      input_tokens: tokenish(flattenState(request.state)),
      output_tokens: Object.keys(answers).length * 12,
    },
    source: "mock",
  };
}

function mockNoul(text: string, question: NoulQuestion): number {
  const q = `${question.instructions} ${question.criteria?.true ?? ""}`.toLowerCase();
  const hits = keywordHits(text, q);
  if (/urgent|asap|production|delete|drop table|rm -rf|destructive/.test(q)) {
    if (/asap|urgent|production|prod |delete|drop |wipe|destroy/.test(text)) return clamp(0.82 + hits * 0.04);
    return clamp(0.12 + hits * 0.08);
  }
  if (/flaky|retry|intermittent/.test(q)) {
    if (/flaky|retry|intermittent|passed on retry/.test(text)) return clamp(0.78 + hits * 0.05);
    return clamp(0.18 + hits * 0.06);
  }
  if (/blocker|app bug|not a test/.test(q)) {
    if (/500|application error|server error|not a test bug|product bug/.test(text))
      return clamp(0.8 + hits * 0.04);
    return clamp(0.2 + hits * 0.05);
  }
  if (/safe|read-only|screenshot/.test(q)) {
    if (/screenshot|snapshot|read|list|open/.test(text) && !/delete|write|prod/.test(text))
      return clamp(0.86);
    return clamp(0.35);
  }
  return clamp(0.35 + hits * 0.08);
}

function mockChoice(text: string, question: ChoiceQuestion): ChoiceAnswer {
  const options = Object.keys(question.criteria);
  const scores = options.map((option) => {
    const rubric = `${option} ${question.criteria[option] ?? ""}`.toLowerCase();
    let score = 0.15 + keywordHits(text, rubric) * 0.45 + keywordHits(text, option) * 0.7;
    if (option.includes("selector") && /strict mode|locator|not found|tobevisible/.test(text))
      score += 1.6;
    if (option.includes("timeout") && /timeout|waiting for/.test(text)) score += 1.6;
    if (option.includes("hardcoded") && /expected .* received|tohave text/.test(text)) score += 1.2;
    if (option.includes("network") && /route|graphql|rest|status 4/.test(text)) score += 1.4;
    if (option.includes("rbac") && /permission|role|hidden|unauthorized/.test(text)) score += 1.3;
    if (option.includes("blocker") && /500|application error|not a test/.test(text)) score += 1.8;
    if (option.includes("flaky") && /flaky|retry|intermittent/.test(text)) score += 1.7;
    if (option === "allow" && /screenshot|snapshot|navigate|click login/.test(text)) score += 1.1;
    if (option === "block" && /delete|production|drop |wipe/.test(text)) score += 2;
    if (option === "review" && /write|update|patch|prod/.test(text)) score += 1.1;
    return score;
  });
  const probabilitiesArr = softmaxLike(scores);
  const probabilities = Object.fromEntries(options.map((o, i) => [o, round4(probabilitiesArr[i] ?? 0)]));
  const choice = options[probabilitiesArr.indexOf(Math.max(...probabilitiesArr))] ?? options[0] ?? "unknown";
  return {
    type: "choice",
    choice,
    probabilities,
    confidence: round4(confidenceFromProbs(probabilitiesArr)),
  };
}

function mockScore(text: string, question: ScoreQuestion): ScoreAnswer {
  const levels = question.criteria;
  const scores = levels.map((level, index) => {
    const hits = keywordHits(text, level.toLowerCase());
    return index * 0.2 + hits * 0.8 + (/high|severe|urgent/.test(level.toLowerCase()) && /urgent|asap|500/.test(text) ? 1.4 : 0);
  });
  const probabilitiesArr = softmaxLike(scores);
  const score = probabilitiesArr.reduce((acc, p, i) => acc + p * i, 0);
  const legend = Object.fromEntries(levels.map((level, i) => [String(i), level]));
  const probabilities = Object.fromEntries(levels.map((_, i) => [String(i), round4(probabilitiesArr[i] ?? 0)]));
  return {
    type: "score",
    score: round4(score),
    legend,
    probabilities,
    confidence: round4(confidenceFromProbs(probabilitiesArr)),
  };
}

function keywordHits(text: string, source: string) {
  const words = source
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 3);
  return words.reduce((n, w) => n + (text.includes(w) ? 1 : 0), 0);
}

function clamp(n: number) {
  return round4(Math.max(0.01, Math.min(0.99, n)));
}

function round4(n: number) {
  return Math.round(n * 10000) / 10000;
}

export async function evaluateWithJev(
  request: JevRequest,
  options: { apiKey?: string; apiUrl?: string; mode: "auto" | "live" | "mock"; model: string },
): Promise<JevResponse> {
  const wantLive =
    options.mode === "live" || (options.mode === "auto" && Boolean(options.apiKey));
  if (!wantLive) return mockEvaluate(request, "jev-mock");
  if (!options.apiKey) {
    throw new Error("TYPESAFE_API_KEY is required for live Jev calls.");
  }

  const url = options.apiUrl || "https://api.typesafe.ai/v1/systemone";
  const payload = {
    state: request.state,
    model: request.model ?? options.model,
    questions: request.questions,
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Jev API ${res.status}: ${detail.slice(0, STATE_TEXT_LIMIT)}`);
  }

  const body = (await res.json()) as Omit<JevResponse, "source">;
  return { ...body, source: "live" };
}
