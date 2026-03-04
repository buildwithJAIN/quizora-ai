import StudyFlashcardView from "../study/StudyFlashCardView";


export default function StudyContentSections({ loading, studyData }) {
    if (loading) {
        return (
            <div className="text-blue-600 text-xl font-semibold animate-pulse">
                Generating study material…
            </div>
        );
    }

    if (!studyData) {
        return (
            <div className="text-gray-400 text-lg">
                Enter a topic above to begin studying.
            </div>
        );
    }

    return (
        <div className="space-y-8">

            <Section title="Overview" content={studyData.overview} />
            <Section title="Definitions" content={studyData.definitions} />
            <Section title="Formulas" content={studyData.formulas} />
            <Section title="Patterns" content={studyData.patterns} />
            <Section title="Memorization Tips" content={studyData.memory} />
            <Section title="Examples" content={studyData.examples} />

            {/* Flashcards */}
            {typeof studyData.flashcards === "string" && (
                <StudyFlashcardView flashcards={studyData.flashcards} />

            )}

        </div>
    );
}

/* ---------------------- SECTION RENDERER ---------------------- */
function Section({ title, content }) {
    if (!content) return null;

    const safeContent = typeof content === "string"
        ? content
        : JSON.stringify(content, null, 2);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-semibold text-blue-700 mb-3">{title}</h2>

            <div className="whitespace-pre-wrap text-gray-700 text-[15px] leading-relaxed">
                {safeContent}
            </div>
        </div>
    );
}


