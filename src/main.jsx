import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ProspectsProvider } from './contexts/ProspectsContext.jsx'
import { GroupsProvider } from './contexts/GroupsContext.jsx'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { DeepSearchQueueProvider } from './contexts/DeepSearchQueueContext'
import { PromptProvider } from './contexts/PromptContext'
import { TaskProvider } from './contexts/TaskContext'
import { VariableProvider } from './contexts/VariableContext'
import { CompaniesProvider } from './contexts/CompaniesContext'
import { CampaignsProvider } from './contexts/CampaignsContext'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TaskProvider>
          <VariableProvider>
            <DeepSearchQueueProvider>
              <PromptProvider>
                <GroupsProvider>
                  <CompaniesProvider>
                    <ProspectsProvider>
                      <CampaignsProvider>
                        <App />
                      </CampaignsProvider>
                    </ProspectsProvider>
                  </CompaniesProvider>
                </GroupsProvider>
              </PromptProvider>
            </DeepSearchQueueProvider>
          </VariableProvider>
        </TaskProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
