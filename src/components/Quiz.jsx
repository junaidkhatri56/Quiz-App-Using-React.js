import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Quiz() {
  const [questions, setQuestions] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAnswered, setIsAnswered] = useState(false); // Track if an answer is submitted

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    axios('https://the-trivia-api.com/v2/questions')
      .then((res) => {
        setQuestions(res.data);
        shuffleAnswers(res.data[0]);
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
    setShuffledAnswers(answers);
  };

  const handleAnswerSelection = (answer) => {
    if (isAnswered) return; // Prevent further changes if already answered
    setSelectedAnswer(answer);
    setErrorMessage('');
  };

  const nextQuestion = () => {
    if (!selectedAnswer) {
      setErrorMessage('Please select an answer to proceed.');
      return;
    }

    if (selectedAnswer === questions[currentIndex].correctAnswer) {
      setScore(score + 10);
    }

    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      shuffleAnswers(questions[nextIndex]);
      setSelectedAnswer(null);
      setIsAnswered(false); // Reset answer state for next question
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setQuizFinished(false);
    setIsAnswered(false); // Reset isAnswered to show "Submit" button on first question
    setSelectedAnswer(null); // Reset selectedAnswer to clear any selection
    fetchQuestions(); // Refetch questions for a new quiz
  };

  return (
    <>
      {questions ? (
        <div className="flex items-center justify-center w-screen h-screen bg-gradient-to-br from-gray-100 to-gray-300 text-gray-900">
          {!quizFinished ? (
            <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8 text-center space-y-6 transform transition-all duration-500 hover:scale-105">
              <h1 className="text-3xl font-bold text-blue-600 mb-4">Question {currentIndex + 1}</h1>
              <p className="text-xl text-gray-800 font-medium">{questions[currentIndex].question.text}</p>
              
              {/* Displaying the answers */}
              <div className="grid grid-cols-1 gap-4 mt-4">
                {shuffledAnswers.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleAnswerSelection(item)}
                    className={`flex items-center p-3 rounded-lg shadow-sm cursor-pointer transition-all duration-300 ${
                      isAnswered
                        ? item === questions[currentIndex].correctAnswer
                          ? 'bg-green-100 border-green-600'
                          : item === selectedAnswer
                          ? 'bg-red-100 border-red-600'
                          : 'bg-gray-100'
                        : 'bg-gray-100 hover:bg-blue-50'
                    }`}
                  >
                    <input
                      type="radio"
                      value={item}
                      name="answer"
                      id={`option${index}`}
                      onChange={() => handleAnswerSelection(item)}
                      checked={selectedAnswer === item}
                      className="form-radio h-5 w-5 text-blue-600"
                      disabled={isAnswered} // Disable input after answering
                    />
                    <label htmlFor={`option${index}`} className="ml-3 text-lg font-medium">
                      {item}
                    </label>
                  </div>
                ))}
              </div>

              {/* Error message */}
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}

              {/* Container for Next Button and Score */}
              <div className="flex justify-between items-center mt-8">
                <h2 className="text-xl font-bold text-gray-700">Score: {score}</h2>
                <button
                  onClick={() => {
                    if (!isAnswered) {
                      setIsAnswered(true); // Lock the answer on submit
                    } else {
                      nextQuestion(); // Move to next question if already answered
                    }
                  }}
                  className="bg-blue-600 text-white py-2 px-6 rounded-full shadow-md hover:bg-blue-700 transition duration-300"
                >
                  {isAnswered ? 'Next' : 'Submit'}
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 text-center space-y-6">
              <h1 className="text-4xl font-bold text-purple-600">Quiz Finished!</h1>
              <h2 className="text-2xl font-medium text-gray-800">Your Final Score: {score}</h2>
              <button
                onClick={restartQuiz}
                className="bg-purple-600 text-white py-2 px-8 rounded-full shadow-md hover:bg-purple-700 transition duration-300"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      ) : (
        <h1 className="text-3xl font-bold text-gray-700 flex items-center justify-center h-screen">Loading...</h1>
      )}
    </>
  );
}

export default Quiz;
