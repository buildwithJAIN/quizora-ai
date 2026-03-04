// src/utils/formatMathText.js
export function formatMathText(str = "") {
  if (!str) return "";

  let text = str.trim();

  // Remove stray double escapes
  text = text.replaceAll("\\\\", "\\");

  // Fix misplaced slashes like "\( \)" etc.
  text = text
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\[/g, "[")
    .replace(/\\\]/g, "]");

  // Detect if contains math symbols but missing delimiters
  const looksLikeMath = /\\frac|\\sqrt|\\int|\\sum|\\log|\\sin|\\cos|\\tan|x\^|y\^|z\^|\=|\+|\-|\(|\)/.test(
    text
  );

  // If no math delimiters and it looks like math, wrap with $
  if (looksLikeMath && !/(\$|\\\(|\\\[)/.test(text)) {
    text = `$${text}$`;
  }

  return text;
}
