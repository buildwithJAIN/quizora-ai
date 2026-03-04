import HomeLeftPanel from "../components/HomeLeftPanel";
import HomeRightPanelButtons from "../components/HomeRightPanelButtons";

export default function HomePage() {
    return (
        <div className="w-full h-screen bg-blue-50 flex overflow-hidden">

            {/* LEFT 3/4 */}
            <div className="w-3/4 h-full bg-blue-100 flex">
                <HomeLeftPanel />
            </div>

            {/* RIGHT 1/4 */}
            <div className="w-1/4 h-full bg-white shadow-xl border-l border-gray-200 flex items-center justify-center">
                <HomeRightPanelButtons />
            </div>

        </div>
    );
}
