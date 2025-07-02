import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ProspectsProvider } from './contexts/ProspectsContext.jsx'
import { GroupsProvider } from './contexts/GroupsContext.jsx'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GroupsProvider>
          <ProspectsProvider>
            <App />
          </ProspectsProvider>
        </GroupsProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
