import React from "react";

export default function TagBadge({ tag, difficulty }) {
    const colorMap = {
        easy: "bg-green-200 text-green-900",
        medium: "bg-yellow-200 text-yellow-900",
        hard: "bg-red-200 text-red-900",
    };

    return (
        <span
            className={`inline-block px-2 py-1 text-xs font-semibold rounded-md ${colorMap[difficulty] || "bg-gray-200 text-gray-800"}`}
        >
            {tag} • {difficulty}
        </span>
    );
}
