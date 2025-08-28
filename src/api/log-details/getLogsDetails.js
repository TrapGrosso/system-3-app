import { useQuery } from '@tanstack/react-query'

const getLogsDetails = async (user_id, log_id) => {
  if (!user_id) {
    console.warn('getLogsDetails: user_id is not defined. Returning null.')
    return null
  }
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/getLogsDetails?user_id=${user_id}&log_id=${log_id}`, {
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
  
  return result || []
}

export const useGetLogsDetails = (userId, log_id) => {
  return useQuery({
    queryKey: ['getLogsDetails', userId, log_id],
    queryFn: () => getLogsDetails(userId, log_id),
    enabled: Boolean(userId), // Only run query if userId is defined
    staleTime: 30000, // 30 seconds - logs are relatively fresh data
    cacheTime: 300000, // 5 minutes cache
    refetchInterval: 60000, // Refetch every minute to get latest logs
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}


/**
 * Fetches detailed information for a specific log, including associated prospect results and company information.
 * 
 * Example Request:
 * GET /getLogsDetails?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&log_id=c2b4a6d2-1234-5678-9012-abcdef123456
 * 
 * Example Success Response (200):
 * {
 *   "log": {
 *     "id": "c2b4a6d2-1234-5678-9012-abcdef123456",
 *     "action": "add_leads",
 *     "status": "success",
 *     "start_time": "2025-08-01T10:00:00",
 *     "end_time": "2025-08-01T10:00:03",
 *     "duration_ms": 3450,
 *     "message": null,
 *     "metadata": {},
 *     "created_at": "2025-08-01T10:00:00",
 *     "updated_at": "2025-08-01T10:00:03",
 *     "retry_eligible": false
 *   },
 *   "results": [
 *     {
 *       "prospect_id": "annvanino",
 *       "success": true,
 *       "result": { "added_variables": 4 },
 *       "created_at": "2025-08-01T10:00:00",
 *       "first_name": "Ann",
 *       "last_name": "Vanino",
 *       "company_id": "linkedcompany123",
 *       "company_name": "The Overnight Success Co."
 *     }
 *   ]
 * }
 * 
 * Example Error Response (400):
 * {"error": "`user_id` (UUID) and `log_id` (UUID) are required as query parameters"}
 * 
 * Example Error Response (404):
 * {"error": "Log not found"}
 */
