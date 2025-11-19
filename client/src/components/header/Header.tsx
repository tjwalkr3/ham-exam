import { Link } from 'react-router-dom'
import styles from './Header.module.css'
import SignInButton from '../sign-in-button/SignInButton'

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.logo}>
          Ham Exam
        </div>
        <nav className={styles.nav}>
          <Link to="/settings" className={styles.navLink}>
            Settings
          </Link>
        </nav>
      </div>
      <SignInButton />
    </header>
  )
}

export default Header
