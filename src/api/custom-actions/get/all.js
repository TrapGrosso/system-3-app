import { useQuery } from '@tanstack/react-query'

const getCustomActionAll = async (user_id) => {
  if (!user_id) {
    console.warn('getCustomActionAll: user_id is not defined. Returning null.')
    return null
  }
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/custom-actions/all?user_id=${user_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch prompts')
  }

  const result = await response.json()
  
  return result || []
}

export const useGetCustomActionAll = (userId) => {
  return useQuery({
    queryKey: ['getCustomActionAll', userId],
    queryFn: () => getCustomActionAll(userId),
    enabled: Boolean(userId), // Only run query if userId is defined
    staleTime: 30000,
    cacheTime: 300000,
    refetchInterval: 60000, 
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}


/**
 * GET /functions/v1/custom-actions/all
 *
 * Description:
 *   Returns all custom actions belonging to a user. No pagination, sorting, or filtering is applied.
 *
 * Query Parameters:
 *   - user_id (required, uuid): The owner of the custom actions.
 *
 * Success Response (200):
 *   [
 *     {
 *       "id": "c8b9b1ab-...-...",
 *       "name": "Send to Webhook",
 *       "description": "Push prospect to webhook",
 *       "endpoint_url": "https://example.com/hook",
 *       "auth_type": "bearer",
 *       "auth_config": { ... },
 *       "include_data": { "prospect": true, ... },
 *       "require_data": { "variables": false, ... },
 *       "execution_mode": "single",
 *       "filters": [],
 *       "warning_message": null,
 *       "created_at": "2025-07-04T18:35:22.123456",
 *       "updated_at": "2025-07-04T18:35:22.123456",
 *       "is_active": true
 *     }
 *   ]
 *
 * Error Responses:
 *   - 400: {"error": "Missing required query param: user_id"}
 *   - 400: {"error": "Invalid user_id format. Must be a valid UUID"}
 *   - 500: {"error": "Server configuration error"}
 *   - 500: {"error": "Database error: <detail>"}
 *
 * Example Requests:
 *   GET /functions/v1/custom-actions/all?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f
 */
