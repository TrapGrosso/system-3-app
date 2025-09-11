import { useQuery } from '@tanstack/react-query'

const getUserSettings = async (user_id, settings) => {
  if (!user_id) {
    console.warn('getAllPrompts: user_id is not defined. Returning null.')
    return null
  }
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/getUserSettings?user_id=${user_id}&settings=${settings}`, {
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

export const useGetUserSettings = (userId, type) => {
  return useQuery({
    queryKey: ['getUserSettings', userId, type],
    queryFn: () => getUserSettings(userId, type),
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
 * Fetches user settings for a specific user.
 * 
 * Query Parameters:
 * - user_id (required): UUID of the user
 * - settings (optional): Comma-separated list of setting keys to return. 
 *   Can use alias keys (e.g., add_leads) or full column names (e.g., add_leads_default_options).
 *   If not provided, returns all settings columns.
 * 
 * Valid setting aliases:
 * - add_leads -> add_leads_default_options
 * - create_variables_with_ai -> create_variables_with_ai_default_options
 * - find_emails_clearout -> find_emails_clearout_default_options
 * - resolve_deep_search_queue -> resolve_deep_search_queue_default_options
 * - search_company_with_ai -> search_company_with_ai_default_options
 * - verify_emails_clearout -> verify_emails_clearout_default_options
 * 
 * Example Requests:
 * 
 * Get all settings for a user:
 * GET /getUserSettings?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f
 * 
 * Get specific settings using aliases:
 * GET /getUserSettings?user_id=...&settings=add_leads,verify_emails_clearout
 * 
 * Get specific settings using full column names:
 * GET /getUserSettings?user_id=...&settings=add_leads_default_options,created_at
 * 
 * Example Success Response (200):
 * {
 *   "id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *   "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
 *   "add_leads_default_options": {
 *     "source": "linkedin",
 *     "limit": 10
 *   },
 *   "verify_emails_clearout_default_options": {
 *     "timeout": 30
 *   },
 *   "created_at": "2025-07-04T18:35:22.123456Z",
 *   "updated_at": "2025-07-04T18:35:22.123456Z"
 * }
 * 
 * Example Success Response (200) when no settings exist:
 * null
 * 
 * Example Error Response (400):
 * {"error": "Missing required query param: user_id"}
 * {"error": "Invalid setting key: \"unknown_key\". Valid aliases are: add_leads, create_variables_with_ai, ..."}
 */
