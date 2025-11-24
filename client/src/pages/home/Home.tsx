import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'react-oidc-context'
import Header from '../../components/header/Header'
import InfoCard from '../../components/info-card/InfoCard'
import styles from './Home.module.css'

function Home() {
  const auth = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!auth.isLoading && auth.isAuthenticated) {
      navigate('/user', { replace: true })
    }
  }, [auth.isLoading, auth.isAuthenticated, navigate])

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Ham Radio Study Buddy</h1>
          <p className={styles.subtitle}>Your intelligent companion for amateur radio license exam preparation</p>
        </div>

        <div className={styles.grid}>
          <InfoCard title="Personalized Learning">
            <p className={styles.paragraph}>
              Ham Radio Study Buddy is an intelligent AI agent that helps aspiring amateur radio operators 
              study for their license exams, including Technician, General, and Extra class certifications. 
              The agent analyzes your performance and identifies weak areas to create a truly personalized 
              learning experience.
            </p>
          </InfoCard>

          <InfoCard title="Smart Question Selection">
            <p className={styles.paragraph}>
              Using embeddings-based similarity search, our AI finds related questions to reinforce concepts 
              you're struggling with. This targeted practice approach helps you build a deeper understanding 
              of ham radio principles and regulations.
            </p>
          </InfoCard>

          <InfoCard title="Adaptive Progress Tracking">
            <p className={styles.paragraph}>
              Get detailed progress reports with actionable recommendations tailored to your learning journey. 
              The system adapts difficulty based on your performance, ensuring you're always challenged at 
              the right level to maximize retention and exam readiness.
            </p>
          </InfoCard>
        </div>
      </main>
    </div>
  )
}

export default Home
