import InfoCard from '../info-card/InfoCard'
import styles from './LicenseProgressCard.module.css'

interface LicenseProgressCardProps {
  licenseName: string
  earned: number
  total: number
  percentage: number
  outlookLabel: string
  outlookReason: string
  outlookColor: string
  isLoading: boolean
  error?: string | null
}

function LicenseProgressCard({
  licenseName,
  earned,
  total,
  percentage,
  outlookLabel,
  outlookReason,
  outlookColor,
  isLoading,
  error,
}: LicenseProgressCardProps) {
  const progressWidth = Math.min(Math.max(percentage, 0), 100)

  return (
    <InfoCard title={`${licenseName} Progress`}>
      {isLoading ? (
        <p className={styles.message}>Loading progress...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <div className={styles.content}>
          <div className={styles.row}>
            <span className={styles.points}>{earned}/{total} mastery points</span>
            <span className={styles.percent}>{percentage}%</span>
          </div>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressWidth}%` }}
            ></div>
          </div>
          <div>
            <p className={styles.outlookLabel}>
              Pass/Fail Outlook: <span style={{ color: outlookColor }}>{outlookLabel}</span>
            </p>
            <p className={styles.reason}>{outlookReason}</p>
          </div>
        </div>
      )}
    </InfoCard>
  )
}

export default LicenseProgressCard
