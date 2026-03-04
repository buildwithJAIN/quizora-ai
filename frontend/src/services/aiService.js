// src/services/aiService.js

// ⚠️ Move to .env in production
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_BASE =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

/* ==========================================================
   UNIVERSAL JSON CLEANER — removes ALL markdown & backticks
========================================================== */

function cleanJson(str) {
  if (!str) return "";

  return str
    // remove fenced blocks ```json ... ``` including cases with spaces
    .replace(/```[\s\S]*?```/g, (block) =>
      block.replace(/```[\w]*/g, "").replace(/```/g, "")
    )

    // remove inline ```json or ```js or others
    .replace(/```json/gi, "")
    .replace(/```js/gi, "")
    .replace(/```javascript/gi, "")
    .replace(/```/g, "")

    // remove stray single or double backticks
    .replace(/`+/g, "")

    // final cleanup
    .trim();
}

/* ==========================================================
   JSON EXTRACTOR — finds the first {...} block safely
========================================================== */

function extractJson(text) {
  if (!text) throw new Error("Empty AI response");

  // Try direct parse
  try {
    return JSON.parse(text);
  } catch { }

  // Try extracting a JSON block
  const block = text.match(/\{[\s\S]*\}/m);
  if (block) {
    try {
      return JSON.parse(block[0]);
    } catch { }
  }

  // Try trimming to first and last braces
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first !== -1 && last !== -1) {
    try {
      return JSON.parse(text.slice(first, last + 1));
    } catch { }
  }

  // Nothing worked
  console.error("❌ Unable to extract valid JSON from:", text);
  throw new Error("Unable to extract valid JSON from Gemini response.");
}

/* ==========================================================
   QUIZ GENERATION (Stable)
========================================================== */

export async function generateQuizFromPrompt(promptText) {
  const prompt = `
You are QuizGen — an AI that creates multiple-choice quizzes.

User request:
"${promptText}"

Return ONLY valid JSON:

{
  "topic": "auto",
  "difficulty": "mixed",
  "questions": [
    {
      "id": "q1",
      "question": "text or LaTeX",
      "options": ["opt1","opt2","opt3","opt4"],
      "answer": "one option",
      "explanation": "short",
      "hint": "short",
      "conceptTag": "topic",
      "difficulty": "easy|medium|hard",
      "confidence": 0.0–1.0
    }
  ]
}

Rules:
- NO backticks
- NO markdown
- JSON only
`;

  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  };

  try {
    const res = await fetch(GEMINI_API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const raw = await res.text();
    const cleaned = cleanJson(raw);
    const json = extractJson(cleaned);

    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Empty output");

    return extractJson(cleanJson(text));

  } catch (err) {
    console.error("❌ Quiz generation failed:", err);
    throw err;
  }
}

/* ==========================================================
   STUDY PLAN GENERATION — FULLY FIXED
========================================================== */

export async function generateStudyPlan(analyticsData) {
  const prompt = `
You are an AI study coach.

Student performance:
${JSON.stringify(analyticsData, null, 2)}

Return STRICT JSON:

{
  "strong_topics": [],
  "weak_topics": [],
  "explanations": {},
  "7_day_plan": []
}

Rules:
- NO markdown
- NO backticks
- ONLY pure JSON
`;

  const body = {
    contents: [
      { role: "user", parts: [{ text: prompt }] }
    ],
  };

  try {
    const res = await fetch(GEMINI_API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const raw = await res.text();

    // STEP 1: Remove all markdown garbage
    const cleaned = cleanJson(raw);

    // STEP 2: Extract valid JSON
    return extractJson(cleaned);

  } catch (err) {
    console.error("❌ Study Plan generation failed:", err);
    throw err;
  }
}

