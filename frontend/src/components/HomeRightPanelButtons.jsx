import { useNavigate } from "react-router-dom";
import {
    BookOpenIcon,
    PencilSquareIcon,
    RocketLaunchIcon,
} from "@heroicons/react/24/outline";

export default function HomeRightPanelButtons() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-6 w-full px-6">

            {/* STUDY MODE */}
            <button
                onClick={() => navigate("/study")}
                className="group w-full py-4 bg-gradient-to-r from-blue-600 to-blue-800 
                   text-white rounded-xl shadow-lg flex items-center justify-center gap-3
                   hover:scale-[1.03] hover:shadow-xl transition-all active:scale-95"
            >
                <BookOpenIcon className="h-6 w-6 text-white group-hover:rotate-[8deg] transition" />
                <span className="font-semibold tracking-wide">Study Mode</span>
            </button>

            {/* QUIZ MODE */}
            <button
                onClick={() => navigate("/quiz")}
                className="group w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 
                   text-white rounded-xl shadow-lg flex items-center justify-center gap-3
                   hover:scale-[1.03] hover:shadow-xl transition-all active:scale-95"
            >
                <PencilSquareIcon className="h-6 w-6 text-white group-hover:-rotate-8 transition" />
                <span className="font-semibold tracking-wide">Quiz Mode</span>
            </button>

            {/* STUDY + QUIZ MODE */}
            <button
                onClick={() => navigate("/study-quiz")}
                className="group w-full py-4 bg-gradient-to-r from-gray-700 to-gray-900 
                   text-white rounded-xl shadow-lg flex items-center justify-center gap-3
                   hover:scale-[1.03] hover:shadow-xl transition-all active:scale-95"
            >
                <RocketLaunchIcon className="h-6 w-6 text-white group-hover:translate-y-[-3px] transition" />
                <span className="font-semibold tracking-wide">Study + Quiz Mode</span>
            </button>

        </div>
    );
}
