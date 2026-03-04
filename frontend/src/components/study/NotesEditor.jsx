import { useState } from "react";

export default function NotesEditor() {
    const [notes, setNotes] = useState("");

    return (
        <div className="bg-gray-100 p-4 rounded-xl shadow">
            <h3 className="font-semibold text-gray-800 mb-2">Your Notes</h3>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write your detailed notes…"
                className="w-full h-40 bg-white p-3 rounded-lg border outline-none"
            />
        </div>
    );
}
