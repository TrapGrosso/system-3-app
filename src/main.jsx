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
import { NotesProvider } from './contexts/NotesContext'
import { DialogsProvider } from './contexts/DialogsContext'
import { UserSettingsProvider } from './contexts/UserSettingsContext'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

window.queryClient = queryClient

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
            <UserSettingsProvider>
              <PromptProvider>
                <TaskProvider>
                  <VariableProvider>
                    <DeepSearchQueueProvider>
                        <GroupsProvider>
                          <CompaniesProvider>
                            <ProspectsProvider>
                                <NotesProvider>
                                    <DialogsProvider>
                                      <App />
                                    </DialogsProvider>
                                </NotesProvider>
                            </ProspectsProvider>
                          </CompaniesProvider>
                        </GroupsProvider>
                    </DeepSearchQueueProvider>
                  </VariableProvider>
                </TaskProvider>
              </PromptProvider>
            </UserSettingsProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
