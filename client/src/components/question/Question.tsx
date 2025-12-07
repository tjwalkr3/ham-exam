import { useState } from 'react'
import styles from './Question.module.css'
import type { Questions } from '../../zod-types/questionModel'
import Radio from '../radio/Radio'

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
      <Radio
        question={currentQuestion.question}
        answers={currentQuestion.answers}
        figure={currentQuestion.figure}
        selectedAnswer={selectedAnswer}
        onChange={handleAnswerSelect}
      />

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
