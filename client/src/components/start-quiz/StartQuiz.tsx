import { useState } from 'react'
import styles from './StartQuiz.module.css'

function StartQuiz() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.closeButton}
              onClick={handleCloseModal}
              type="button"
              aria-label="Close modal"
            >
              ×
            </button>
            <h2 className={styles.modalTitle}>Quiz Settings</h2>
            <p className={styles.modalText}>
              Quiz configuration options will appear here.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default StartQuiz
