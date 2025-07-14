import { useQuery } from '@tanstack/react-query'

const getLogsByAction = async (user_id, action) => {
  const response = await fetch(`https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/getLogsByAction?user_id=${user_id}&action=${action}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch add lead logs')
  }

  const result = await response.json()
  
  // Extract only the data field from the response
  return result || []
}

export const useGetLogsByAction = (userId, action) => {
  return useQuery({
    queryKey: ['addLeadLogs', userId, action],
    queryFn: () => getLogsByAction(userId, action),
    staleTime: 30000, // 30 seconds - logs are relatively fresh data
    cacheTime: 300000, // 5 minutes cache
    refetchInterval: 60000, // Refetch every minute to get latest logs
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

/**
 * Fetches logs for a user based on a specific action.
 * 
 * Example Request:
 * GET /getLogsByAction?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&action=add_leads
 * 
 * Example Success Response (200):
 * [
 *   {
 *     "id": "91be-...",
 *     "status": "success",
 *     "start_time": "2025-07-14T10:00:21.123Z",
 *     "end_time": "2025-07-14T10:00:22.456Z",
 *     "duration_ms": 1333,
 *     "message": "Added 25 leads",
 *     "created_at": "2025-07-14T10:00:21.123Z",
 *     "updated_at": "2025-07-14T10:00:22.456Z",
 *     "retry_eligible": false
 *   }
 * ]
 * 
 * Example Error Response (400):
 * {"error": "Missing required query param: user_id"}
 * {"error": "Invalid user_id format. Must be a valid UUID"}
 * {"error": "Missing or empty required query param: action"}
 */