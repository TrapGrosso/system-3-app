import React, { createContext, useContext, useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useProspectsQuery } from '@/api/prospect-context/fetchProspects'
import { useDeleteProspects } from '@/api/prospect-context/deleteProspects'
import { useUpdateProspect } from '@/api/prospect-context/updateProspect'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { useQueryErrorFallback } from '@/utils/useQueryErrorFallback'

const ProspectsContext = createContext(null)

export const ProspectsProvider = ({ children }) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Query params kept in context
  const [query, setQueryState] = useState({
    page: 1,
    page_size: 10,
    sort_by: 'created_at',
    sort_dir: 'desc',
    // Filter options
    q: '',
    search_fields: '',
    status: '',
    in_group: '',
    group_names: '',
    in_campaign: '',
    campaign_names: '',
    prompt_names: '',
    has_bd_scrape: '',
    has_deep_search: '',
  })

  // Use the prospects query hook
  const queryApi = useProspectsQuery({ userId: user?.id, ...query })

  const resetFilters = useCallback(() => {
    // Internal programmatic reset used by fallback effect
    setQueryState(prev => ({
      ...prev,
      q: '',
      search_fields: '',
      status: '',
      in_group: '',
      group_names: '',
      in_campaign: '',
      campaign_names: '',
      prompt_names: '',
      has_bd_scrape: '',
      has_deep_search: '',
      page: 1,
    }))
  }, [])

  const { resetFallback } = useQueryErrorFallback(queryApi, resetFilters, 'prospects', {
    resetOnlyIfFiltersActive: true,
    query,
  })

  // Delete prospects mutation
  const deleteProspectsMutation = useDeleteProspects({
    onSuccess: (data) => {
      const message = data.message || 'Prospect(s) deleted successfully'
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['prospects', user?.id] })
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete prospect(s)")
    },
  })

  // Update prospect mutation
  const updateProspectMutation = useUpdateProspect({
    onSuccess: (data) => {
      const message = data.message || 'Prospect updated successfully'
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['prospects', user?.id] })
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update prospect")
    },
  })

  // Hoisted user-controlled setter and internal reset for fallback
  const userSetQuery = useCallback((partialOrUpdater) => {
    // Re-arm fallback on any user-driven change
    resetFallback()
    if (typeof partialOrUpdater === 'function') {
      setQueryState(prev => partialOrUpdater(prev))
    } else {
      setQueryState(prev => ({ ...prev, ...partialOrUpdater }))
    }
  }, [resetFallback])

  // Helper functions for CRUD operations
  const updateProspect = React.useCallback(
    (linkedinId, updates) => {
      return updateProspectMutation.mutateAsync({
        user_id: user?.id,
        prospect_id: linkedinId,
        ...updates
      })
    },
    [updateProspectMutation, user]
  )

  const deleteProspect = React.useCallback(
    (linkedinIds) => {
      return deleteProspectsMutation.mutateAsync({
        user_id: user?.id,
        prospect_ids: Array.isArray(linkedinIds) ? linkedinIds : [linkedinIds]
      })
    },
    [deleteProspectsMutation, user]
  )

  const updateProspectCompany = React.useCallback(
    (prospect_id, company_id) => {
      return updateProspectMutation.mutateAsync({
        user_id: user?.id,
        prospect_id,
        updated_company_linkedin_id: company_id
      })
    },
    [updateProspectMutation, user]
  )

  const value = useMemo(() => ({
    // React Query data and states
    data: queryApi.data?.data || [],
    total: queryApi.data?.total || 0,
    isLoading: queryApi.isLoading,
    isFetching: queryApi.isFetching,
    isError: queryApi.isError,
    error: queryApi.error,
    refetch: queryApi.refetch,

    // Query state management
    query,
    setQuery: userSetQuery,
    updateQuery: (updateFn) => {
      return userSetQuery(updateFn)
    },
    resetFilters,

    // Utility functions for common operations
    getProspectById: (linkedinId) => {
      const prospects = queryApi.data?.data || []
      return prospects.find(p => p.linkedin_id === linkedinId)
    },
    getProspectsByStatus: (status) => {
      const prospects = queryApi.data?.data || []
      return prospects.filter(p => p.status === status)
    },
    getTotalCount: () => queryApi.data?.total || 0,
    getStatusCounts: () => {
      const prospects = queryApi.data?.data || []
      const counts = {}
      prospects.forEach(prospect => {
        counts[prospect.status] = (counts[prospect.status] || 0) + 1
      })
      return counts
    },

    // CRUD operation functions
    updateProspect,
    deleteProspect,
    updateProspectCompany,

    // Raw mutations (following pattern from other contexts)
    updateProspectMutation,
    deleteProspectsMutation,

    // Loading states
    isUpdatingProspect: updateProspectMutation.isPending,
    isDeletingProspect: deleteProspectsMutation.isPending,
  }), [
    queryApi, 
    query, 
    updateProspect, 
    deleteProspect, 
    updateProspectCompany,
    updateProspectMutation,
    deleteProspectsMutation,
    userSetQuery,
    resetFilters
  ])

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
