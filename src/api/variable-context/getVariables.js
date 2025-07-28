import { useQuery } from '@tanstack/react-query'

const getVariables = async (params) => {
  // Build query string, omitting undefined/null values
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value)
    }
  })
  
  const response = await fetch(`https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/getVariables?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error)
  }

  const result = await response.json()
  
  return result
}

// Hook for server-side filtered/sorted/paginated prospects
export const useGetVariables = ({ userId, prospect_id = null }) => {
  return useQuery({
    queryKey: ['prospects', userId, prospect_id],
    queryFn: () => getVariables({ user_id: userId, prospect_id }),
    keepPreviousData: true, // Keep old data visible while refetching
    staleTime: 60000, // 60 seconds - prospects data is relatively stable
    cacheTime: 300000, // 5 minutes cache
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000* 2** attemptIndex, 30000),
  })
}


/**
 * Fetches all variables for a user, optionally filtered by prospect_id.
 * 
 * Example Request:
 * GET /getVariables?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f
 * GET /getVariables?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&prospect_id=john-doe-123
 * 
 * Example Success Response (200):
 * [
 *   {
 *     "id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *     "prospect_id": "john-doe-123",
 *     "prompt_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
 *     "name": "company_name",
 *     "value": "Acme Corp",
 *     "enrichment_ids": ["enrich_001", "enrich_002"],
 *     "created_at": "2025-07-04T18:35:22.123456",
 *     "updated_at": "2025-07-04T18:35:22.123456"
 *   },
 *   {
 *     "id": "0c52c1f7-1b77-4d6f-9e0e-3e75baff7461",
 *     "prospect_id": null,
 *     "prompt_id": null,
 *     "name": "global_setting",
 *     "value": "true",
 *     "enrichment_ids": null,
 *     "created_at": "2025-07-03T10:02:11.987654",
 *     "updated_at": "2025-07-03T10:02:11.987654"
 *   }
 * ]
 * 
 * Example Error Response (400):
 * {"error": "Missing required query param: user_id"}
 * {"error": "Invalid user_id format. Must be a valid UUID"}
 */
