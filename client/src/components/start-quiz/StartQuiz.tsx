import { useState } from 'react'
import { useAuth } from 'react-oidc-context'
import { Link } from 'react-router-dom'
import styles from './StartQuiz.module.css'
import Modal from '../modal/Modal'
import { useSubsectionMasteries } from '../../hooks/quizHooks'

function StartQuiz() {
  const auth = useAuth();
  const token = auth.user?.access_token || '';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: masteries, isLoading } = useSubsectionMasteries('T', token);

  const handleStartQuiz = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const recommendedSubsection = masteries?.[0];

  return (
    <>
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>Ready to Test Your Knowledge?</h1>
          <p className={styles.description}>
            Take a practice quiz to assess your understanding of ham radio concepts. 
            Our intelligent system will track your progress and identify areas where 
            you need more practice.
          </p>
          <button 
            className={styles.startButton}
            type="button"
            onClick={handleStartQuiz}
          >
            Start Quiz
          </button>
        </div>
      </main>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title="Start Quiz"
      >
        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Finding the best subsection for you...</p>
          </div>
        ) : recommendedSubsection ? (
          <div className={styles.modalContent}>
            <p className={styles.recommendation}>
              We recommend studying subsection <strong>{recommendedSubsection.code}</strong>
            </p>
            <p className={styles.masteryInfo}>
              Current mastery: {recommendedSubsection.totalMastery} points
            </p>
            {recommendedSubsection.lastStudied && (
              <p className={styles.lastStudied}>
                Last studied: {new Date(recommendedSubsection.lastStudied).toLocaleDateString()}
              </p>
            )}
            <Link 
              to={`/quiz/${recommendedSubsection.code}`}
              className={styles.confirmButton}
              onClick={handleCloseModal}
            >
              Start Quiz
            </Link>
          </div>
        ) : (
          <p>No subsections available.</p>
        )}
      </Modal>
    </>
  )
}

export default StartQuiz
