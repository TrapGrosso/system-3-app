import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import AddLeads from './pages/AddLeads'
import Marketing from './pages/Marketing'
import Campaigns from './pages/Campaigns'
import Tasks from './pages/Tasks'
import Prompts from './pages/Prompts'
import CustomActions from './pages/CustomActions'
import ProspectDetails from './pages/ProspectDetails'
import ProtectedRoute from './components/ProtectedRoute'
import Groups from './pages/Groups'
import Logs from './pages/Logs'
import PeopleCompanies from './pages/People&Companies'
import LogDetails from './pages/LogDetails'
import CampaignDetails from './pages/CampaignDetails'
import { useAuth } from './contexts/AuthContext'
import { RoundSpinner } from './components/ui/spinner'
import { Toaster } from './components/ui/sonner'
import Settings from './pages/Settings'
import { N8nWarningsDialog } from '@/components/dialogs'
import { GetHelp } from './pages/GetHelp'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RoundSpinner size="lg" />
      </div>
    )
  }

  return (
    <Router>
      <N8nWarningsDialog initialOpen storageKey="n8n-warnings:last-signature" />
      <Toaster richColors position="bottom-right" />
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route 
          path="/forgot-password" 
          element={user ? <Navigate to="/dashboard" replace /> : <ForgotPassword />} 
        />
        <Route 
          path="/reset-password" 
          element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/people&companies" 
          element={
            <ProtectedRoute>
              <PeopleCompanies />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/add-leads" 
          element={
            <ProtectedRoute>
              <AddLeads />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/marketing" 
          element={
            <ProtectedRoute>
              <Marketing />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/campaigns" 
          element={
            <ProtectedRoute>
              <Campaigns />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tasks" 
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/groups" 
          element={
            <ProtectedRoute>
              <Groups />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/prompts" 
          element={
            <ProtectedRoute>
              <Prompts />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/custom-actions" 
          element={
            <ProtectedRoute>
              <CustomActions />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/prospects/:linkedinId" 
          element={
            <ProtectedRoute>
              <ProspectDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/logs/:logId" 
          element={
            <ProtectedRoute>
              <LogDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/campaigns/:campaignId" 
          element={
            <ProtectedRoute>
              <CampaignDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/logs" 
          element={
            <ProtectedRoute>
              <Logs />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings/>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/gethelp" 
          element={
            <ProtectedRoute>
              <GetHelp/>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/" 
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
        />
      </Routes>
    </Router>
  )
}

export default App
