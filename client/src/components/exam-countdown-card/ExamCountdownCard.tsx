import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useAiMessages } from '../../hooks/aiHooks'
import { useSettings } from '../../context/settingsContext'
import {
  buildCountdownMessages,
  getCountdownStatus,
  parseCountdownTargetTime,
  toLocalDateTimeInputValue,
} from './examCounterCardUtils'
import styles from './ExamCountdownCard.module.css'

interface ExamCountdownCardProps {
  token: string
}

function ExamCountdownCard({ token }: ExamCountdownCardProps) {
  const { examDate, setExamDate } = useSettings()
  const [targetValue, setTargetValue] = useState('')
  const [displayValue, setDisplayValue] = useState<string | null>(null)
  const messages = buildCountdownMessages(targetValue)

  const aiQuery = useAiMessages({
    token,
    messages,
    enabled: false,
    queryKey: ['exam-countdown', targetValue],
  })

  useEffect(() => {
    if (!examDate) {
      setTargetValue('')
      setDisplayValue(null)
      return
    }

    const targetTime = new Date(examDate).getTime()
    const localIso = toLocalDateTimeInputValue(examDate)
    setTargetValue((prev) => (prev === localIso ? prev : localIso))

    if (Number.isNaN(targetTime)) {
      setDisplayValue(null)
      return
    }

    const updateCountdown = () => {
      const { display, expired } = getCountdownStatus(targetTime)
      setDisplayValue(display)
      if (expired) setExamDate(null)
    }

    updateCountdown()
    const intervalId = window.setInterval(updateCountdown, 1000)
    return () => window.clearInterval(intervalId)
  }, [examDate, setExamDate])

  const handleStart = async () => {
    if (!targetValue || !token || aiQuery.isFetching) return

    const result = await aiQuery.refetch()
    const { iso, parsed } = parseCountdownTargetTime(result.data?.toolCalls)

    if (!iso || parsed === null || parsed <= Date.now()) {
      toast.error('please enter a valid date in the future')
      return
    }

    setExamDate(iso)
    setTargetValue(toLocalDateTimeInputValue(iso))
  }

  return (
    <div className={styles.container}>
      {displayValue ? (
        <div className={styles.countdown}>{displayValue}</div>
      ) : (
        <div className={styles.placeholder}>Set a date to start the countdown.</div>
      )}

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
    </div>
  )
}

export default ExamCountdownCard
