import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppProvider } from './context/AppProvider.tsx'
import { TimerProvider } from './context/TimerProvider.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { TasksProvider } from './context/TasksContext.tsx'
import { CommunityProvider } from './context/CommunityContext.tsx'
import { ProfileProvider } from './context/ProfileContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AppProvider>
        <ProfileProvider>
          <TasksProvider>
            <CommunityProvider>
              <TimerProvider>
                <App />
              </TimerProvider>
            </CommunityProvider>
          </TasksProvider>
        </ProfileProvider>
      </AppProvider>
    </AuthProvider>
  </StrictMode>,
)
