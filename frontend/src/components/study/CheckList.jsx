import { useEffect, useState } from "react";

export default function Checklist({ studyData }) {
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (!studyData) return;

        const generated = Object.keys(studyData).map(key => {
            const label = key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, s => s.toUpperCase());

            return {
                text: `Review ${label}`,
                done: false
            };
        });

        setItems(generated);
    }, [studyData]);

    if (!studyData) return null;

    return (
        <div className="bg-blue-50 p-4 rounded-xl shadow">
            <h3 className="font-semibold text-blue-800 mb-3">Checklist</h3>

            {items.map((item, i) => (
                <label key={i} className="flex items-center gap-3 mb-2">
                    <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => {
                            const updated = [...items];
                            updated[i].done = !updated[i].done;
                            setItems(updated);
                        }}
                    />
                    <span className={item.done ? "line-through text-gray-500" : ""}>
                        {item.text}
                    </span>
                </label>
            ))}
        </div>
    );
}
