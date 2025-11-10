import { useAuth } from 'react-oidc-context'
import Header from '../../components/header/Header'
import Question from '../../components/question/Question'
import styles from './Quiz.module.css'
import { useQuizQuestions } from '../../hooks/quizHooks'

function Quiz() {
  const auth = useAuth();
  const username = auth.user?.profile.preferred_username || '';
  const { data: questions, isLoading, error } = useQuizQuestions('T', username);

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

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <Question questions={questions} />
      </main>
    </div>
  )
}

export default Quiz
