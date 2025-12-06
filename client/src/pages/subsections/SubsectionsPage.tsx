import { useAuth } from 'react-oidc-context'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/header/Header'
import PleaseSignIn from '../../components/please-sign-in/PleaseSignIn'
import { useSettings } from '../../context/settingsContext'
import { useSubsectionMasteries } from '../../hooks/quizHooks'
import styles from './SubsectionsPage.module.css'

function SubsectionsPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const { licenseClass } = useSettings()
  const token = auth.user?.access_token || ''

  const { data: masteries, isLoading } = useSubsectionMasteries(licenseClass, token)

  const handleCardClick = (code: string) => {
    navigate(`/quiz/${code}`)
  }

  if (!auth.isAuthenticated) {
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
        <h1 className={styles.title}>Subsection Mastery</h1>
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className={styles.list}>
            {masteries?.map((subsection) => {
              const percentage = subsection.totalMastery > 0 
                ? Math.round((subsection.achievedMastery / subsection.totalMastery) * 100) 
                : 0

              return (
                <div 
                  key={subsection.code} 
                  className={styles.card}
                  onClick={() => handleCardClick(subsection.code)}
                  role="button"
                  tabIndex={0}
                >
                  <div className={styles.cardContent}>
                    <span className={styles.subsectionName}>
                      Subsection {subsection.code}
                    </span>
                    
                    <div className={styles.progressContainer}>
                      <span className={styles.percentage}>
                        {percentage}%
                      </span>
                      <div className={styles.progressBarBackground}>
                        <div 
                          className={styles.progressBarFill}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default SubsectionsPage
