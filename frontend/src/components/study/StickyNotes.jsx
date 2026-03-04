import { useState } from "react";

export default function StickyNotes() {
    const [notes, setNotes] = useState("");

    return (
        <div className="bg-yellow-100 p-4 rounded-xl shadow">
            <h3 className="font-semibold text-yellow-800 mb-2">Sticky Notes</h3>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Quick reminders…"
                className="w-full h-24 bg-yellow-50 p-2 rounded-lg outline-none border"
            />
        </div>
    );
}
