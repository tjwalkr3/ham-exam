import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../../layout-components/modal/Modal'
import styles from './StartQuizModal.module.css'
import { useSubsectionMasteries } from '../../../hooks/quizHooks'
import { useAiMessages } from '../../../hooks/aiHooks'
import type { LicenseClass, TopicSelectionMode } from '../../../context/settingsContext'
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
    enabled: false,
    queryKey: ['subsection', licenseClass, masteries ? JSON.stringify(masteries) : null],
  })

  useEffect(() => {
    if (!isOpen || !isAiMode) {
      setAiSelection(null)
    }
  }, [isOpen, isAiMode])

  const handleAiChoose = async () => {
    const result = await aiRecommendation.refetch()
    const selection = parseAiSelection(result.data?.toolCalls)
    if (selection) {
      const confirmed = window.confirm(
        `The AI wants to run the function "select_subsection_for_quiz" to select subsection ${selection.subsectionCode}. Do you want to proceed?`
      )
      if (confirmed) {
        setAiSelection(selection)
      }
    }
  }

  const aiError = aiRecommendation.error instanceof Error ? aiRecommendation.error.message : null
  const shouldShowAiLoading = isAiMode && aiRecommendation.isFetching

  const { recommendedSubsection, isAiRecommendation } = determineRecommendation({
    isAiMode,
    aiSelection,
    masteries,
    fallbackSubsection,
  })

  const renderLoading = (message: string) => (
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
      <p className="text-slate-600">{message}</p>
    </div>
  )

  const renderAiPrompt = () => (
    <div className={styles.modalContent}>
      {aiError && <p className={styles.aiError}>AI Error: {aiError}</p>}
      <p className={styles.promptText}>Use a large language model to choose which subsection you'll study.</p>
      <button onClick={handleAiChoose} className={styles.confirmButton}>
        Choose Subsection With AI
      </button>
    </div>
  )

  const renderRecommendation = () => {
    if (!recommendedSubsection) return <p>No subsections available.</p>

    const { achievedMastery, totalMastery, code, lastStudied } = recommendedSubsection
    const percentage = totalMastery ? Math.round((achievedMastery / totalMastery) * 100) : 0
    const masteryText = totalMastery 
      ? `${achievedMastery}/${totalMastery} points (${percentage}%)`
      : `${achievedMastery} points`

    return (
      <div className={styles.modalContent}>
        <p className={styles.recommendation}>
          We recommend studying subsection <strong>{code}</strong>
        </p>
        {isAiRecommendation && aiSelection?.reason && (
          <p className={styles.aiReason}>{aiSelection.reason}</p>
        )}
        <p className={lastStudied ? styles.masteryInfo : styles.masteryInfoLast}>Current mastery: {masteryText}</p>
        {lastStudied && (
          <p className={styles.lastStudied}>
            Last studied: {new Date(lastStudied).toLocaleDateString()}
          </p>
        )}
        <Link
          to={`/quiz/${code}`}
          className={styles.confirmButton}
          onClick={onClose}
        >
          Start Quiz
        </Link>
      </div>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Start Quiz">
      {isMasteriesLoading ? renderLoading("Finding the best subsection for you...") :
        shouldShowAiLoading ? renderLoading("Checking with the AI tutor...") :
        (isAiMode && !aiSelection) ? renderAiPrompt() :
        renderRecommendation()}
    </Modal>
  )
}

export default StartQuizModal
