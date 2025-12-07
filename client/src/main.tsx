import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/home/Home.tsx'
import User from './pages/user/User.tsx'
import Quiz from './pages/quiz/Quiz.tsx'
import QuizResults from './pages/quiz-results/QuizResults.tsx'
import LicenseProgress from './pages/license-progress/LicenseProgress.tsx'
import { AuthProvider, type AuthProviderProps } from "react-oidc-context";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SettingsProvider } from './context/SettingsProvider.tsx'
import Settings from './pages/settings/Settings.tsx'
import SubsectionsPage from './pages/subsections/SubsectionsPage.tsx'
import Resources from './pages/resources/Resources.tsx'
import AIToolCallLogs from './pages/ai-tool-call-logs/AIToolCallLogs.tsx'
import { ErrorBoundary } from 'react-error-boundary'
import AppToaster from './components/app-toaster/AppToaster.tsx'
import { handleQueryError } from './utils/queryErrorHandler.ts'
import { toast } from 'react-hot-toast'

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleQueryError,
  }),
  mutationCache: new MutationCache({
    onError: handleQueryError,
  }),
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

const stripSigninParameters = () => {
  const url = new URL(window.location.href);
  url.searchParams.delete('state');
  url.searchParams.delete('session_state');
  url.searchParams.delete('iss');
  url.searchParams.delete('code');
  window.history.replaceState({}, '', url.toString());
}

const oidcConfig : AuthProviderProps = {
  authority: import.meta.env.VITE_KEYCLOAK_AUTHORITY || "http://localhost:8080/realms/AppRealm",
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
    <ErrorBoundary
      onError={(error) => toast.error(error.message || 'Something went wrong')}
      fallbackRender={({ resetErrorBoundary }) => { resetErrorBoundary(); return null; }}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider {...oidcConfig}>
          <SettingsProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/user" element={<User />} />
                <Route path="/license-progress" element={<LicenseProgress />} />
                <Route path="/quiz/:subsectionCode" element={<Quiz />} />
                <Route path="/quiz-results/:subsectionCode" element={<QuizResults />} />
                <Route path="/subsections" element={<SubsectionsPage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/ai-tool-calls" element={<AIToolCallLogs />} />
              </Routes>
              <AppToaster />
            </BrowserRouter>
          </SettingsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)
