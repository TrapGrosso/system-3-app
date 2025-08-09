import { useQuery } from '@tanstack/react-query'

const fetchCampaigns = async (userId) => {
  const response = await fetch(`https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/getAllCampaigns?user_id=${userId}`, {
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

export const useFetchCampaigns = (userId) => {
  return useQuery({
    queryKey: ['campaigns', userId],
    queryFn: () => fetchCampaigns(userId),
    staleTime: 300000, // 5 minutes - campaigns are relatively stable
    cacheTime: 600000, // 10 minutes cache
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}


/**
 * Fetches all campaigns for a user with prospect counts.
 * 
 * Example Request:
 * GET /getAllCampaigns?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f
 * 
 * Example Success Response (200):
 * [
 *   {
 *     "id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *     "name": "Q3 Outreach Campaign",
 *     "start_at": "2025-07-01",
 *     "end_at": "2025-09-30",
 *     "status": "active",
 *     "campaign_schedule": {"frequency": "daily", "time": "09:00"},
 *     "created_at": "2025-07-04T18:35:22.123456",
 *     "prospect_count": 150
 *   },
 *   {
 *     "id": "0c52c1f7-1b77-4d6f-9e0e-3e75baff7461",
 *     "name": "Holiday Campaign",
 *     "start_at": "2025-12-01",
 *     "end_at": "2025-12-31",
 *     "status": "pending",
 *     "campaign_schedule": null,
 *     "created_at": "2025-07-03T10:02:11.987654",
 *     "prospect_count": 0
 *   }
 * ]
 * 
 * Example Error Response (400):
 * {"error": "Missing required query param: user_id"}
 */
