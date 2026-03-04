import { useState } from "react";
import StudyTopicInput from "../components/study/StudyTopicInput";
import StudyContentSections from "../components/study/StudyContentSections";
import StickyNotes from "../components/study/StickyNotes";
import NotesEditor from "../components/study/NotesEditor";
import Checklist from "../components/study/Checklist";
import StartTestButton from "../components/study/StartTestButton";

export default function StudyPage() {
    const [topic, setTopic] = useState("");
    const [studyData, setStudyData] = useState(null);
    const [loading, setLoading] = useState(false);

    return (
        <div className="w-full h-screen flex flex-col bg-gray-50">

            {/* TOP INPUT */}
            <div className="p-6 border-b bg-white shadow-sm">
                <StudyTopicInput
                    topic={topic}
                    setTopic={setTopic}
                    setStudyData={setStudyData}
                    setLoading={setLoading}
                />
            </div>

            {/* MAIN LAYOUT */}
            <div className="flex flex-1 overflow-hidden">

                {/* LEFT — STUDY CONTENT */}
                <div className="w-2/3 h-full overflow-y-auto p-6">
                    <StudyContentSections loading={loading} studyData={studyData} />
                </div>

                {/* RIGHT — STICKY NOTES + NOTES + CHECKLIST */}
                <div className="w-1/3 h-full border-l p-6 flex flex-col gap-6 bg-white overflow-y-auto">
                    <StickyNotes />
                    <NotesEditor />
                    <Checklist studyData={studyData} />
                </div>

            </div>

            {/* BOTTOM START TEST BUTTON */}
            {studyData && (
                <div className="p-6 border-t bg-white shadow-inner">
                    <StartTestButton />
                </div>
            )}

        </div>
    );
}
