import { useEffect, useState } from 'react'
import { useAuth } from 'react-oidc-context'
import { Link } from 'react-router-dom'
import styles from './StartQuiz.module.css'
import Modal from '../modal/Modal'
import { useSubsectionMasteries } from '../../hooks/quizHooks'
import { useAiSubsectionRecommendation } from '../../hooks/aiHooks'
import { useSettings } from '../../context/settingsContext'
import type { SubsectionMastery } from '../../zod-types/subsectionMasteryModel'

type AiSelection = {
  subsectionCode: string
  reason?: string
  confidence?: number
}

function StartQuiz() {
  const auth = useAuth();
  const token = auth.user?.access_token || '';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { licenseClass, topicSelectionMode } = useSettings();
  const [aiSelection, setAiSelection] = useState<AiSelection | null>(null);
  const { data: masteries, isLoading: isMasteriesLoading } = useSubsectionMasteries(licenseClass, token);

  const isAiMode = topicSelectionMode === 'ai';

  const aiRecommendation = useAiSubsectionRecommendation({
    licenseClass,
    masteries,
    token,
    enabled: isModalOpen && isAiMode,
  });

  const handleStartQuiz = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!isModalOpen || !isAiMode) {
      setAiSelection(null);
    }
  }, [isModalOpen, isAiMode]);

  useEffect(() => {
    if (!isAiMode) {
      return;
    }
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
  }, [aiRecommendation.data, isAiMode]);

  const selectLowestMastery = (list?: SubsectionMastery[]) => {
    if (!list || list.length === 0) {
      return undefined;
    }
    return list.reduce<SubsectionMastery>((lowest, current) =>
      current.totalMastery < lowest.totalMastery ? current : lowest
    , list[0]);
  };

  const fallbackSubsection = selectLowestMastery(masteries);
  const aiRecommended = aiSelection
    ? masteries?.find((subsection) => subsection.code === aiSelection.subsectionCode)
    : undefined;
  const aiLoading = aiRecommendation.isPending || aiRecommendation.isFetching;
  const aiError = aiRecommendation.error instanceof Error ? aiRecommendation.error.message : null;
  const shouldShowAiLoading = isAiMode && aiLoading && !aiSelection && !aiError;

  let recommendedSubsection: SubsectionMastery | undefined;
  let isAiRecommendation = false;

  if (isAiMode) {
    if (aiRecommended) {
      recommendedSubsection = aiRecommended;
      isAiRecommendation = true;
    } else if (aiError) {
      recommendedSubsection = fallbackSubsection;
    }
  } else {
    recommendedSubsection = fallbackSubsection;
  }

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
        ) : shouldShowAiLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Checking with the AI tutor...</p>
          </div>
        ) : recommendedSubsection ? (
          <div className={styles.modalContent}>
            {isAiMode && aiError && (
              <p className={styles.aiError}>AI recommendation unavailable. Using fallback.</p>
            )}
            <p className={styles.recommendation}>
              We recommend studying subsection <strong>{recommendedSubsection.code}</strong>
            </p>
            {isAiRecommendation && aiSelection?.reason && (
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
