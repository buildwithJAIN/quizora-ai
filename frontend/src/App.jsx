import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../src/pages/HomePage";
import StudyPage from "../src/pages/StudyPage";
import QuizPage from "../src/pages/QuizView";
import StudyQuizPage from "../src/pages/StudyQuizPage";
import Quiz from "./pages/Quiz";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/study" element={<StudyPage />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/study-quiz" element={<StudyQuizPage />} />
      </Routes>
    </Router>
  );
}

export default App;
