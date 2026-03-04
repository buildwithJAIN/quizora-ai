import React, { useState } from "react";
import QuestionRenderer from "./QuestionRenderer";
import TagBadge from "./TagBadge";

export default function QuizCard({ q }) {
    const [showExplanation, setShowExplanation] = useState(false);

    return (
        <div className="bg-white question-card shadow-md p-5 rounded-xl my-4 border border-gray-100">
            <div className="flex justify-between items-start mb-2">
                <div className="flex-1 pr-2">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {q.id}. <QuestionRenderer text={q.question} />
                    </h3>
                </div>
                <TagBadge tag={q.conceptTag} difficulty={q.difficulty} />
            </div>

            <ul className="space-y-2 mt-3">
                {q.options.map((opt, i) => (
                    <li
                        key={i}
                        className="p-2 rounded-md border border-gray-200 hover:bg-blue-50 cursor-pointer transition"
                    >
                        {opt}
                    </li>
                ))}
            </ul>

            <div className="mt-3">
                <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="text-blue-600 text-sm font-medium "
                >
                    {showExplanation ? "Hide Explanation" : "Show Explanation"}
                </button>

                {showExplanation && (
                    <div className="mt-2 text-gray-700 text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
                        💡 <b>Hint:</b> {q.hint}
                        <br />
                        🧠 <b>Explanation:</b> {q.explanation}
                    </div>
                )}
            </div>
        </div>
    );
}
