import { useState } from 'react'
import { useAuth } from 'react-oidc-context'
import Header from '../../components/header/Header'
import Carousel from '../../components/carousel/Carousel'
import QuestionCard from '../../components/question-card/QuestionCard'
import styles from './Quiz.module.css'
import { useQuizQuestions } from '../../hooks/quizHooks'

function Quiz() {
  const auth = useAuth();
  const username = auth.user?.profile.preferred_username || '';
  const { data: questions, isLoading, error } = useQuizQuestions('T', username);
  const [submittedQuestions, setSubmittedQuestions] = useState<Set<number>>(new Set());

  const handleQuestionSubmit = (index: number) => {
    setSubmittedQuestions(prev => new Set(prev).add(index));
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
      onSubmit={() => handleQuestionSubmit(index)}
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
