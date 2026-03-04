import React, { useEffect, useRef } from "react";
import katex from "katex";
import Prism from "prismjs";
import "katex/dist/katex.min.css";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "../styles/MathRenderer.css";

export default function QuestionRenderer({ text = "" }) {
    const ref = useRef(null);

    useEffect(() => {
        if (!ref.current) return;
        const el = ref.current;
        el.innerHTML = "";
        const src = (text ?? "").toString();
        // ✅ Normalize broken spacing in AI text
        // ✅ Normalize missing spaces from AI text
        let normalized = src
            // Add space before code keywords and punctuation
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/([a-zA-Z])([0-9])/g, "$1 $2")
            .replace(/([0-9])([a-zA-Z])/g, "$1 $2")
            .replace(/([a-z])(\()/g, "$1 $2")
            .replace(/(\))([a-z])/g, "$1 $2")
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/([^\s])(\$|\\\(|\\\[)/g, "$1 $2")
            .replace(/(\$|\\\)|\\\])([^\s])/g, "$1 $2")
            .replace(/\s{2,}/g, " ")
            .trim();

        const srcClean = normalized;


        // --- Detect code blocks ---
        const isCode =
            /(^|\n)\s*(#include|int\s+main|class\s+\w+|def\s+\w+|console\.log|System\.out\.println|function\s*\(|print\s*\()/i.test(
                srcClean
            );

        if (isCode) {
            let lang = "javascript";
            if (/#include|int\s+main|std::/i.test(srcClean)) lang = "cpp";
            else if (/System\.out\.println|public\s+static\s+void\s+main/i.test(srcClean)) lang = "java";
            else if (/^\s*def\s+|\bprint\s*\(/im.test(srcClean)) lang = "python";

            const pre = document.createElement("pre");
            const code = document.createElement("code");
            pre.className = `language-${lang}`;
            code.className = `language-${lang}`;
            code.textContent = srcClean.trim();
            pre.appendChild(code);
            el.appendChild(pre);
            try {
                Prism.highlightAllUnder(el);
            } catch { }
            return;
        }

        // --- Tokenize mixed math and text ($...$, $$...$$, \(...\), \[...\]) ---
        const pattern = /(\\\[(.+?)\\\])|(\\\((.+?)\\\))|(\$\$(.+?)\$\$)|(\$(.+?)\$)/gs;

        let lastIndex = 0;
        let match;

        // ✅ Preserve word spacing properly
        function appendText(t) {
            if (!t) return;
            const clean = t.replace(/[\n\r\t]+/g, " ").replace(/\s{2,}/g, " ");
            const parts = clean.split(/(\s+)/);
            for (const part of parts) {
                if (part.trim() === "") {
                    el.appendChild(document.createTextNode(" "));
                } else {
                    const span = document.createElement("span");
                    span.textContent = part;
                    el.appendChild(span);
                }
            }
        }

        function renderMath(latex, displayMode) {
            el.appendChild(document.createTextNode(" "));
            const span = document.createElement(displayMode ? "div" : "span");
            try {
                katex.render(latex, span, {
                    throwOnError: false,
                    displayMode,
                });
            } catch {
                span.textContent = latex;
            }
            el.appendChild(span);
            el.appendChild(document.createTextNode(" "));
        }

        while ((match = pattern.exec(srcClean)) !== null) {
            appendText(srcClean.slice(lastIndex, match.index));

            if (match[2] != null) renderMath(match[2], true);
            else if (match[4] != null) renderMath(match[4], false);
            else if (match[6] != null) renderMath(match[6], true);
            else if (match[8] != null) renderMath(match[8], false);

            lastIndex = pattern.lastIndex;
        }

        // trailing text
        appendText(srcClean.slice(lastIndex));

        // ✅ FIX spacing between math and normal words (final polish)
        Array.from(el.childNodes).forEach((node, i, arr) => {
            const next = arr[i + 1];
            if (!next) return;

            const isText = node.nodeType === Node.TEXT_NODE;
            const isNextText = next.nodeType === Node.TEXT_NODE;
            const isMath = node.classList?.contains("katex");
            const isNextMath = next.classList?.contains("katex");

            if (
                (isText || isMath) &&
                (isNextText || isNextMath) &&
                !node.textContent.endsWith(" ") &&
                !next.textContent.startsWith(" ")
            ) {
                el.insertBefore(document.createTextNode(" "), next);
            }
        });
    }, [text]);

    return (
        <div
            ref={ref}
            className="text-gray-900 leading-relaxed text-[16px] whitespace-pre-wrap"
        />
    );
}
