import { useNavigate } from "react-router-dom";

export default function StartTestButton() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate("/quiz")}
            className="w-full py-4 bg-green-600 text-white rounded-xl shadow-md 
                 font-semibold hover:bg-green-700 transition"
        >
            Start Test on This Topic
        </button>
    );
}
