import { useAuth } from "react-oidc-context";
import StartQuiz from '../../components/start-quiz/StartQuiz'
import PleaseSignIn from '../../components/please-sign-in/PleaseSignIn'

function User() {
  const auth = useAuth();

  if (auth.isAuthenticated) {
    return <StartQuiz />
  }

  return <PleaseSignIn />
}

export default User
