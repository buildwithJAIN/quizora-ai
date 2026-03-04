import { useState } from "react";
import { generateQuizFromPrompt } from "../services/aiService";
import QuizView from "./QuizView";

export default function GenerateQuiz() {
    const [quiz, setQuiz] = useState(null);
    const [promptText, setPromptText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleGenerate() {
        if (!promptText.trim()) return;
        setLoading(true);
        setError("");
        try {
            // ✅ send full prompt text (any type: topic, instruction, etc.)
            console.log("tetsing here 2------------------------------")
            const result = await generateQuizFromPrompt(promptText);
            setQuiz(result);
        } catch (err) {
            console.error("Quiz generation error:", err);
            setError("❌ " + err.message);
        } finally {
            setLoading(false);
        }
    }

    // Show the quiz once loaded
    if (quiz) return <QuizView quiz={quiz} />;

    return (
        <div className="quiz-page flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    🧠 Generate Your Quiz
                </h2>

                <textarea
                    placeholder="Type anything... e.g. 'Generate 10 algebra questions about quadratic equations' or 'Create 5 JavaScript array quiz questions'"
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    className="border border-gray-300 p-3 rounded-md w-full h-28 resize-none focus:ring-2 focus:ring-blue-500 mb-4 text-sm"
                />

                <button
                    onClick={handleGenerate}
                    disabled={loading || !promptText.trim()}
                    className={`w-full py-2 rounded-md font-medium text-white transition ${loading || !promptText.trim()
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {loading ? "Generating..." : "Generate Quiz"}
                </button>

                {error && (
                    <p className="text-red-600 text-sm text-center mt-3">{error}</p>
                )}

                <p className="text-gray-500 text-xs mt-5 text-center">
                    Tip: You can enter any kind of question prompt — math, code, physics,
                    reasoning, or a custom topic. QuizGen will adapt automatically.
                </p>
            </div>
        </div>
    );
}
