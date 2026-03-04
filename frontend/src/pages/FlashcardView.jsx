// components/FlashcardView.jsx
import { useState } from "react";
import QuestionRenderer from "./QuestionRenderer";

export default function FlashcardView({ questions }) {
    const [index, setIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const [status, setStatus] = useState(
        questions.map(() => ({ mastered: false, review: false }))
    );

    const card = questions[index];

    // progress calculation
    const reviewedCount = status.filter(s => s.mastered || s.review).length;
    const progressPercent = (reviewedCount / questions.length) * 100;

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

    return (
        <div className="w-full flex flex-col items-center">

            {/* Progress bar */}
            <div className="w-full max-w-xl mb-4">
                <p className="text-sm text-gray-600 mb-1">
                    {reviewedCount} / {questions.length} cards reviewed
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
                            <QuestionRenderer text={card.answer} />

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

            {/* Buttons */}
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
