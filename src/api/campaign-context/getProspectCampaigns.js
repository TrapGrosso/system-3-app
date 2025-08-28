import { useQuery } from '@tanstack/react-query'

const getProspectCampaigns = async (userId, prospectId) => {
  if (!userId) {
    console.warn('getProspectCampaigns: userId is not defined. Returning null.')
    return null
  }
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/getProspectCampaigns?user_id=${userId}&prospect_id=${prospectId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
    }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error)
  }

  return response.json()
}

export const useGetProspectCampaigns = (userId, prospectId) => {
  return useQuery({
    queryKey: ['campaigns', userId, prospectId],
    queryFn: () => getProspectCampaigns(userId, prospectId),
    enabled: Boolean(userId), // Only run query if userId is defined
    staleTime: 300000, // 5 minutes - campaigns are relatively stable
    cacheTime: 600000, // 10 minutes cache
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

/**
 * Fetches all campaigns associated with a prospect for a specific user.
 *
 * Example Request:
 * GET /getProspectCampaigns?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&prospect_id=john-doe-123
 *
 * Example Success Response (200):
 * [
 *   {
 *     "id": "7e1a6b15-8c9e-4a5e-b3d5-4e5b7b1a1234",
 *     "name": "Q3 Outreach",
 *     "status": "active",
 *     "start_at": "2025-07-01",
 *     "end_at": "2025-09-30",
 *     "created_at": "2025-06-20T10:12:34.56789"
 *   }
 * ]
 *
 * Example Error Response (400):
 * {"error": "Missing required query param: user_id"}
 *
 * Example Error Response (400):
 * {"error": "Missing required query param: prospect_id"}
 */
