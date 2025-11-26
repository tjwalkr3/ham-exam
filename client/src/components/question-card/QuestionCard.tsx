import { useState } from 'react'
import { useAuth } from 'react-oidc-context'
import styles from './QuestionCard.module.css'
import type { Question } from '../../zod-types/questionModel'
import { Spinner } from '../spinner/Spinner'
import { getAiExplanation } from './questionCardUtils'

interface QuestionCardProps {
  question: Question;
  onSubmit: (questionId: string, correct: boolean) => void;
}

function QuestionCard({ question, onSubmit }: QuestionCardProps) {
  const auth = useAuth();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  const handleAnswerSelect = (index: number) => {
    if (!isSubmitted) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmit = async () => {
    if (selectedAnswer !== null) {
      const correct = selectedAnswer === question.correct;
      setIsCorrect(correct);
      setIsSubmitted(true);
      onSubmit(question.id, correct);

      const token = auth.user?.access_token;
      if (token) {
        setIsLoadingExplanation(true);
        try {
          const explanation = await getAiExplanation(token, question, selectedAnswer);
          if (explanation) {
            setExplanation(explanation);
          }
        } catch (error) {
          console.error("Failed to get AI explanation", error);
        } finally {
          setIsLoadingExplanation(false);
        }
      }
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

      {isLoadingExplanation && (
        <div className={styles.explanationContainer}>
           <Spinner />
        </div>
      )}

      {explanation && (
        <div className={styles.explanationContainer}>
          <p className={styles.explanationText}>{explanation}</p>
        </div>
      )}
    </div>
  )
}

export default QuestionCard
