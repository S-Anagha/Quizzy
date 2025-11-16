// src/app.tsx

import { useState } from "react";
import "./styles.css";

type QuizQuestion = {
  question: string;
  options: string[];
  correct: string;
};

export default function App() {
  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function makeQuiz() {
    if (!topic.trim()) {
      alert("Please enter a topic!");
      return;
    }

    setLoading(true);
    setScore(null);
    setQuiz([]);
    setAnswers({});
    setErrorMsg(null);

    try {
      console.log("🎯 Sending topic to backend:", topic);

      const res = await fetch("/api/makeQuiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        console.error("💥 Backend error:", errBody);
        setErrorMsg("Server error while generating quiz.");
        return;
      }

      const data: { questions?: QuizQuestion[] } = await res.json();
      console.log("🧠 Quiz data from backend:", data);

      if (!data.questions || !Array.isArray(data.questions) || !data.questions.length) {
        setErrorMsg("Quiz generation failed. Try a different topic.");
        return;
      }

      setQuiz(data.questions);
    } catch (err) {
      console.error("💥 Quiz fetch error:", err);
      setErrorMsg("Network error while making the quiz.");
    } finally {
      setLoading(false);
    }
  }

  function selectAnswer(index: number, choice: string) {
    setAnswers((prev) => ({ ...prev, [index]: choice }));
  }

  function submitQuiz() {
    if (!quiz.length) return;

    let computedScore = 0;
    quiz.forEach((q, i) => {
      if (answers[i] && answers[i] === q.correct) {
        computedScore++;
      }
    });

    setScore(computedScore);
  }

  function resetAll() {
    setTopic("");
    setQuiz([]);
    setAnswers({});
    setScore(null);
    setErrorMsg(null);
  }

  return (
    <div className="container">
      <h1>🐙 Quizzy</h1>
      <p className="subtitle">Your friendly AI quiz generator on any topic!</p>

      {/* Topic input */}
      {!quiz.length && (
        <div className="topic-section">
          <input
            type="text"
            value={topic}
            placeholder="Enter a topic (e.g., computers, history)"
            onChange={(e) => setTopic(e.target.value)}
          />
          <button onClick={makeQuiz} disabled={loading}>
            {loading ? "Making quiz..." : "Make Quiz"}
          </button>
        </div>
      )}

      {/* Errors */}
      {errorMsg && <div className="error">{errorMsg}</div>}

      {/* Quiz UI */}
      {quiz.length > 0 && (
        <div className="quiz-section">
          {quiz.map((q, i) => (
            <div key={i} className="question">
              <h3>
                {i + 1}. {q.question}
              </h3>
              <div className="options-row">
                {q.options.map((opt, j) => (
                  <button
                    key={j}
                    className={
                      answers[i] === opt ? "option selected" : "option"
                    }
                    onClick={() => selectAnswer(i, opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {score === null ? (
            <button onClick={submitQuiz} className="submit">
              Submit Answers
            </button>
          ) : (
            <div className="score">
              🎉 You got {score}/{quiz.length} correct!
              <div className="score-buttons">
                <button onClick={resetAll}>New Topic</button>
                <button onClick={() => window.location.reload()}>
                  Hard Reset
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
