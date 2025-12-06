import { useLocation, useParams, Link } from 'react-router-dom'
import { useAuth } from 'react-oidc-context'
import Header from '../../components/header/Header'
import PleaseSignIn from '../../components/please-sign-in/PleaseSignIn'
import styles from './QuizResults.module.css'

interface QuizResultsState {
  correct: number;
  total: number;
}

function QuizResults() {
  const auth = useAuth();
  const location = useLocation();
  const { subsectionCode } = useParams<{ subsectionCode: string }>();
  const state = location.state as QuizResultsState;

  if (!auth.isAuthenticated) {
    return (
      <div className={styles.container}>
        <Header />
        <PleaseSignIn />
      </div>
    )
  }

  const { correct = 0, total = 0 } = state || {};
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>Section {subsectionCode} Quiz</h1>
        
        <div className={styles.resultsCard}>
          <div className={styles.percentageText}>{percentage}%</div>
          
          <div className={styles.progressBarContainer}>
            <div 
              className={styles.progressBar}
              style={{ width: `${percentage}%` }}
            />
          </div>
          
          <div className={styles.ratioText}>{correct}/{total}</div>
          
          <Link to="/user" className={styles.backButton}>
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}

export default QuizResults
