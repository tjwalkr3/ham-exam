import { useEffect, useMemo, useRef, useState } from 'react'
import type { MessageArray } from '../../zod-types/messageModel'
import { useAiMessages } from '../../hooks/aiHooks'
import { useSettings } from '../../context/settingsContext'
import styles from './ExamCountdownCard.module.css'

interface ExamCountdownCardProps {
  token: string
}

const pad = (value: number) => String(value).padStart(2, '0')

const formatDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return `${pad(days)}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`
}

function ExamCountdownCard({ token }: ExamCountdownCardProps) {
  const { examDate, setExamDate } = useSettings()
  const [targetValue, setTargetValue] = useState('')
  const [displayValue, setDisplayValue] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const lastSyncedExamDate = useRef<string | null>(null)

  const targetTime = useMemo(() => (examDate ? new Date(examDate).getTime() : null), [examDate])

  const messages: MessageArray = useMemo(
    () =>
      targetValue
        ? [
            {
              role: 'system' as const,
              content:
                [
                  'You are a precise function-calling agent for a ham exam app.',
                  "Always respond with exactly one tool call to 'start_exam_countdown'.",
                  'Never return prose, markdown, JSON, or explanations.',
                  'Parse the user-provided datetime and pass it as ISO 8601 with timezone (e.g., 2025-02-03T09:00:00Z) under the argument name `targetTime`.',
                  'If the input is ambiguous or invalid, still call the tool with a best-effort ISO guess; do not write text responses.',
                ].join(' '),
            },
            {
              role: 'user' as const,
              content: `Start a countdown for ${targetValue}`,
            },
          ]
        : [],
    [targetValue],
  )

  const aiQuery = useAiMessages({
    token,
    messages,
    enabled: false,
    queryKey: ['exam-countdown', targetValue],
  })

  useEffect(() => {
    if (!examDate) return
    if (examDate === lastSyncedExamDate.current) return

    const date = new Date(examDate)
    const localIso = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)

    lastSyncedExamDate.current = examDate
    setTargetValue(localIso)
  }, [examDate])

  useEffect(() => {
    if (!targetTime) return

    const updateCountdown = () => {
      const remaining = targetTime - Date.now()
      if (remaining <= 0) {
        setDisplayValue('00d 00h 00m 00s')
        setExamDate(null)
        return
      }
      setDisplayValue(formatDuration(remaining))
    }

    updateCountdown()
    const intervalId = window.setInterval(updateCountdown, 1000)
    return () => window.clearInterval(intervalId)
  }, [targetTime, setExamDate])

  const handleStart = async () => {
    if (!targetValue || !token || aiQuery.isFetching) return
    setError(null)

    try {
      const result = await aiQuery.refetch()
      // Debug logging to inspect AI response
      console.debug('exam-countdown ai result', result.data)

      const toolCall = result.data?.toolCalls?.find((call) => call.function.name === 'start_exam_countdown')

      if (!toolCall) {
        setError('No countdown returned by AI')
        return
      }

      const args = JSON.parse(toolCall.function.arguments) as { targetTime?: string }
      console.debug('exam-countdown toolCall args', args)
      const iso = args?.targetTime
      const parsed = iso ? new Date(iso).getTime() : NaN

      if (!iso || Number.isNaN(parsed)) {
        setError('Countdown arguments missing or invalid')
        return
      }

      if (parsed <= Date.now()) {
        setError('Countdown time must be in the future')
        return
      }

      if (iso !== examDate) {
        lastSyncedExamDate.current = iso
        setExamDate(iso)
      }
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div className={styles.container}>
      <label className={styles.label}>
        Select date and time
        <input
          className={styles.input}
          type="datetime-local"
          value={targetValue}
          onChange={(event) => setTargetValue(event.target.value)}
        />
      </label>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.button}
          onClick={handleStart}
          disabled={!targetValue || !token || aiQuery.isFetching}
        >
          {aiQuery.isFetching ? 'Contacting AI...' : 'Set Countdown'}
        </button>
      </div>

      {displayValue ? (
        <div className={styles.countdown}>{displayValue}</div>
      ) : (
        <div className={styles.placeholder}>Set a date to start the countdown.</div>
      )}

      {error || aiQuery.error ? (
        <div className={styles.placeholder}>{error || (aiQuery.error as Error)?.message}</div>
      ) : null}
    </div>
  )
}

export default ExamCountdownCard
