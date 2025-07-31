import React, { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useGetAllCompaniesQuery } from '@/api/company-context/getAllCompanies'
import { useDeleteCompanies } from '@/api/company-context/deleteCompanies'
import { useUpdateCompany } from '@/api/company-context/updateCompany'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'

const CompaniesContext = createContext(null)

export const CompaniesProvider = ({ children }) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

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

  // Delete companies mutation
  const deleteCompaniesMutation = useDeleteCompanies({
    onSuccess: (data) => {
      const message = data.message || 'Company(ies) deleted successfully'
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['companies', user?.id] })
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete company(ies)")
    },
  })

  // Update company mutation
  const updateCompanyMutation = useUpdateCompany({
    onSuccess: (data) => {
      const message = data.message || 'Company updated successfully'
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['companies', user?.id] })
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update company")
    },
  })

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

  // Helper functions for CRUD operations
  const updateCompany = React.useCallback(
    (linkedinId, updates) => {
      return updateCompanyMutation.mutateAsync({
        user_id: user?.id,
        company_id: linkedinId,
        ...updates
      })
    },
    [updateCompanyMutation, user]
  )

  const deleteCompany = React.useCallback(
    (linkedinIds) => {
      return deleteCompaniesMutation.mutateAsync({
        user_id: user?.id,
        company_ids: Array.isArray(linkedinIds) ? linkedinIds : [linkedinIds]
      })
    },
    [deleteCompaniesMutation, user]
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

    // CRUD operation functions
    updateCompany,
    deleteCompany,

    // Raw mutations (following pattern from other contexts)
    updateCompanyMutation,
    deleteCompaniesMutation,

    // Loading states
    isUpdatingCompany: updateCompanyMutation.isPending,
    isDeletingCompany: deleteCompaniesMutation.isPending,
  }), [
    queryApi, 
    query, 
    updateCompany, 
    deleteCompany,
    updateCompanyMutation,
    deleteCompaniesMutation
  ])

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
