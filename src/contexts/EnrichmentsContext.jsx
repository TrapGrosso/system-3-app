import React, { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { useGetProspectEnrichments } from '@/api/enrichment/getProspectEnrichments'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'

const EnrichmentsContext = createContext(null)

export const EnrichmentsProvider = ({ children }) => {
  const { user } = useAuth()

  // Query params kept in context
  const [query, setQuery] = useState({
    page: 1,
    page_size: 10,
    sort_by: 'created_at',
    sort_dir: 'desc',
    // Filter options
    type: '',
    prompt_name: '',
    has_company: '',
  })

  // Track if we've already attempted a fallback to prevent infinite loops
  const [didFallback, setDidFallback] = useState(false)

  // Use the enrichments query hook
  const queryApi = useGetProspectEnrichments({ userId: user?.id, ...query })

  // Centralized error handling with fallback logic
  useEffect(() => {
    if (!queryApi.isError || queryApi.isFetching) return

    const hasExtraFilters = Object.values(query).some(
      v => v !== '' && v !== null && v !== undefined
    )

    if (hasExtraFilters && !didFallback) {
      // Show warning toast and attempt fallback by clearing filters
      toast.warning(
        `Filters failed (${queryApi.error?.message ?? 'unknown error'}). Showing all enrichments instead.`
      )
      // Clear filters and reset page to 1
      setQuery(prev => ({
        ...prev,
        type: '',
        prompt_name: '',
        has_company: '',
        page: 1,
      }))
      setDidFallback(true) // Prevent infinite fallback attempts
      // React-Query will automatically refetch because queryKey changed
    } else {
      // Show error toast for cases where fallback isn't appropriate or already attempted
      toast.error(queryApi.error?.message ?? 'Failed to fetch enrichments')
    }
  }, [queryApi.isError, queryApi.isFetching, queryApi.error, query, didFallback])

  // Reset didFallback flag when user manually changes filters
  useEffect(() => {
    setDidFallback(false)
  }, [query])

  // Dummy mutation functions
  const updateEnrichment = React.useCallback((id, updates) => {
    toast.info('Update enrichment functionality not implemented yet')
    console.log('updateEnrichment:', id, updates)
  }, [])

  const deleteEnrichment = React.useCallback((id) => {
    toast.info('Delete enrichment functionality not implemented yet')
    console.log('deleteEnrichment:', id)
  }, [])

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
        type: '',
        prompt_name: '',
        has_company: '',
        page: 1, // Reset to first page when clearing filters
      }))
    },

    // Utility functions for common operations
    getEnrichmentById: (id) => {
      const enrichments = queryApi.data?.data || []
      return enrichments.find(e => e.id === id || (e.prospect_enrichments && e.prospect_enrichments.some(pe => pe.id === id)) || (e.company_enrichments && e.company_enrichments.some(ce => ce.id === id)))
    },
    getEnrichmentsByType: (type) => {
      const enrichments = queryApi.data?.data || []
      return enrichments.filter(e => 
        (e.prospect_enrichments && e.prospect_enrichments.some(pe => pe.type === type)) ||
        (e.company_enrichments && e.company_enrichments.some(ce => ce.type === type))
      )
    },
    getTotalCount: () => queryApi.data?.total || 0,
    getTypeCounts: () => {
      const enrichments = queryApi.data?.data || []
      const counts = {}
      enrichments.forEach(enrichment => {
        // Count prospect enrichment types
        if (enrichment.prospect_enrichments) {
          enrichment.prospect_enrichments.forEach(pe => {
            counts[pe.type] = (counts[pe.type] || 0) + 1
          })
        }
        // Count company enrichment types
        if (enrichment.company_enrichments) {
          enrichment.company_enrichments.forEach(ce => {
            counts[ce.type] = (counts[ce.type] || 0) + 1
          })
        }
      })
      return counts
    },

    // Mutation functions (stubs for now)
    updateEnrichment,
    deleteEnrichment,

    // Loading states (always false for now since mutations are stubs)
    isUpdatingEnrichment: false,
    isDeletingEnrichment: false,
  }), [queryApi, query, updateEnrichment, deleteEnrichment])

  return (
    <EnrichmentsContext.Provider value={value}>
      {children}
    </EnrichmentsContext.Provider>
  )
}

export const useEnrichments = () => {
  const context = useContext(EnrichmentsContext)
  if (!context) {
    throw new Error('useEnrichments must be used within an EnrichmentsProvider')
  }
  return context
}

export default EnrichmentsContext
