import { useQuery } from '@tanstack/react-query'
import React, { useState, useEffect, useMemo } from 'react'
import { toast } from 'sonner'

const getLogsByAction = async (params) => {
  const { userId, action, ...filters } = params
  
  if (!userId) {
    console.warn('getLogsByAction: userId is not defined. Returning null.')
    return null
  }

  // Build URL with query parameters
  const searchParams = new URLSearchParams({
    user_id: userId,
    action: action,
  })

  // Add optional filters to URL if they have values
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      searchParams.append(key, value)
    }
  })

  const response = await fetch(`https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/getLogsByAction?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch logs')
  }

  const result = await response.json()
  
  // Extract only the data field from the response
  return result || []
}

// Updated hook that accepts full params object
export const useLogsByActionQuery = (params) => {
  return useQuery({
    queryKey: ['logs', params.userId, params.action, params],
    queryFn: () => getLogsByAction(params),
    enabled: Boolean(params?.userId), // Only run query if userId is defined
    initialData: null, // Return null if query is not enabled
    staleTime: 30000, // 30 seconds - logs are relatively fresh data
    cacheTime: 300000, // 5 minutes cache
    refetchInterval: 60000, // Refetch every minute to get latest logs
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

// Legacy hook for backward compatibility
export const useGetLogsByAction = (userId, action) => {
  return useLogsByActionQuery({ userId, action })
}

// Query controller hook that mirrors ProspectsContext functionality
export const useLogsQueryController = ({ userId, action }) => {
  const [query, setQuery] = useState({
    page: 1,
    page_size: 10,
    sort_by: 'created_at',
    sort_dir: 'desc',
    status: '',
    action: '',
    date_from: '',
    date_to: '',
    date_field: 'start_time',
    message: '',
  })

  // Track if we've already attempted a fallback to prevent infinite loops
  const [didFallback, setDidFallback] = useState(false)

  // Use the logs query hook
  const queryApi = useLogsByActionQuery({ userId, action, ...query })

  // Centralized error handling with fallback logic
  useEffect(() => {
    if (!queryApi.isError || queryApi.isFetching) return

    const hasExtraFilters = Object.values(query).some(
      v => v !== '' && v !== null && v !== undefined && v !== 1 && v !== 10 && v !== 'created_at' && v !== 'desc' && v !== 'start_time'
    )

    if (hasExtraFilters && !didFallback) {
      // Show warning toast and attempt fallback by clearing filters
      toast.warning(
        `Filters failed (${queryApi.error?.message ?? 'unknown error'}). Showing all logs instead.`
      )
      // Clear filters and reset page to 1
      setQuery(prev => ({
        ...prev,
        status: '',
        date_from: '',
        date_to: '',
        date_field: 'start_time',
        message: '',
        page: 1,
      }))
      setDidFallback(true) // Prevent infinite fallback attempts
      // React-Query will automatically refetch because queryKey changed
    } else {
      // Show error toast for cases where fallback isn't appropriate or already attempted
      toast.error(queryApi.error?.message ?? 'Failed to fetch logs')
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
        status: '',
        action: '',
        date_from: '',
        date_to: '',
        date_field: 'start_time',
        message: '',
        page: 1, // Reset to first page when clearing filters
      }))
    },

    // Utility functions for common operations
    getLogById: (id) => {
      const logs = queryApi.data?.data || []
      return logs.find(l => l.id === id)
    },
    getLogsByStatus: (status) => {
      const logs = queryApi.data?.data || []
      return logs.filter(l => l.status === status)
    },
    getTotalCount: () => queryApi.data?.total || 0,
    getStatusCounts: () => {
      const logs = queryApi.data?.data || []
      const counts = {}
      logs.forEach(log => {
        counts[log.status] = (counts[log.status] || 0) + 1
      })
      return counts
    },
  }), [queryApi, query])

  return value
}

/**
 * Fetches logs for a user based on a specific action with advanced filtering, sorting, and pagination.
 * 
 * Query Parameters:
 * - user_id (required): UUID of the user
 * - action (optional): The action to filter logs by. If not provided, all actions will be fetched.
 * - page (optional): Page number, default 1
 * - page_size (optional): Results per page, default 10, max 100
 * - sort_by (optional): Column to sort by ('duration_ms', 'created_at', 'prospect_count'), default 'created_at'
 * - sort_dir (optional): Sort direction, 'asc' or 'desc', default 'desc'
 * - status (optional): Filter by log status ('in_progress', 'success', 'failed')
 * - date_from (optional): Start date for filtering (YYYY-MM-DD format)
 * - date_to (optional): End date for filtering (YYYY-MM-DD format, inclusive)
 * - date_field (optional): Column to apply date filtering to ('start_time', 'end_time'), default 'start_time'
 * - message (optional): Search within log messages (case-insensitive partial match)
 * 
 * Example Requests:
 * 
 * Basic usage:
 * GET /getLogsByAction?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f
 * GET /getLogsByAction?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&action=add_leads
 * 
 * With pagination and sorting:
 * GET /getLogsByAction?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&action=add_leads&page=2&page_size=20&sort_by=duration_ms&sort_dir=desc
 * 
 * Filter by status:
 * GET /getLogsByAction?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&action=add_leads&status=failed
 * 
 * Filter by date range (inclusive):
 * GET /getLogsByAction?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&action=add_leads&date_from=2025-06-01&date_to=2025-07-31
 * 
 * Filter by date range on end_time:
 * GET /getLogsByAction?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&action=add_leads&date_from=2025-06-01&date_to=2025-07-31&date_field=end_time
 * 
 * Filter from specific date onwards:
 * GET /getLogsByAction?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&action=add_leads&date_from=2025-07-14
 * 
 * Search in messages:
 * GET /getLogsByAction?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&action=add_leads&message=error&status=failed
 * 
 * Combined filters:
 * GET /getLogsByAction?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&action=add_leads&date_from=2025-07-14&date_to=2025-07-20&status=success&sort_by=duration_ms&sort_dir=asc
 * 
 * Example Success Response (200):
 * {
 *   "data": [
 *     {
 *       "id": "91be-...",
 *       "status": "success",
 *       "start_time": "2025-07-14T10:00:21.123Z",
 *       "end_time": "2025-07-14T10:00:22.456Z",
 *       "duration_ms": 1333,
 *       "message": "Added 25 leads successfully",
 *       "created_at": "2025-07-14T10:00:21.123Z",
 *       "updated_at": "2025-07-14T10:00:22.456Z",
 *       "retry_eligible": false,
 *       "prospect_count": 25
 *     },
 *     {
 *       "id": "82cf-...",
 *       "status": "failed",
 *       "start_time": "2025-07-14T09:30:15.789Z",
 *       "end_time": "2025-07-14T09:30:20.123Z",
 *       "duration_ms": 4334,
 *       "message": "Failed to add leads: validation error",
 *       "created_at": "2025-07-14T09:30:15.789Z",
 *       "updated_at": "2025-07-14T09:30:20.123Z",
 *       "retry_eligible": true,
 *       "prospect_count": 0
 *     }
 *   ],
 *   "total": 2,
 *   "page": 1,
 *   "page_size": 10
 * }
 * 
 * Example Error Responses:
 * 
 * Missing required parameters (400):
 * {"error": "Missing required query param: user_id"}
 * 
 * Invalid parameters (400):
 * {"error": "Invalid user_id format. Must be a valid UUID"}
 * {"error": "Parameter validation failed: Invalid value \"invalid_status\". Must be one of: in_progress, success, failed"}
 * {"error": "Parameter validation failed: Invalid date format \"2025-13-32\". Expected YYYY-MM-DD"}
 * {"error": "Parameter validation failed: Value 150 exceeds maximum of 100"}
 * {"error": "Parameter validation failed: Invalid value \"invalid_field\". Must be one of: start_time, end_time"}
 * 
 * Database error (500):
 * {"error": "Database error: [specific error message]"}
 */
