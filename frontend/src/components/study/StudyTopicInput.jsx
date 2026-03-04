import { generateStudyContent } from "../../services/studyGenerator";

export default function StudyTopicInput({ topic, setTopic, setStudyData, setLoading }) {
    const handleGenerate = async () => {
        if (!topic.trim()) return;

        setLoading(true);
        const data = await generateStudyContent(topic);
        setStudyData(data);
        setLoading(false);
    };

    return (
        <div className="flex gap-4">
            <input
                type="text"
                placeholder="Enter a topic to study (e.g., Dynamic Programming)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="flex-grow px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button
                onClick={handleGenerate}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition"
            >
                Generate
            </button>
        </div>
    );
}
