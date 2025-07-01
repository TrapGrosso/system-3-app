import { useQuery } from '@tanstack/react-query'

const fetchAddLeadLogs = async (user_id) => {
  const response = await fetch(`https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/fetchAddLeadLogs?user_id=${user_id}`, {
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

export const useFetchAddLeadLogs = (userId) => {
  return useQuery({
    queryKey: ['addLeadLogs', userId],
    queryFn: () => fetchAddLeadLogs(userId),
    staleTime: 30000, // 30 seconds - logs are relatively fresh data
    cacheTime: 300000, // 5 minutes cache
    refetchInterval: 60000, // Refetch every minute to get latest logs
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

/**
 * Fetches logs for 'add_leads' actions for a specific user.
 * 
 * Example Request:
 * GET /fetchAddLeadLogs?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f
 * 
 * Example Success Response (200):
 * [
 *   {
 *     "id": "15cfe47f-67a5-4232-b33c-5e713172d859",
 *     "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
 *     "action": "add_leads",
 *     "status": "success",
 *     "start_time": "2025-06-28T22:37:47.206",
 *     "end_time": "2025-06-28T22:39:01.677",
 *     "duration_ms": 74471,
 *     "message": "string",
 *     "metadata": {},
 *     "created_at": "2025-06-28T20:37:47.373963",
 *     "updated_at": "2025-06-28T20:37:47.373963",
 *     "retry_eligible": false
 *   },
 *   {
 *     "id": "2b8c02ca-0c50-4516-a2bc-6a22c4582b55",
 *     "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
 *     "action": "add_leads",
 *     "status": "failed",
 *     "start_time": "2025-06-28T13:58:25.222",
 *     "end_time": "2025-06-28T13:58:25.667",
 *     "duration_ms": 445,
 *     "message": "string",
 *     "metadata": {},
 *     "created_at": "2025-06-28T11:58:25.375852",
 *     "updated_at": "2025-06-28T20:37:47.156",
 *     "retry_eligible": false
 *   }
 * ]
 * 
 * Example Error Response (400):
 * {"error": "Missing required query param: user_id"}
 */