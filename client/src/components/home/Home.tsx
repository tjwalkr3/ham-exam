import Header from '../header/Header'
import styles from './Home.module.css'

function App() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <p>Hello, world!</p>
      </main>
    </div>
  )
}

export default App
