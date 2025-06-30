import React, { createContext, useContext } from 'react'
import { useFetchProspects } from '@/api/prospect-context/fetchProspects'
import { useAuth } from '@/contexts/AuthContext'

const ProspectsContext = createContext()

export const ProspectsProvider = ({ children }) => {
  const { user } = useAuth()
  
  const {
    data: prospects = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    isRefetching
  } = useFetchProspects(user?.id)

  const value = {
    prospects,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    isRefetching,
    // Utility functions for common operations
    getProspectById: (linkedinId) => prospects.find(p => p.linkedin_id === linkedinId),
    getProspectsByStatus: (status) => prospects.filter(p => p.status === status),
    getTotalCount: () => prospects.length,
    getStatusCounts: () => {
      const counts = {}
      prospects.forEach(prospect => {
        counts[prospect.status] = (counts[prospect.status] || 0) + 1
      })
      return counts
    }
  }

  return (
    <ProspectsContext.Provider value={value}>
      {children}
    </ProspectsContext.Provider>
  )
}

export const useProspects = () => {
  const context = useContext(ProspectsContext)
  if (!context) {
    throw new Error('useProspects must be used within a ProspectsProvider')
  }
  return context
}

export default ProspectsContext
