import { useQuery } from '@tanstack/react-query'
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import { buildSearchParams } from '@/utils/searchParams'

const getLogsByAction = async (params) => {
  if (!params?.user_id) {
    console.warn('getLogsByAction: userId is not defined. Returning null.')
    return null
  }

  const searchParams = buildSearchParams(params)

  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/getLogsByAction?${searchParams}`, {
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
    queryFn: () => getLogsByAction({ ...params, user_id: params.userId, userId: null }),
    enabled: Boolean(params?.userId), // Only run query if userId is defined
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
  return useLogsByActionQuery({ user_id: userId, action })
}

// Query controller hook that mirrors ProspectsContext functionality
export const useLogsQueryController = ({ userId, action }) => {
  const [query, setQueryState] = useState({
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

  // Fallback guard to prevent infinite loops
  const fallbackDoneRef = useRef(false)

  // Use the logs query hook
  const queryApi = useLogsByActionQuery({ userId, action, ...query })

  // Hoisted user-controlled setter and internal reset for fallback
  const userSetQuery = useCallback((partialOrUpdater) => {
    // Re-arm fallback on any user-driven change
    fallbackDoneRef.current = false
    if (typeof partialOrUpdater === 'function') {
      setQueryState(prev => partialOrUpdater(prev))
    } else {
      setQueryState(prev => ({ ...prev, ...partialOrUpdater }))
    }
  }, [])

  const resetFilters = useCallback(() => {
    // Internal programmatic reset used by fallback effect
    setQueryState(prev => ({
      ...prev,
      status: '',
      date_from: '',
      date_to: '',
      date_field: 'start_time',
      message: '',
      page: 1,
    }))
  }, [])

  // Single error handling effect with fallback guard
  useEffect(() => {
    if (!queryApi.isError || queryApi.isFetching) return

    if (fallbackDoneRef.current) {
      toast.error(queryApi.error?.message ?? 'Failed to fetch logs')
      return
    }

    fallbackDoneRef.current = true
    toast.warning(
      `Filters failed (${queryApi.error?.message ?? 'unknown error'}). Showing all logs instead.`
    )
    resetFilters()
  }, [queryApi.isError, queryApi.isFetching, queryApi.error, resetFilters])

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
  }), [queryApi, query, userSetQuery, resetFilters])

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
