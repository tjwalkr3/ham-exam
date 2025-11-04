import styles from './PleaseSignIn.module.css'

function PleaseSignIn() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <h1 className={styles.title}>Please Sign In</h1>
        <p className={styles.description}>
          Please click the "Sign In" button in the upper right corner of the page.
        </p>
      </div>
    </main>
  )
}

export default PleaseSignIn
