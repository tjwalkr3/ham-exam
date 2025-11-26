import { useCallback, useState } from 'react'
import { useAuth } from 'react-oidc-context'
import Header from '../../components/header/Header'
import PleaseSignIn from '../../components/please-sign-in/PleaseSignIn'
import styles from './LicenseProgress.module.css'
import type { LicenseClass } from '../../context/settingsContext'
import LicenseProgressCard from '../../components/license-progress-card/LicenseProgressCard'
import { LICENSE_DETAILS } from './licenseProgressUtils'
import { useLicenseProgressData } from './useLicenseProgressData'

interface OutlookState {
  label: string
  colorHex: string
  reason: string
}

function createInitialOutlook(): OutlookState {
  return {
    label: 'Pending',
    colorHex: '#475569',
    reason: 'Awaiting AI evaluation.',
  }
}

function LicenseProgress() {
  const auth = useAuth()
  const token = auth.user?.access_token || ''
  const isAuthenticated = auth.isAuthenticated

  const [outlooks, setOutlooks] = useState<Record<LicenseClass, OutlookState>>(() => ({
    T: createInitialOutlook(),
    G: createInitialOutlook(),
    E: createInitialOutlook(),
  }))

  const setOutlook = useCallback((licenseClass: LicenseClass, outlook: string, colorHex: string, reason: string) => {
    setOutlooks((prev) => ({
      ...prev,
      [licenseClass]: { label: outlook, colorHex, reason },
    }))
  }, [setOutlooks])

  const { cards } = useLicenseProgressData({ token, isAuthenticated, setOutlook })

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <Header />
        <PleaseSignIn />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div>
          <h1 className={styles.title}>License Progress</h1>
          <p className={styles.subtitle}>Track your mastery and outlook before scheduling the real exam.</p>
        </div>
        <div className={styles.grid}>
          {cards.map(({ license, query, summary }) => (
            <LicenseProgressCard
              key={license}
              licenseName={LICENSE_DETAILS[license].name}
              earned={summary.earned}
              total={summary.total}
              percentage={summary.percentage}
              outlookLabel={outlooks[license].label}
              outlookReason={outlooks[license].reason}
              outlookColor={outlooks[license].colorHex}
              isLoading={query.isLoading}
              error={query.error instanceof Error ? query.error.message : null}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

export default LicenseProgress
