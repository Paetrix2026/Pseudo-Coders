/**
 * aiService.ts
 *
 * Calls Google Gemini (REST API via fetch) to break a user task into
 * structured JSON covering all 4 accessibility modes.
 *
 * Uses the direct Generative Language REST API — no SDK required.
 * This avoids SDK CORS/version issues in browser environments.
 */

// ── Gemini API configuration ─────────────────────────────────────────────────

const MODEL = 'gemini-flash-latest';   // Switch to flash-latest to bypass quota limits on 2.0-flash

// ── AI response schema ───────────────────────────────────────────────────────

export interface AIBreakdown {
  adhd: {
    steps: string[];
    focus_tip: string;
  };
  dyslexia: {
    points: string[];
    note: string;
  };
  autism: {
    sections: {
      title: string;
      items: string[];
    }[];
  };
  default: {
    summary: string;
    tasks: string[];
  };
}

// ── System prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an AI task breakdown engine for an accessibility-focused platform called ClearMind.

Your job is to transform user input into structured, actionable outputs tailored for different cognitive needs.

IMPORTANT INPUT RULE:
- The input may be:
  1) A clear task (e.g., "complete assignment")
  2) Notes, paragraphs, or mixed content
- You MUST first extract the REAL actionable task from the input before generating outputs.
- If multiple tasks exist, prioritize the MAIN actionable objective and ignore noise.

STRICT RULES:
- Return ONLY valid JSON. No markdown, no explanation, no extra text.
- You MUST generate ALL 4 modes: adhd, dyslexia, autism, default.
- DO NOT skip any mode.
- DO NOT add extra fields beyond the schema.
- DO NOT return empty arrays or empty strings.
- DO NOT repeat the original input.
- DO NOT generate vague or generic steps.

OUTPUT FORMAT (return EXACTLY this structure):
{
  "adhd": {
    "steps": ["step 1", "step 2", "step 3"],
    "focus_tip": "short tip"
  },
  "dyslexia": {
    "points": ["short line", "short line"],
    "note": "simple explanation"
  },
  "autism": {
    "sections": [
      {
        "title": "Section name",
        "items": ["clear item", "clear item"]
      }
    ]
  },
  "default": {
    "summary": "clean structured explanation",
    "tasks": ["task 1", "task 2"]
  }
}

TASK INTERPRETATION RULES:
- Convert messy input into a clear goal (e.g., "prepare notes for exam", "finish math assignment")
- Remove filler, greetings, or unrelated text
- If input is informational (notes), convert it into an actionable study or execution task
- Always produce meaningful, real-world steps

MODE-SPECIFIC RULES:

ADHD:
- Break into 5–8 SMALL steps
- Each step must be short and actionable (max 10 words)
- Each step must represent a clear physical or mental action
- Avoid abstract steps

Dyslexia:
- Use very short sentences (max 8 words each)
- Use simple, familiar words only
- 4–7 bullet points
- note must explain the task in the simplest way possible

Autism:
- Use 3–5 clearly labelled sections
- Each section has 2–4 precise, predictable items
- Use consistent structure across sections
- Avoid ambiguity and flexible wording

Default:
- summary: 1–2 sentences, clear and structured
- 4–6 tasks, each specific and outcome-driven

QUALITY CONSTRAINTS:
- Steps must be logically ordered
- No duplicated meaning across steps
- No vague phrases like "work on it", "do it", "handle task"
- Every line must add value

FAILSAFE:
- If input is unclear, assume a reasonable academic/productivity task and proceed
- NEVER return empty or generic output`;

// ── Request body builder ──────────────────────────────────────────────────────

function buildRequestBody(userTask: string) {
  return {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: userTask }],
      },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.4,
      maxOutputTokens: 1500,
    },
  };
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Calls Gemini REST API to break down the task into all 4 accessibility modes.
 * Throws a descriptive error on failure — caller should catch and fall back.
 */
export async function callGeminiBreakdown(userTask: string): Promise<AIBreakdown> {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  let response: Response;

  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildRequestBody(userTask)),
    });
  } catch (networkErr) {
    throw new Error(`Network error calling Gemini: ${String(networkErr)}`);
  }

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '(no body)');

    // Provide a friendly message for rate-limit errors
    if (response.status === 429) {
      // Try to extract retry delay from Google's error message
      const retryMatch = errorBody.match(/retry in ([\d.]+)s/i);
      const retrySec = retryMatch ? Math.ceil(Number(retryMatch[1])) : null;
      throw new Error(
        retrySec
          ? `API quota exceeded. Please retry in ${retrySec} seconds.`
          : 'API quota exceeded for this key. Please check your Google AI billing or try a different API key at https://aistudio.google.com/apikey'
      );
    }

    throw new Error(
      `Gemini API returned HTTP ${response.status}: ${errorBody}`
    );
  }

  const data = await response.json();

  // Extract text from the Gemini response envelope
  const text: string | undefined =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error(
      `Gemini response missing candidates text. Full response: ${JSON.stringify(data)}`
    );
  }

  // Strip accidental markdown fences (e.g. ```json ... ```) just in case
  const cleanText = text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '');

  let parsed: AIBreakdown;
  try {
    parsed = JSON.parse(cleanText) as AIBreakdown;
  } catch {
    throw new Error(`Failed to parse Gemini JSON: ${cleanText.slice(0, 200)}`);
  }

  // Basic structural validation — throw so caller can fall back to static
  if (
    !parsed.adhd?.steps?.length ||
    !parsed.dyslexia?.points?.length ||
    !parsed.autism?.sections?.length ||
    !parsed.default?.tasks?.length
  ) {
    throw new Error(
      `Gemini returned incomplete breakdown. Keys received: ${Object.keys(parsed).join(', ')}`
    );
  }

  return parsed;
}
