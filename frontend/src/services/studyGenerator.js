
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const GEMINI_API_BASE =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Generate structured study material for a given topic.
 * Returns an object like:
 * {
 *   overview: string,
 *   definitions: string,
 *   formulas: string,
 *   patterns: string,
 *   memory: string,
 *   examples: string,
 *   flashcards: string
 * }
 */
export async function generateStudyContent(topic) {
  const prompt = `
You are an AI Study Guide.

Create structured study material for the topic: "${topic}".

Return ONLY valid JSON with this exact structure (no extra text):

{
  "overview": "Short high-level explanation of the topic in 4–6 lines.",
  "definitions": "Key terms and definitions as bullet points.",
  "formulas": "Important formulas or core rules (if none, say 'No specific formulas, focus on concepts.').",
  "patterns": "Common patterns, question types, or ways this appears in exams/interviews.",
  "memory": "Memorization tips, mnemonics, analogies, or tricks to remember the topic.",
  "examples": "2-3 clear examples or mini-scenarios that illustrate the topic.",
  "flashcards": "Write 5–8 Q&A pairs in a simple 'Q: ...\\nA: ...' format, separated by blank lines."
}
`;

  try {
    const res = await fetch(GEMINI_API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!res.ok) {
      console.error("❌ Gemini API error:", await res.text());
      throw new Error("Failed to generate study content");
    }

    const data = await res.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    // Sometimes the model wraps JSON in ```json ``` – strip that
    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("❌ JSON parse error for study content:", err, cleaned);
      parsed = {};
    }

    // Fallback defaults so UI never crashes
    return {
      overview: parsed.overview || `Overview for ${topic} is not available.`,
      definitions: parsed.definitions || "",
      formulas: parsed.formulas || "",
      patterns: parsed.patterns || "",
      memory: parsed.memory || "",
      examples: parsed.examples || "",
      flashcards: parsed.flashcards || "",
    };
  } catch (err) {
    console.error("❌ generateStudyContent failed:", err);
    return {
      overview: `Unable to generate study content for "${topic}" right now.`,
      definitions: "",
      formulas: "",
      patterns: "",
      memory: "",
      examples: "",
      flashcards: "",
    };
  }
}