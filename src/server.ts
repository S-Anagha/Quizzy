// src/server.ts

export interface Env {
  AI: any; // Cloudflare Workers AI binding
}

type QuizQuestion = {
  question: string;
  options: string[];
  correct: string;
};

const MODEL = "@cf/meta/llama-3.1-8b-instruct";

/* -----------------------------------------------------------
   Clean JSON Extraction (no markdown allowed)
----------------------------------------------------------- */
function extractJson(text: string): string {
  // Remove accidental markdown fences
  let cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();

  // Ensure we extract only the last valid bracket block
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");

  if (start === -1 || end === -1) {
    console.error("❌ Could not locate JSON array:", cleaned);
    return "";
  }

  return cleaned.slice(start, end + 1).trim();
}

/* -----------------------------------------------------------
   Quiz Generator
----------------------------------------------------------- */
async function generateQuiz(topic: string, env: Env): Promise<QuizQuestion[]> {
  const prompt = `
You are a STRICT JSON generator.

OUTPUT RULES (MANDATORY):
- Output ONLY valid JSON.
- Output ONLY an array. No objects.
- NO text before or after the JSON.
- NO markdown. NO backticks. NO commentary.

FORMAT EXAMPLE:
[
  {
    "question": "string",
    "options": ["A","B","C","D"],
    "correct": "A"
  }
]

QUIZ RULES:
- Generate EXACTLY 5 questions.
- Topic must be STRICTLY about: "${topic}".
- ONE sentence per question.
- Options MUST be JSON strings.
- "correct" MUST exactly match one of the 4 options.
- DO NOT use letters A/B/C as options. Use real answers.
- DO NOT truncate your output.
- DO NOT stop early.

Return ONLY the JSON array.
`;

  const result = await env.AI.run(MODEL, {
    max_tokens: 500,
    temperature: 0.2,
    stop: ["END"],
    messages: [
      { role: "system", content: "You return ONLY JSON arrays. Never markdown." },
      { role: "user", content: prompt }
    ]
  });

  const raw =
    typeof result === "string"
      ? result
      : (result as any).response || JSON.stringify(result);

  console.log("📥 RAW AI OUTPUT:\n", raw);

  const jsonText = extractJson(raw);

  if (!jsonText) {
    throw new Error("AI did not return a valid JSON array");
  }

  try {
    const parsed = JSON.parse(jsonText);
    console.log("📘 FINAL QUIZ:", parsed);
    return parsed;
  } catch (err) {
    console.error("❌ JSON PARSE FAILED.\nRAW JSON BLOCK:\n", jsonText);
    throw new Error("AI returned invalid JSON");
  }
}

/* -----------------------------------------------------------
   Worker Fetch Handler
----------------------------------------------------------- */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/makeQuiz" && request.method === "POST") {
      try {
        const body = (await request.json()) as { topic?: string };
        const topic = (body.topic || "general knowledge") + "";

        console.log("🎯 Generating quiz for:", topic);

        const questions = await generateQuiz(topic, env);

        return Response.json({ questions });
      } catch (err: any) {
        console.error("💥 Error in makeQuiz:", err);
        return Response.json(
          {
            error: "Quiz generation failed",
            details: err?.message ?? "Unknown error"
          },
          { status: 500 }
        );
      }
    }

    return new Response("Quizzy backend running!", { status: 200 });
  }
};
