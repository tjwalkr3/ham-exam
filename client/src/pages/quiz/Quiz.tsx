import { useState } from 'react'
import { useAuth } from 'react-oidc-context'
import { useParams } from 'react-router-dom'
import Header from '../../components/header/Header'
import Carousel from '../../components/carousel/Carousel'
import QuestionCard from '../../components/question-card/QuestionCard'
import styles from './Quiz.module.css'
import { useQuizQuestions, useSubmitAnswer } from '../../hooks/quizHooks'

function Quiz() {
  const auth = useAuth();
  const { subsectionCode } = useParams<{ subsectionCode: string }>();
  const token = auth.user?.access_token || '';
  const { data: questions, isLoading, error } = useQuizQuestions(subsectionCode || '', token);
  const submitAnswer = useSubmitAnswer(token);
  const [submittedQuestions, setSubmittedQuestions] = useState<Set<number>>(new Set());

  const handleQuestionSubmit = (index: number, questionId: string, correct: boolean) => {
    setSubmittedQuestions(prev => new Set(prev).add(index));
    submitAnswer.mutate({ questionId, correct });
  };

  const isNextEnabled = (index: number) => {
    return submittedQuestions.has(index);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <p>Loading questions...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <p>Error loading questions: {error.message}</p>
        </main>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <p>No questions available.</p>
        </main>
      </div>
    );
  }

  const questionCards = questions.map((question, index) => (
    <QuestionCard 
      key={question.id}
      question={question}
      onSubmit={(questionId, correct) => handleQuestionSubmit(index, questionId, correct)}
    />
  ));

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <Carousel items={questionCards} onNextEnabled={isNextEnabled} />
      </main>
    </div>
  )
}

export default Quiz
