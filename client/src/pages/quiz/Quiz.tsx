import Header from '../../components/header/Header'
import Question from '../../components/question/Question'
import styles from './Quiz.module.css'

function Quiz() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <Question />
      </main>
    </div>
  )
}

export default Quiz
