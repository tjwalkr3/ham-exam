import { useEffect, useState } from 'react'
import { useAuth } from 'react-oidc-context'
import { Link } from 'react-router-dom'
import styles from './StartQuiz.module.css'
import Modal from '../modal/Modal'
import { useSubsectionMasteries } from '../../hooks/quizHooks'
import { useAiSubsectionRecommendation } from '../../hooks/aiHooks'

type AiSelection = {
  subsectionCode: string
  reason?: string
  confidence?: number
}

const DEFAULT_LICENSE_CLASS = 'T'

function StartQuiz() {
  const auth = useAuth();
  const token = auth.user?.access_token || '';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiSelection, setAiSelection] = useState<AiSelection | null>(null);
  const { data: masteries, isLoading: isMasteriesLoading } = useSubsectionMasteries(DEFAULT_LICENSE_CLASS, token);

  const aiRecommendation = useAiSubsectionRecommendation({
    licenseClass: DEFAULT_LICENSE_CLASS,
    masteries,
    token,
    enabled: isModalOpen,
  });

  const handleStartQuiz = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!isModalOpen) {
      setAiSelection(null);
    }
  }, [isModalOpen]);

  useEffect(() => {
    const toolCalls = aiRecommendation.data?.toolCalls;
    if (!toolCalls) {
      return;
    }

    toolCalls.forEach((toolCall) => {
      if (toolCall.function.name !== 'select_subsection_for_quiz') {
        return;
      }

      try {
        const args = JSON.parse(toolCall.function.arguments) as Partial<AiSelection>;
        if (typeof args.subsectionCode === 'string') {
          setAiSelection({
            subsectionCode: args.subsectionCode,
            reason: typeof args.reason === 'string' ? args.reason : undefined,
            confidence: typeof args.confidence === 'number' ? args.confidence : undefined,
          });
        }
      } catch (error) {
        console.error('Failed to parse tool call arguments', error);
      }
    });
  }, [aiRecommendation.data]);

  const fallbackSubsection = masteries?.[0];
  const aiRecommended = aiSelection
    ? masteries?.find((subsection) => subsection.code === aiSelection.subsectionCode)
    : undefined;
  const recommendedSubsection = aiRecommended ?? fallbackSubsection;
  const aiLoading = aiRecommendation.isPending || aiRecommendation.isFetching;
  const aiError = aiRecommendation.error instanceof Error ? aiRecommendation.error.message : null;

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
        {isMasteriesLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Finding the best subsection for you...</p>
          </div>
        ) : recommendedSubsection ? (
          <div className={styles.modalContent}>
            {aiLoading && (
              <p className={styles.aiStatus}>Checking with the AI tutor...</p>
            )}
            {aiError && (
              <p className={styles.aiError}>AI recommendation unavailable. Using fallback.</p>
            )}
            <p className={styles.recommendation}>
              We recommend studying subsection <strong>{recommendedSubsection.code}</strong>
            </p>
            {aiSelection?.reason && (
              <p className={styles.aiReason}>{aiSelection.reason}</p>
            )}
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
