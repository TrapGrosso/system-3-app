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

export const useGetUserSettings = (userId, settings) => {
  return useQuery({
    queryKey: ['getUserSettings', userId, settings],
    queryFn: () => getUserSettings(userId, settings),
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
 * - settings (optional): A single setting key to return. 
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
 * Get a specific setting using an alias (returns only the JSON value):
 * GET /getUserSettings?user_id=...&settings=add_leads
 * 
 * Get a specific setting using a full column name (returns only the JSON value):
 * GET /getUserSettings?user_id=...&settings=add_leads_default_options
 * 
 * Example Success Response (200) when no settings param is provided:
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
 * Example Success Response (200) when settings=add_leads is provided:
 * {
 *   "source": "linkedin",
 *   "limit": 10
 * }
 * 
 * Example Success Response (200) when no settings exist:
 * null
 * 
 * Example Error Response (400):
 * {"error": "Missing required query param: user_id"}
 * {"error": "Provide exactly one setting via ?settings=..."}
 * {"error": "Invalid setting key: \"created_at\". Valid aliases are: add_leads, create_variables_with_ai, find_emails_clearout, resolve_deep_search_queue, search_company_with_ai, verify_emails_clearout. You can also use full column names: add_leads_default_options, create_variables_with_ai_default_options, find_emails_clearout_default_options, resolve_deep_search_queue_default_options, search_company_with_ai_default_options, verify_emails_clearout_default_options."}
 */
