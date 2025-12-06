import { Link } from 'react-router-dom'
import { useState } from 'react'
import styles from './Header.module.css'
import SignInButton from '../sign-in-button/SignInButton'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button
          className={styles.hamburger}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>
        <Link to="/" className={styles.logo}>
          Ham Exam
        </Link>
      </div>
      
      <SignInButton />

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className={styles.overlay} onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Side Menu */}
      <nav className={`${styles.sideMenu} ${isMenuOpen ? styles.open : ''}`}>
        <Link
          to="/subsections"
          className={styles.navLink}
          onClick={() => setIsMenuOpen(false)}
        >
          Subsections
        </Link>
        <Link
          to="/resources"
          className={styles.navLink}
          onClick={() => setIsMenuOpen(false)}
        >
          Resources
        </Link>
        <Link
          to="/settings"
          className={styles.navLink}
          onClick={() => setIsMenuOpen(false)}
        >
          Settings
        </Link>
        <Link
          to="/ai-tool-calls"
          className={styles.navLink}
          onClick={() => setIsMenuOpen(false)}
        >
          AI Tool Calls
        </Link>
      </nav>
    </header>
  )
}

export default Header
