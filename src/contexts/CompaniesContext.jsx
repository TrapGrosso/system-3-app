import React, { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { useGetAllCompaniesQuery } from '@/api/company-context/getAllCompanies'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'

const CompaniesContext = createContext(null)

export const CompaniesProvider = ({ children }) => {
  const { user } = useAuth()

  // Query params kept in context
  const [query, setQuery] = useState({
    page: 1,
    page_size: 10,
    sort_by: 'created_at',
    sort_dir: 'desc',
    // Filter options
    name: '',
    industry: '',
    location: '',
    size_op: '',
    size_val: '',
    prospect_first_name: '',
    prospect_last_name: '',
  })

  // Track if we've already attempted a fallback to prevent infinite loops
  const [didFallback, setDidFallback] = useState(false)

  // Use the companies query hook
  const queryApi = useGetAllCompaniesQuery({ userId: user?.id, ...query })

  // Centralized error handling with fallback logic
  useEffect(() => {
    if (!queryApi.isError || queryApi.isFetching) return

    const hasExtraFilters = Object.values(query).some(
      v => v !== '' && v !== null && v !== undefined && !(v === 1 || v === 10)
    )

    if (hasExtraFilters && !didFallback) {
      // Show warning toast and attempt fallback by clearing filters
      toast.warning(
        `Filters failed (${queryApi.error?.message ?? 'unknown error'}). Showing all companies instead.`
      )
      // Clear filters and reset page to 1
      setQuery(prev => ({
        ...prev,
        name: '',
        industry: '',
        location: '',
        size_op: '',
        size_val: '',
        prospect_first_name: '',
        prospect_last_name: '',
        page: 1,
      }))
      setDidFallback(true) // Prevent infinite fallback attempts
      // React-Query will automatically refetch because queryKey changed
    } else {
      // Show error toast for cases where fallback isn't appropriate or already attempted
      toast.error(queryApi.error?.message ?? 'Failed to fetch companies')
    }
  }, [queryApi.isError, queryApi.isFetching, queryApi.error, query, didFallback])

  // Reset didFallback flag when user manually changes filters
  useEffect(() => {
    setDidFallback(false)
  }, [query])

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
        name: '',
        industry: '',
        location: '',
        size_op: '',
        size_val: '',
        prospect_first_name: '',
        prospect_last_name: '',
        page: 1, // Reset to first page when clearing filters
      }))
    },

    // Utility functions for common operations
    getCompanyByLinkedinId: (linkedinId) => {
      const companies = queryApi.data?.data || []
      return companies.find(c => c.linkedin_id === linkedinId)
    },
    getCompaniesByIndustry: (industry) => {
      const companies = queryApi.data?.data || []
      return companies.filter(c => c.industry === industry)
    },
    getTotalCount: () => queryApi.data?.total || 0,

    // Future CRUD operation stubs
    updateCompany: async (linkedinId, updates) => {
      // TODO: Implement company update mutation
      console.log('updateCompany:', linkedinId, updates)
    },
    deleteCompany: async (linkedinId) => {
      // TODO: Implement company deletion mutation
      console.log('deleteCompany:', linkedinId)
    },
  }), [queryApi, query])

  return (
    <CompaniesContext.Provider value={value}>
      {children}
    </CompaniesContext.Provider>
  )
}

export const useCompanies = () => {
  const context = useContext(CompaniesContext)
  if (!context) {
    throw new Error('useCompanies must be used within a CompaniesProvider')
  }
  return context
}

export default CompaniesContext
