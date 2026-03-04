// src/utils/formatChemistry.js
export function formatChemistry(text = "") {
  if (!text) return text;

  // quick detection — only run if looks like a formula
  const looksLikeChem = /[A-Z][a-z]?\d|[+-]/.test(text);
  if (!looksLikeChem) return text;

  let t = text.trim();

  // Subscripts: element digits (H2 -> H_{2})
  t = t.replace(/([A-Za-z])(\d+)/g, "$1_{$2}");

  // Superscripts: +, -, 2+, 3-, etc.
  // e.g., Na+ -> Na^{+}, SO4^2- -> SO4^{2-}
  t = t.replace(/([A-Za-z0-9\}])([+-]+)/g, "$1^{ $2 }");
  t = t.replace(/([A-Za-z0-9\}])\^(\d*)([+-])/g, "$1^{ $2$3 }");

  // ensure wrapped for KaTeX
  if (!/(\$|\\\(|\\\[)/.test(t)) t = `$${t}$`;

  return t;
}
