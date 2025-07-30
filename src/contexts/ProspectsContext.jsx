import React, { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useProspectsQuery } from '@/api/prospect-context/fetchProspects'
import { useDeleteProspects } from '@/api/prospect-context/deleteProspects'
import { useUpdateProspect } from '@/api/prospect-context/updateProspect'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'

const ProspectsContext = createContext(null)

export const ProspectsProvider = ({ children }) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Query params kept in context
  const [query, setQuery] = useState({
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

  // Track if we've already attempted a fallback to prevent infinite loops
  const [didFallback, setDidFallback] = useState(false)

  // Use the prospects query hook
  const queryApi = useProspectsQuery({ userId: user?.id, ...query })

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

  // Centralized error handling with fallback logic
  useEffect(() => {
    if (!queryApi.isError || queryApi.isFetching) return

    const hasExtraFilters = Object.values(query).some(
      v => v !== '' && v !== null && v !== undefined
    )

    if (hasExtraFilters && !didFallback) {
      // Show warning toast and attempt fallback by clearing filters
      toast.warning(
        `Filters failed (${queryApi.error?.message ?? 'unknown error'}). Showing all prospects instead.`
      )
      // Clear filters and reset page to 1
      setQuery(prev => ({
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
      setDidFallback(true) // Prevent infinite fallback attempts
      // React-Query will automatically refetch because queryKey changed
    } else {
      // Show error toast for cases where fallback isn't appropriate or already attempted
      toast.error(queryApi.error?.message ?? 'Failed to fetch prospects')
    }
  }, [queryApi.isError, queryApi.isFetching, queryApi.error, query, didFallback])

  // Reset didFallback flag when user manually changes filters
  useEffect(() => {
    setDidFallback(false)
  }, [query])

  // Helper functions for CRUD operations
  const updateProspect = React.useCallback(
    (linkedinId, updates) => {
      return updateProspectMutation.mutate({
        user_id: user?.id,
        prospect_id: linkedinId,
        ...updates
      })
    },
    [updateProspectMutation, user]
  )

  const deleteProspect = React.useCallback(
    (linkedinIds) => {
      return deleteProspectsMutation.mutate({
        user_id: user?.id,
        prospect_ids: Array.isArray(linkedinIds) ? linkedinIds : [linkedinIds]
      })
    },
    [deleteProspectsMutation, user]
  )

  const updateProspectCompany = React.useCallback(
    (prospect_id, company_id) => {
      return updateProspectMutation.mutate({
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
    setQuery: (partial) => {
      setQuery(prev => ({ ...prev, ...partial }))
    },
    updateQuery: (updateFn) => {
      setQuery(updateFn)
    },
    resetFilters: () => {
      setQuery(prev => ({
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
        page: 1, // Reset to first page when clearing filters
      }))
    },

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
    deleteProspectsMutation
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
