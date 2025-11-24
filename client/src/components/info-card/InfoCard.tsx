import type { ReactNode } from 'react'
import styles from './InfoCard.module.css'

interface InfoCardProps {
  title?: string
  children: ReactNode
}

function InfoCard({ title, children }: InfoCardProps) {
  return (
    <section className={styles.card}>
      {title ? <h2 className={styles.title}>{title}</h2> : null}
      <div className={styles.body}>{children}</div>
    </section>
  )
}

export default InfoCard
