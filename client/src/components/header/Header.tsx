import styles from './Header.module.css'
import SignInButton from '../sign-in-button/SignInButton'

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        Ham Exam
      </div>
      <SignInButton />
    </header>
  )
}

export default Header
