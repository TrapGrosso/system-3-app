import { useQuery } from '@tanstack/react-query'

const getDeepSearchQueueItems = async (user_id) => {
  const response = await fetch(`https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/getDeepSearchQueueItems?user_id=${user_id}`, {
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

export const useGetDeepSearchQueueItems = (userId) => {
  return useQuery({
    queryKey: ['getDeepSearchQueueItems', userId],
    queryFn: () => getDeepSearchQueueItems(userId),
    staleTime: 30000,
    cacheTime: 300000,
    refetchInterval: 60000, 
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}


/**
 * Fetches all deep search queue items for a user with enriched prospect, prompts, and group data.
 * 
 * Example Request:
 * GET /getDeepSearchQueueItems?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f
 * 
 * Example Success Response (200):
 * [
 *   {
 *     "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
 *     "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
 *     "prospect_id": "john-doe-123",
 *     "created_at": "2025-07-04T18:35:22.123456",
 *     "prospect": {
 *       "linkedin_id": "john-doe-123",
 *       "company_id": "acme-corp",
 *       "first_name": "John",
 *       "last_name": "Doe",
 *       "headline": "Software Engineer at Acme Corp",
 *       "location": "San Francisco, CA",
 *       "status": "new",
 *       "email": "john@acme.com",
 *       "title": "Senior Software Engineer",
 *       "created_at": "2025-07-01T10:00:00.000000",
 *       "updated_at": "2025-07-01T10:00:00.000000"
 *     },
 *     "prompts": [
 *       {
 *         "id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *         "name": "LinkedIn Outreach",
 *         "description": "Generate personalized LinkedIn message",
 *         "prompt_text": "Write a personalized LinkedIn message...",
 *         "agent_type": "outreach",
 *         "tags": ["linkedin", "outreach"]
 *       },
 *       {
 *         "id": "7f8e9d0c-1b2a-3456-789e-f0123456789a",
 *         "name": "Follow-up Email",
 *         "description": "Generate follow-up email template",
 *         "prompt_text": "Write a follow-up email...",
 *         "agent_type": "email",
 *         "tags": ["email", "follow-up"]
 *       }
 *     ],
 *     "groups": [
 *       {
 *         "id": "group-uuid-1",
 *         "name": "Tech Prospects"
 *       },
 *       {
 *         "id": "group-uuid-2", 
 *         "name": "San Francisco"
 *       }
 *     ]
 *   }
 * ]
 * 
 * Example Error Response (400):
 * {"error": "Missing required query param: user_id"}
 */
