import { Link } from 'react-router-dom'
import styles from './Header.module.css'
import SignInButton from '../sign-in-button/SignInButton'

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link to="/" className={styles.logo}>
          Ham Exam
        </Link>
        <nav className={styles.nav}>
          <Link to="/resources" className={styles.navLink}>
            Resources
          </Link>
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
