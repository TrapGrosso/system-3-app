import React, { createContext, useContext, useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useGetAllCompaniesQuery } from '@/api/company-context/getAllCompanies'
import { useDeleteCompanies } from '@/api/company-context/deleteCompanies'
import { useUpdateCompany } from '@/api/company-context/updateCompany'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { useQueryErrorFallback } from '@/utils/useQueryErrorFallback'

const CompaniesContext = createContext(null)

export const CompaniesProvider = ({ children }) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Query params kept in context
  const [query, setQueryState] = useState({
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

  // Use the companies query hook
  const queryApi = useGetAllCompaniesQuery({ userId: user?.id, ...query })

  const resetFilters = useCallback(() => {
    // Internal programmatic reset used by fallback effect
    setQueryState(prev => ({
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
  }, [])

  const { resetFallback } = useQueryErrorFallback(queryApi, resetFilters, 'companies', {
    resetOnlyIfFiltersActive: true,
    query,
  })

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
      return userSetQuery(partial)
    },
    updateQuery: (updateFn) => {
      return userSetQuery(updateFn)
    },
    resetFilters,

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
    deleteCompaniesMutation,
    userSetQuery,
    resetFilters
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
