export function collectAnalytics(questions, userAnswers, timeStats = {}) {
  return questions.map((q, i) => ({
    id: q.id || i,
    question: q.question,
    topic: q.topic || "General",
    userAnswer: userAnswers[i],
    correctAnswer: q.answer,
    isCorrect: userAnswers[i] === q.answer,
    timeTaken: timeStats[q.id] || null
  }));
}
