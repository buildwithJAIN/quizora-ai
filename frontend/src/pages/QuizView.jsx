import React from "react";
import QuizCard from "../components/QuizCard";

export default function QuizView({ quiz }) {
    return (
        <div className="quiz-page p-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">{quiz.topic}</h2>
            {quiz.questions.map((q) => (
                <QuizCard key={q.id} q={q} />
            ))}
        </div>
    );
}
