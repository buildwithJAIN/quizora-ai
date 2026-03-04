export default function StudyPlanView({ studyPlan }) {
    if (!studyPlan) {
        return (
            <p className="text-gray-600 text-center mt-4">
                No study plan generated yet.
            </p>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md mt-6 w-full max-w-3xl mx-auto">

            {/* Strong Topics */}
            <h2 className="text-xl font-bold text-green-700 mb-2">Strong Topics</h2>
            <ul className="list-disc ml-6 text-gray-800">
                {(studyPlan?.strong_topics ?? []).map((topic, i) => (
                    <li key={i}>{topic}</li>
                ))}
            </ul>

            {/* Weak Topics */}
            <h2 className="text-xl font-bold text-red-700 mt-6 mb-2">Weak Topics</h2>
            <ul className="list-disc ml-6 text-gray-800">
                {(studyPlan?.weak_topics ?? []).map((topic, i) => (
                    <li key={i}>{topic}</li>
                ))}
            </ul>

            {/* Explanations */}
            <h2 className="text-xl font-bold text-blue-700 mt-6 mb-2">Explanations</h2>
            <div className="ml-4 text-gray-800 space-y-2">
                {Object.entries(studyPlan?.explanations ?? {}).map(([topic, explanation]) => (
                    <p key={topic}>
                        <strong>{topic}:</strong> {explanation}
                    </p>
                ))}
            </div>

            {/* 7-Day Plan */}
            <h2 className="text-xl font-bold text-purple-700 mt-6 mb-2">7-Day Study Plan</h2>
            <ul className="ml-6 text-gray-800 space-y-2">
                {(studyPlan?.["7_day_plan"] ?? []).map((item, i) => (
                    <li key={i}>
                        <strong>Day {item.day}:</strong> {item.task}
                    </li>
                ))}
            </ul>

        </div>
    );
}
