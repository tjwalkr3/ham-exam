import styles from './SignInButton.module.css'
import { useAuth } from "react-oidc-context";

function SignInButton() {
  const auth = useAuth();

  if (auth.isAuthenticated && auth.user?.profile?.email) {
    console.log(auth.user.profile.email);
  }

  const handleClick = () => {
    if (auth.isLoading || auth.activeNavigator) {
      return;
    }

    const redirectUri = window.location.origin + window.location.pathname;

    if (auth.isAuthenticated) {
      void auth.signoutRedirect({ post_logout_redirect_uri: redirectUri });
    } else {
      void auth.signinRedirect({ redirect_uri: redirectUri });
    }
  };

  let label = "Sign In";

  if (auth.isLoading) {
    label = "Loading...";
  } else if (auth.error) {
    label = "Retry Sign In";
  } else if (auth.isAuthenticated) {
    const username = auth.user?.profile?.preferred_username 
      || auth.user?.profile?.email 
      || auth.user?.profile?.name 
      || "User";
    label = `Logout, ${username}`;
  }

  const isDisabled = auth.isLoading || Boolean(auth.activeNavigator);

  return (
    <button 
      className={styles.signInButton}
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
    >
      {label}
    </button>
  )
}

export default SignInButton
