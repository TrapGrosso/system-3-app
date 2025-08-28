import { useQuery } from '@tanstack/react-query'

const getAllPrompts = async (user_id, type) => {
  if (!user_id) {
    console.warn('getAllPrompts: user_id is not defined. Returning null.')
    return null
  }
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/getAllPrompts?user_id=${user_id}&type=${type}`, {
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
  console.log(result)
  
  return result || []
}

export const useGetAllPrompts = (userId, type) => {
  return useQuery({
    queryKey: ['getAllPrompts', userId, type],
    queryFn: () => getAllPrompts(userId, type),
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
 * Fetches all prompts for a user, with optional filtering by agent type.
 * 
 * Query Parameters:
 * - user_id (required): UUID of the user
 * - type (optional): Filter by agent_type. If omitted, null, empty, "all", or "All", returns all prompts
 * 
 * Example Requests:
 * GET /getAllPrompts?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f
 * GET /getAllPrompts?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&type=sales
 * GET /getAllPrompts?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&type=all
 * 
 * Example Success Response (200):
 * [
 *   {
 *     "id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *     "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
 *     "name": "Sales Email Template",
 *     "description": "Template for cold outreach emails",
 *     "prompt_text": "Write a professional sales email to...",
 *     "agent_type": "sales",
 *     "tags": ["email", "sales", "template"],
 *     "created_at": "2025-07-04T18:35:22.123456",
 *     "updated_at": "2025-07-04T18:35:22.123456",
 *     "additional_metadata": {}
 *   },
 *   {
 *     "id": "0c52c1f7-1b77-4d6f-9e0e-3e75baff7461",
 *     "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
 *     "name": "Content Creation",
 *     "description": null,
 *     "prompt_text": "Create engaging content for...",
 *     "agent_type": "content",
 *     "tags": null,
 *     "created_at": "2025-07-03T10:02:11.987654",
 *     "updated_at": "2025-07-03T10:02:11.987654",
 *     "additional_metadata": {}
 *   }
 * ]
 * 
 * Example Error Response (400):
 * {"error": "Missing required query param: user_id"}
 * 
 * Example Error Response (404) - when filtering by type that doesn't exist:
 * []
 */
