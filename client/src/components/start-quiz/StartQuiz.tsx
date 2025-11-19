import { useState } from 'react'
import { useAuth } from 'react-oidc-context'
import styles from './StartQuiz.module.css'
import { useSettings } from '../../context/settingsContext'
import StartQuizModal from './StartQuizModal'

function StartQuiz() {
  const auth = useAuth();
  const token = auth.user?.access_token || '';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { licenseClass, topicSelectionMode } = useSettings();

  const handleStartQuiz = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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

      <StartQuizModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        licenseClass={licenseClass}
        topicSelectionMode={topicSelectionMode}
        token={token}
      />
    </>
  )
}

export default StartQuiz
