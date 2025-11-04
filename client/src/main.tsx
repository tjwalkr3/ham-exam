import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/home/Home.tsx'
import User from './pages/user/User.tsx'
import { AuthProvider, type AuthProviderProps } from "react-oidc-context";
import { BrowserRouter, Routes, Route } from 'react-router-dom'

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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
