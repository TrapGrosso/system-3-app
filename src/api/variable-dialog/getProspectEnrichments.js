import { useQuery } from '@tanstack/react-query'

const getProspectEnrichments = async (user_id, prospectIds) => {
  const prospectIdsparams = prospectIds.join()

  const response = await fetch(`https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/getProspectEnrichments?user_id=${user_id}&prospect_ids=${prospectIdsparams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch tasks')
  }

  const result = await response.json()
  console.log(result)
  
  return result || []
}

export const useGetProspectEnrichments = (userId, prospectIds) => {
  return useQuery({
    queryKey: ['getProspectEnrichments', userId, prospectIds],
    queryFn: () => getProspectEnrichments(userId, prospectIds),
    staleTime: 30000,
    cacheTime: 300000,
    refetchInterval: 60000, 
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}


/**
 * Fetches enrichments for prospects in a prospect-centric format.
 * 
 * Example Request:
 * GET /getProspectEnrichments?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&prospect_ids=john-doe-123,jane-smith-456
 * 
 * Example Success Response (200):
 * [
 *   {
 *     "prospect_id": "john-doe-123",
 *     "first_name": "John",
 *     "last_name": "Doe",
 *     "company": { "linkedin_id": "acme-789", "name": "ACME Corp" },
 *     "prospectEnrichments": [
 *       {
 *         "id": "e1",
 *         "type": "profile",
 *         "source": "clearbit",
 *         "summary": {...},
 *         "created_at": "2025-07-20T12:00:00Z",
 *         "prompt": { "id": "p10", "name": "Summary Prompt" }
 *       }
 *     ],
 *     "companyEnrichments": [
 *       {
 *         "id": "e5",
 *         "type": "company_profile",
 *         "source": "clearbit",
 *         "summary": {...},
 *         "created_at": "2025-07-19T10:00:00Z",
 *         "prompt": null
 *       }
 *     ]
 *   }
 * ]
 * 
 * Example Error Response (400):
 * {"error": "Missing required query param: user_id"}
 */
