import { useState } from 'react'
import styles from './Question.module.css'
import type { Questions } from '../../zod-types/question'

interface QuestionProps {
  questions: Questions;
}

function Question({ questions }: QuestionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer(null);
    }
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.question}>{currentQuestion.question}</h2>
      
      <div className={styles.answers}>
        {currentQuestion.answers.map((answer, index) => (
          <button
            key={index}
            className={`${styles.answer} ${selectedAnswer === index ? styles.selected : ''}`}
            onClick={() => handleAnswerSelect(index)}
            type="button"
          >
            <span className={styles.answerLabel}>{String.fromCharCode(65 + index)}.</span>
            <span className={styles.answerText}>{answer}</span>
          </button>
        ))}
      </div>

      <div className={styles.navigation}>
        <button 
          className={styles.navButton}
          onClick={handleBack}
          type="button"
          disabled={currentIndex === 0}
        >
          Back
        </button>
        <button 
          className={styles.navButton}
          onClick={handleNext}
          type="button"
          disabled={currentIndex === questions.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Question
