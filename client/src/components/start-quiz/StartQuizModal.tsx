import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../modal/Modal'
import styles from './StartQuizModal.module.css'
import { useSubsectionMasteries } from '../../hooks/quizHooks'
import { useAiSubsectionRecommendation } from '../../hooks/aiHooks'
import type { LicenseClass, TopicSelectionMode } from '../../context/settingsContext'
import { determineRecommendation, parseAiSelection, selectLowestMastery, type AiSelection } from './startQuizModalUtils'

interface StartQuizModalProps {
  isOpen: boolean
  onClose: () => void
  licenseClass: LicenseClass
  topicSelectionMode: TopicSelectionMode
  token: string
}

function StartQuizModal({
  isOpen,
  onClose,
  licenseClass,
  topicSelectionMode,
  token,
}: StartQuizModalProps) {
  const { data: masteries, isLoading: isMasteriesLoading } = useSubsectionMasteries(licenseClass, token)
  const [aiSelection, setAiSelection] = useState<AiSelection | null>(null)

  const isAiMode = topicSelectionMode === 'ai'
  const fallbackSubsection = useMemo(() => selectLowestMastery(masteries), [masteries])

  const aiRecommendation = useAiSubsectionRecommendation({
    licenseClass,
    masteries,
    token,
    enabled: isOpen && isAiMode,
  })

  useEffect(() => {
    if (!isOpen || !isAiMode) {
      setAiSelection(null)
    }
  }, [isOpen, isAiMode])

  useEffect(() => {
    if (!isAiMode) {
      return
    }
    const selection = parseAiSelection(aiRecommendation.data?.toolCalls)
    if (selection) {
      setAiSelection(selection)
    }
  }, [aiRecommendation.data, isAiMode])

  const aiLoading = aiRecommendation.isPending || aiRecommendation.isFetching
  const aiError = aiRecommendation.error instanceof Error ? aiRecommendation.error.message : null
  const shouldShowAiLoading = isAiMode && aiLoading && !aiSelection && !aiError

  const { recommendedSubsection, isAiRecommendation } = determineRecommendation({
    isAiMode,
    aiSelection,
    masteries,
    fallbackSubsection,
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
            onClick={onClose}
          >
            Start Quiz
          </Link>
        </div>
      ) : (
        <p>No subsections available.</p>
      )}
    </Modal>
  )
}

export default StartQuizModal
