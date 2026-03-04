export default function StudyPlanModal({ onGenerate, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-[380px] text-center shadow-xl">
                <h2 className="text-xl font-bold mb-3">Quiz Completed 🎉</h2>

                <p className="text-gray-600 mb-4">
                    Want a personalized 7-day study plan based on your strengths & weaknesses?
                </p>

                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full mb-2 hover:bg-blue-700"
                    onClick={onGenerate}
                >
                    Generate Study Plan
                </button>

                <button
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg w-full hover:bg-gray-300"
                    onClick={onClose}
                >
                    Maybe Later
                </button>
            </div>
        </div>
    );
}
