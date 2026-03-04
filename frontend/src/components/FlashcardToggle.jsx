// components/FlashcardToggle.jsx
export default function FlashcardToggle({ mode, setMode }) {
    return (
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
    );
}
