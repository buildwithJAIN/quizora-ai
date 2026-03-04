import { useState, useRef, useMemo } from "react";
import { generateQuizFromPrompt } from "../services/aiService";
import QuestionRenderer from "../components/QuestionRenderer";
import { formatMathText } from "../utils/formatMathText";
import { formatChemistry } from "../utils/formatChemistry";
import { Bookmark, BookmarkCheck } from "lucide-react";

/* SMART STUDY PLAN IMPORTS */
import StudyPlanModal from "../components/StudyPlanModal";
import StudyPlanView from "../pages/StudyPlanView";
import { generateStudyPlan } from "../services/aiService";
import { collectAnalytics } from "../utils/collectAnalytics";

/* ---------------------------------------
   Flashcard View Component (Integrated)
---------------------------------------- */
function FlashcardView({ questions }) {
    const [index, setIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [status, setStatus] = useState(
        questions.map(() => ({ mastered: false, review: false }))
    );

    const card = questions[index] || {};

    const reviewedCount = status.filter(s => s.mastered || s.review).length;
    const progressPercent = (reviewedCount / questions.length) * 100;

    const nextCard = () => {
        if (index < questions.length - 1) {
            setIndex(index + 1);
            setIsFlipped(false);
        }
    };

    const prevCard = () => {
        if (index > 0) {
            setIndex(index - 1);
            setIsFlipped(false);
        }
    };

    const markMastered = () => {
        const newStatus = [...status];
        newStatus[index] = { mastered: true, review: false };
        setStatus(newStatus);
    };

    const markReview = () => {
        const newStatus = [...status];
        newStatus[index] = { mastered: false, review: true };
        setStatus(newStatus);
    };

    return (
        <div className="w-full flex flex-col items-center">
            {/* Progress bar */}
            <div className="w-full max-w-xl mb-4">
                <p className="text-sm text-gray-600 mb-1">
                    {reviewedCount}/{questions.length} cards reviewed
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
            </div>

            {/* Flashcard */}
            <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full max-w-xl h-64 bg-white border shadow-md rounded-xl 
    flex items-center justify-center p-6 cursor-pointer transition-transform duration-500"
                style={{
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",

                }}
            >
                <div className="text-center w-full">
                    {!isFlipped ? (
                        <QuestionRenderer text={card.question} />
                    ) : (
                        <div>
                            <p className="font-semibold text-gray-900">Answer:</p>
                            <QuestionRenderer text={card.question || ""} />

                            {card.hint && (
                                <p className="mt-3 text-sm text-gray-700">
                                    💡 {card.hint}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Status badge */}
            <div className="mt-3">
                {status[index].mastered && (
                    <span className="px-3 py-1 text-sm rounded bg-green-100 text-green-700">
                        ⭐ Mastered
                    </span>
                )}
                {status[index].review && (
                    <span className="px-3 py-1 text-sm rounded bg-yellow-100 text-yellow-700">
                        🔁 Review Later
                    </span>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-6">
                <button
                    className="px-3 py-2 bg-gray-100 border rounded-lg"
                    onClick={prevCard}
                    disabled={index === 0}
                >
                    ⬅ Previous
                </button>

                <button
                    className="px-3 py-2 bg-gray-100 border rounded-lg"
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    🔄 Flip
                </button>

                <button
                    className="px-3 py-2 bg-gray-100 border rounded-lg"
                    onClick={nextCard}
                    disabled={index === questions.length - 1}
                >
                    Next ➡
                </button>
            </div>

            {/* Master / Review Buttons */}
            <div className="flex gap-3 mt-4">
                <button
                    onClick={markMastered}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                    ⭐ Mark Mastered
                </button>
                <button
                    onClick={markReview}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
                >
                    🔁 Review Later
                </button>
            </div>
        </div>
    );
}

/* ---------------------------------------
       MAIN QUIZ COMPONENT
---------------------------------------- */

export default function Quiz() {
    const [prompt, setPrompt] = useState("");
    const [quizData, setQuizData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [mode, setMode] = useState("quiz"); // quiz | flashcards

    const [selected, setSelected] = useState({});
    const [hintVisible, setHintVisible] = useState({});
    const [lockedQuestions, setLockedQuestions] = useState({});
    const [bookmarked, setBookmarked] = useState({});
    const [score, setScore] = useState(null);

    /* SMART STUDY PLAN STATES */
    const [showStudyModal, setShowStudyModal] = useState(false);
    const [studyPlan, setStudyPlan] = useState(null);
    const [loadingPlan, setLoadingPlan] = useState(false);

    const containerRef = useRef(null);

    const questions = useMemo(() => quizData?.questions ?? [], [quizData]);

    const answeredCount = Object.keys(selected).length;

    const progress = questions.length
        ? Math.round((answeredCount / questions.length) * 100)
        : 0;

    /* ----------------------
        Generate quiz
    ---------------------- */
    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError("Please enter a topic or prompt.");
            return;
        }

        setError("");
        setLoading(true);
        setQuizData(null);
        setSelected({});
        setHintVisible({});
        setLockedQuestions({});
        setBookmarked({});
        setScore(null);

        try {
            const data = await generateQuizFromPrompt(prompt);

            if (!data || !Array.isArray(data.questions)) {
                throw new Error("Invalid quiz structure received.");
            }

            const cleanData = {
                topic: typeof data.topic === "string" ? data.topic : "Untitled Quiz",
                questions: data.questions.map((q, i) => ({
                    id: q.id || `q${i + 1}`,
                    question:
                        typeof q.question === "string"
                            ? q.question.trim()
                            : JSON.stringify(q.question || ""),
                    options: Array.isArray(q.options)
                        ? q.options.map((o) =>
                            typeof o === "string" ? o.trim() : JSON.stringify(o)
                        )
                        : [],
                    answer:
                        typeof q.answer === "string"
                            ? q.answer.trim()
                            : "",
                    hint:
                        typeof q.hint === "string"
                            ? q.hint
                            : "",
                    conceptTag:
                        typeof q.conceptTag === "string"
                            ? q.conceptTag
                            : "",
                    difficulty:
                        typeof q.difficulty === "string"
                            ? q.difficulty
                            : "",
                })),
            };

            setQuizData(cleanData);
        } catch (err) {
            console.error("⚠️ Quiz generation failed:", err);
            setError("Failed to generate quiz. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (qIdx, option) => {
        if (lockedQuestions[qIdx]) return;
        setSelected({ ...selected, [qIdx]: option });
    };

    const handleShowHint = (qIdx) => {
        if (!selected[qIdx]) return alert("Answer the question first!");
        setHintVisible({ ...hintVisible, [qIdx]: true });
        setLockedQuestions({ ...lockedQuestions, [qIdx]: true });
    };

    const handleSubmit = () => {
        let correct = 0;
        quizData.questions.forEach((q, i) => {
            if (selected[i] === q.answer) correct++;
        });

        setScore(correct);
        setShowStudyModal(true); // SHOW STUDY PLAN POPUP
    };

    const handleRestart = () => {
        setQuizData(null);
        setSelected({});
        setHintVisible({});
        setLockedQuestions({});
        setBookmarked({});
        setScore(null);
        setPrompt("");
        setMode("quiz");
        setStudyPlan(null);
    };

    const scrollToQuestion = (idx) => {
        const el = document.getElementById(`question-${idx}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const toggleBookmark = (qIdx) => {
        setBookmarked((prev) => ({ ...prev, [qIdx]: !prev[qIdx] }));
    };

    /* -------------------------
       SMART PLAN GENERATION
    ------------------------- */
    async function handleGenerateStudyPlan() {
        setLoadingPlan(true);

        const analytics = collectAnalytics(quizData.questions, selected);

        const plan = await generateStudyPlan({ questions: analytics });

        setStudyPlan(plan);
        setLoadingPlan(false);
        setShowStudyModal(false);
    }

    /* ----------------------------------------
            RENDER UI
    ---------------------------------------- */

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center py-10 px-4">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-8 text-center">
                🧠 AI Quiz Generator
            </h1>

            {/* Input Section */}
            {!quizData && (
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-6">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Type any topic or instruction... e.g. 'Generate 5 trigonometry MCQs'"
                        rows={3}
                        className="border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-4 resize-none text-gray-800"
                    ></textarea>

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60"
                    >
                        {loading ? "Generating..." : "Generate Quiz"}
                    </button>

                    {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
                </div>
            )}

            {/* Loader */}
            {loading && (
                <div className="mt-10 flex flex-col items-center">
                    <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Creating your quiz...</p>
                </div>
            )}

            {/* QUIZ or FLASHCARD MODE */}
            {quizData && !score && (
                <div className="mt-8 w-full max-w-6xl flex gap-6">

                    {/* LEFT SIDE */}
                    <div ref={containerRef} className="w-full lg:w-3/4 bg-white p-8 rounded-2xl shadow-lg">

                        {/* Toggle */}
                        <div className="flex gap-3 mb-6">
                            <button
                                onClick={() => setMode("quiz")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium border 
                                ${mode === "quiz" ? "bg-gray-900 text-white" : "bg-white text-gray-700 border-gray-300"}`}
                            >
                                📝 Quiz Mode
                            </button>

                            <button
                                onClick={() => setMode("flashcards")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium border 
                                ${mode === "flashcards" ? "bg-gray-900 text-white" : "bg-white text-gray-700 border-gray-300"}`}
                            >
                                🔁 Flashcard Mode
                            </button>
                        </div>

                        {/* Render Quiz OR Flashcards */}
                        {mode === "flashcards" ? (
                            <FlashcardView questions={questions} />
                        ) : (
                            <>
                                {/* Progress bar */}
                                <div className="w-full mb-6">
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-2 bg-blue-500 transition-all"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <p className="text-right text-sm text-gray-500 mt-1">
                                        {answeredCount}/{questions.length} answered
                                    </p>
                                </div>

                                <h2 className="text-2xl font-semibold mb-6 text-center text-blue-700">
                                    {quizData.topic} Quiz
                                </h2>

                                {quizData.questions.map((q, i) => (
                                    <div
                                        key={q.id}
                                        id={`question-${i}`}
                                        className="mb-8 relative border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                                    >
                                        <button
                                            onClick={() => toggleBookmark(i)}
                                            className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition"
                                        >
                                            {bookmarked[i] ? (
                                                <BookmarkCheck size={20} className="text-red-500" />
                                            ) : (
                                                <Bookmark size={20} className="text-gray-400" />
                                            )}
                                        </button>

                                        <div className="font-semibold mb-3 text-lg text-gray-800 flex gap-2 pr-8">
                                            <span>{i + 1}.</span>
                                            <QuestionRenderer text={formatChemistry(formatMathText(q.question))} />
                                        </div>

                                        <ul className="space-y-2">
                                            {q.options.map((opt, idx) => (
                                                <li
                                                    key={idx}
                                                    onClick={() => handleSelect(i, opt)}
                                                    className={`cursor-pointer border p-2 rounded-md transition 
                                                    ${selected[i] === opt
                                                            ? "bg-blue-600 text-white border-blue-600"
                                                            : lockedQuestions[i]
                                                                ? "opacity-60 cursor-not-allowed bg-gray-100"
                                                                : "hover:bg-blue-50 border-gray-300"
                                                        }`}
                                                >
                                                    <QuestionRenderer text={formatChemistry(formatMathText(opt))} />
                                                </li>
                                            ))}
                                        </ul>

                                        {q.hint && (
                                            <div className="mt-3">
                                                {!hintVisible[i] ? (
                                                    <button
                                                        onClick={() => handleShowHint(i)}
                                                        className="text-sm text-blue-600"
                                                        disabled={!selected[i]}
                                                    >
                                                        💡 Show Hint
                                                    </button>
                                                ) : (
                                                    <p className="text-sm text-gray-700 bg-yellow-50 border border-yellow-200 rounded-lg p-2 mt-2">
                                                        Hint: {q.hint}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex gap-2 mt-3">
                                            {q.conceptTag && (
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                    {q.conceptTag}
                                                </span>
                                            )}
                                            {q.difficulty && (
                                                <span
                                                    className={`text-xs px-2 py-1 rounded-full 
                                                                ${q.difficulty === "easy"
                                                            ? "bg-green-100 text-green-700"
                                                            : q.difficulty === "medium"
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {q.difficulty}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={handleSubmit}
                                    className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition"
                                >
                                    Submit Answers
                                </button>
                            </>
                        )}
                    </div>

                    {/* RIGHT SIDE Navigator */}
                    {mode === "quiz" && (
                        <aside className="hidden lg:block w-1/4">
                            <div className="sticky top-20 bg-white border border-gray-200 rounded-2xl shadow-md p-4">
                                <h3 className="text-gray-700 font-semibold mb-3">Questions</h3>
                                <div className="grid grid-cols-4 gap-2 justify-items-center">
                                    {questions.map((_, i) => {
                                        const answered = selected[i] != null;
                                        const isBookmarked = bookmarked[i];
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => scrollToQuestion(i)}
                                                className={`w-10 h-10 flex items-center justify-center rounded-md text-sm border transition 
                                                ${isBookmarked
                                                        ? "bg-red-500 border-red-500 text-white"
                                                        : answered
                                                            ? "bg-green-500 border-green-500 text-white"
                                                            : "bg-white border-gray-300 hover:bg-gray-100 text-gray-700"
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="mt-6 text-sm text-gray-600">
                                    <div className="flex items-center justify-between mb-1">
                                        <span>Progress</span>
                                        <span className="font-medium text-gray-800">{progress}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-2 bg-blue-500"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </aside>
                    )}
                </div>
            )}

            {/* SCORE SCREEN */}
            {score !== null && !studyPlan && (
                <div className="mt-10 bg-white p-8 rounded-2xl shadow-lg text-center w-full max-w-md">
                    <h2 className="text-2xl text-blue-600 font-bold mb-2">
                        Your Score: {score}/{quizData.questions.length}
                    </h2>
                    <p className="text-gray-600 mb-4">
                        {score === quizData.questions.length
                            ? "Perfect! 🎯"
                            : score > quizData.questions.length / 2
                                ? "Good job! 👍"
                                : "Keep practicing! 💪"}
                    </p>

                    <button
                        onClick={handleRestart}
                        className="mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition"
                    >
                        Try Another Quiz
                    </button>
                </div>
            )}

            {/* STUDY PLAN POPUP */}
            {showStudyModal && (
                <StudyPlanModal
                    onGenerate={handleGenerateStudyPlan}
                    onClose={() => setShowStudyModal(false)}
                />
            )}

            {/* STUDY PLAN LOADER */}
            {loadingPlan && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="font-semibold mb-2">Generating Study Plan...</h2>
                        <p className="text-gray-500">AI is analyzing your performance</p>
                    </div>
                </div>
            )}

            {/* SHOW STUDY PLAN PAGE */}
            {studyPlan && <StudyPlanView plan={studyPlan} />}
        </div>
    );
}
