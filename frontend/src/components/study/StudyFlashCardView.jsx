import { useState } from "react";

export default function StudyFlashcardView({ flashcards }) {
    const cards = parseFlashcards(flashcards);
    const [index, setIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const [status, setStatus] = useState(
        cards.map(() => ({ mastered: false, review: false }))
    );

    const card = cards[index];

    const reviewedCount = status.filter(s => s.mastered || s.review).length;
    const progressPercent = (reviewedCount / cards.length) * 100;

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
        <div className="w-full flex flex-col items-center mt-6">

            {/* Progress bar */}
            <div className="w-full max-w-xl mb-4">
                <p className="text-sm text-gray-600 mb-1">
                    {reviewedCount} / {cards.length} cards reviewed
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
                        <p className="text-lg text-gray-900 font-medium">{card.question}</p>
                    ) : (
                        <div>
                            <p className="font-semibold text-gray-900">Answer:</p>
                            <p className="text-gray-800">{card.answer}</p>
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

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
                <button
                    className="px-3 py-2 bg-gray-100 border rounded-lg"
                    onClick={() => { setIndex(i => i - 1); setIsFlipped(false); }}
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
                    onClick={() => { setIndex(i => i + 1); setIsFlipped(false); }}
                    disabled={index === cards.length - 1}
                >
                    Next ➡
                </button>
            </div>

            {/* Master / Review buttons */}
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

/* flashcard parser */
function parseFlashcards(text) {
    if (!text || typeof text !== "string") return [];

    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    const cards = [];

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("Q:")) {
            cards.push({
                question: lines[i].replace("Q:", "").trim(),
                answer: lines[i + 1]?.replace("A:", "").trim() || "",
            });
        }
    }

    return cards;
}
