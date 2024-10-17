import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Quiz() {
  const [questions, setQuestions] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [score, setScore] = useState(0); // Track the score
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Track the user's selected answer
  const [quizFinished, setQuizFinished] = useState(false); // Track if the quiz has finished

  useEffect(() => {
    fetchQuestions(); // Fetch questions when the component mounts
  }, []);

  const fetchQuestions = () => {
    axios('https://the-trivia-api.com/v2/questions')
      .then((res) => {
        setQuestions(res.data);
        shuffleAnswers(res.data[0]); // Shuffle the answers for the first question
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const shuffleAnswers = (question) => {
    const answers = [...question.incorrectAnswers, question.correctAnswer];
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }
    setShuffledAnswers(answers); // Store shuffled answers
  };

  const handleAnswerSelection = (e) => {
    setSelectedAnswer(e.target.value); // Set the selected answer
  };

  const nextQuestion = () => {
    // Check if the selected answer is correct
    if (selectedAnswer === questions[currentIndex].correctAnswer) {
      setScore(score + 10); // Increase score by 10 if the answer is correct
    }

    // Move to the next question
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      shuffleAnswers(questions[nextIndex]); // Shuffle answers for the next question
      setSelectedAnswer(null); // Reset selected answer
    } else {
      setQuizFinished(true); // Mark the quiz as finished
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0); // Reset to the first question
    setScore(0); // Reset score
    setQuizFinished(false); // Mark quiz as not finished
    fetchQuestions(); // Refetch questions for a new quiz
  };

  return (
    <>
      {questions ? (
        <div>
          {!quizFinished ? (
            <>
              <h1>Q{currentIndex + 1}: {questions[currentIndex].question.text}</h1>
              {shuffledAnswers.map((item, index) => (
                <div key={`option${index}`}>
                  <input
                    type="radio"
                    value={item}
                    name="answer"
                    id={`option${index}`}
                    onChange={handleAnswerSelection}
                    checked={selectedAnswer === item} // Track selected answer
                  />
                  <label htmlFor={`option${index}`}>{item}</label>
                </div>
              ))}
              <button onClick={nextQuestion}>Next</button>
              <h2>Score: {score}</h2> {/* Display current score */}
            </>
          ) : (
            <div>
              <h1>Quiz Finished!</h1>
              <h2>Your Final Score: {score}</h2> {/* Display final score */}
              <button onClick={restartQuiz}>Try Again</button> {/* Button to restart the quiz */}
            </div>
          )}
        </div>
      ) : (
        <h1>Loading...</h1>
      )}
    </>
  );
}

export default Quiz;
