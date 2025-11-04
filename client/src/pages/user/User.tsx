import { useAuth } from "react-oidc-context";
import StartQuiz from '../../components/start-quiz/StartQuiz'
import PleaseSignIn from '../../components/please-sign-in/PleaseSignIn'
import Header from '../../components/header/Header'
import styles from './User.module.css'

function User() {
  const auth = useAuth();

  return (
    <div className={styles.container}>
      <Header />
      {auth.isAuthenticated ? (
        <StartQuiz />
      ) : (
        <PleaseSignIn />
      )}
    </div>
  )
}

export default User
