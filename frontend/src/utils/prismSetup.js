import Prism from "prismjs";

// Base languages
import "prismjs/components/prism-clike";
import "prismjs/components/prism-markup";

// Only load once
if (!Prism.languages.javascript) {
  import("prismjs/components/prism-javascript");
}
if (!Prism.languages.python) {
  import("prismjs/components/prism-python");
}
if (!Prism.languages.cpp) {
  import("prismjs/components/prism-cpp");
}
if (!Prism.languages.java) {
  import("prismjs/components/prism-java");
}

export default Prism;
