import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../modal/Modal'
import styles from './StartQuizModal.module.css'
import { useSubsectionMasteries } from '../../hooks/quizHooks'
import { useAiMessages } from '../../hooks/aiHooks'
import type { LicenseClass, TopicSelectionMode } from '../../context/settingsContext'
import { buildSubsectionMessages, determineRecommendation, parseAiSelection, selectLowestMastery, type AiSelection } from './startQuizModalUtils'

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
  const subsectionMessages = useMemo(
    () => buildSubsectionMessages(licenseClass, masteries),
    [licenseClass, masteries]
  )

  const aiRecommendation = useAiMessages({
    token,
    messages: subsectionMessages ?? undefined,
    enabled: Boolean(isOpen && isAiMode && subsectionMessages),
    queryKey: [
      'subsection',
      licenseClass,
      masteries ? JSON.stringify(masteries) : null,
    ],
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

  const masterySummary = useMemo(() => {
    if (!recommendedSubsection) {
      return null
    }
    if (!recommendedSubsection.totalMastery) {
      return `${recommendedSubsection.achievedMastery} points`
    }
    const percentage = Math.round((recommendedSubsection.achievedMastery / recommendedSubsection.totalMastery) * 100)
    return `${recommendedSubsection.achievedMastery}/${recommendedSubsection.totalMastery} points (${percentage}%)`
  }, [recommendedSubsection])

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
            Current mastery: {masterySummary}
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
