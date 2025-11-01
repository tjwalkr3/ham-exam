import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/home/Home.tsx'
import { AuthProvider, type AuthProviderProps } from "react-oidc-context";

const stripSigninParameters = () => {
  const url = new URL(window.location.href);
  url.searchParams.delete('state');
  url.searchParams.delete('session_state');
  url.searchParams.delete('iss');
  url.searchParams.delete('code');
  window.history.replaceState({}, '', url.toString());
}

const oidcConfig : AuthProviderProps = {
  authority: "https://auth-dev.snowse.io/realms/DevRealm",
  client_id: "ham-exam",
  redirect_uri: window.location.origin,
  post_logout_redirect_uri: window.location.origin,
  onSigninCallback: stripSigninParameters,
  onSignoutCallback: () => {
    console.log("User signed out");
  },
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider {...oidcConfig}>
      <App /> 
    </AuthProvider>
  </StrictMode>,
)
