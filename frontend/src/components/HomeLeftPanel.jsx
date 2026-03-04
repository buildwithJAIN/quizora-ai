import studyHero from "../assets/study-hero.png";

export default function HomeLeftPanel() {
    return (
        <div className="w-full h-full flex">

            {/* LEFT SIDE — IMAGE 70% */}
            <div className="w-[70%] h-full flex items-center justify-center p-6">
                <img
                    src={studyHero}
                    alt="Study"
                    className="h-[90%] w-auto object-contain rounded-3xl shadow-lg border border-blue-200"
                />
            </div>

            {/* RIGHT SIDE — CONTENT 30% */}
            <div className="w-[30%] h-full flex flex-col justify-center pr-10">

                <h1 className="text-4xl font-bold text-blue-800">
                    Master Any Topic with AI Guidance
                </h1>

                <p className="text-gray-600 mt-6 text-lg leading-relaxed">
                    This AI Study Planner helps you learn anything step-by-step with
                    definitions, formulas, patterns, memorization hacks, and personalized quizzes.
                </p>

            </div>

        </div>
    );
}
