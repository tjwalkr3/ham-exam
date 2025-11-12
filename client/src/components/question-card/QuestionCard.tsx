import { useState } from 'react'
import styles from './QuestionCard.module.css'
import type { Question } from '../../zod-types/questionModel'

interface QuestionCardProps {
  question: Question;
  onSubmit: () => void;
}

function QuestionCard({ question, onSubmit }: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleAnswerSelect = (index: number) => {
    if (!isSubmitted) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      const correct = selectedAnswer === question.correct;
      setIsCorrect(correct);
      setIsSubmitted(true);
      onSubmit();
    }
  };

  const getAnswerClassName = (index: number) => {
    let className = styles.answer;
    
    if (selectedAnswer === index) {
      className += ` ${styles.selected}`;
    }
    
    if (isSubmitted) {
      if (index === question.correct) {
        className += ` ${styles.correct}`;
      } else if (index === selectedAnswer && !isCorrect) {
        className += ` ${styles.incorrect}`;
      }
    }
    
    return className;
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.question}>{question.question}</h2>
      
      <div className={styles.answers}>
        {question.answers.map((answer, index) => (
          <button
            key={index}
            className={getAnswerClassName(index)}
            onClick={() => handleAnswerSelect(index)}
            type="button"
            disabled={isSubmitted}
          >
            <span className={styles.answerLabel}>{String.fromCharCode(65 + index)}.</span>
            <span className={styles.answerText}>{answer}</span>
          </button>
        ))}
      </div>

      {!isSubmitted && (
        <div className={styles.submitContainer}>
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            type="button"
            disabled={selectedAnswer === null}
          >
            Submit Answer
          </button>
        </div>
      )}

      {isSubmitted && (
        <div className={`${styles.feedback} ${isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect}`}>
          {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
          <span className={styles.reference}>Reference: {question.refs}</span>
        </div>
      )}
    </div>
  )
}

export default QuestionCard
