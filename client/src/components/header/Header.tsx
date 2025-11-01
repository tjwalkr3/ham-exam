import styles from './Header.module.css'

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        Ham Exam
      </div>
      <button className={styles.signInButton}>
        Sign In
      </button>
    </header>
  )
}

export default Header
