import Header from '../header/Header'
import styles from './StartQuiz.module.css'

function StartQuiz() {
  const handleStartQuiz = () => {
    // TODO: Implement quiz start logic
    console.log('Starting quiz...');
  };

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>Ready to Test Your Knowledge?</h1>
          <p className={styles.description}>
            Take a practice quiz to assess your understanding of ham radio concepts. 
            Our intelligent system will track your progress and identify areas where 
            you need more practice.
          </p>
          <button 
            className={styles.startButton}
            type="button"
            onClick={handleStartQuiz}
          >
            Start Quiz
          </button>
        </div>
      </main>
    </div>
  )
}

export default StartQuiz
