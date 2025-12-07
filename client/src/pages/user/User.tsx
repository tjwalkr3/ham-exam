import { useState } from 'react'
import { useAuth } from "react-oidc-context";
import { Link } from 'react-router-dom'
import PleaseSignIn from '../../components/please-sign-in/PleaseSignIn'
import Header from '../../components/header/Header'
import InfoCard from '../../components/info-card/InfoCard'
import ExamCountdownCard from '../../components/exam-countdown-card/ExamCountdownCard'
import StartQuizModal from '../../components/start-quiz-modal/StartQuizModal'
import { useSettings } from '../../context/settingsContext'
import styles from './User.module.css'

function User() {
  const auth = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { licenseClass, topicSelectionMode } = useSettings();
  const token = auth.user?.access_token || '';

  const handleStartQuiz = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <Header />
      {auth.isAuthenticated ? (
        <>
          <div className={styles.cards}>
            <InfoCard title="Ready to Test Your Knowledge?">
              <p className={styles.cardText}>
                Take a practice quiz to assess your understanding of ham radio concepts.
                Our intelligent system will track your progress and highlight areas where
                you need more practice.
              </p>
              <button
                className={styles.cardButton}
                type="button"
                onClick={handleStartQuiz}
              >
                Start Quiz
              </button>
            </InfoCard>

            <InfoCard title="View Your Progress">
              <p className={styles.cardText}>
                View your personal progress report and decide if you're ready to take the test.
              </p>
              <Link className={styles.cardButton} to="/license-progress">
                View Progress
              </Link>
            </InfoCard>

            <InfoCard title="Time Until Exam">
              <ExamCountdownCard token={token} />
            </InfoCard>
          </div>

          <StartQuizModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            licenseClass={licenseClass}
            topicSelectionMode={topicSelectionMode}
            token={token}
          />
        </>
      ) : (
        <PleaseSignIn />
      )}
    </div>
  )
}

export default User
