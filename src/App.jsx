import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AddLeads from './pages/AddLeads'
import Marketing from './pages/Marketing'
import Campaigns from './pages/Campaigns'
import Tasks from './pages/Tasks'
import Prompts from './pages/Prompts'
import CustomActions from './pages/CustomActions'
import ProspectDetails from './pages/ProspectDetails'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './contexts/AuthContext'
import { RoundSpinner } from './components/ui/spinner'
import { Toaster } from './components/ui/sonner'

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
      <Toaster richColors position="bottom-right" />
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
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
          path="/" 
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
        />
      </Routes>
    </Router>
  )
}

export default App
