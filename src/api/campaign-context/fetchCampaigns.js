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
 *    {
 *        "id": "6c872a06-15bb-4ef8-ac13-bd5a79bbf4c9",
 *        "name": "Demo Campaign",
 *        "start_at": null,
 *        "end_at": null,
 *        "status": "Draft",
 *        "campaign_schedule": {
 *          "end_date": "",
 *          "schedules": [
 *            {
 *              "days": {
 *                "1": true,
 *                "2": true,
 *                "3": true,
 *                "4": true,
 *                "5": true
 *              },
 *              "name": "New schedule",
 *              "timing": {
 *                "to": "18:00",
 *                "from": "09:00"
 *              },
 *              "timezone": "America/Detroit"
 *            }
 *          ],
 *          "start_date": ""
 *        },
 *        "campaign_sequence": [
 *          {
 *            "type": "email",
 *            "delay": 1,
 *            "variants": [
 *              {
 *                "body": "some email",
 *                "subject": "some subject"
 *              }
 *            ]
 *          },
 *          {
 *            "type": "email",
 *            "delay": 1,
 *            "variants": [
 *              {
 *                "body": "some other email",
 *                "subject": ""
 *              }
 *            ]
 *          }
 *        ],
 *        "created_at": "2025-08-08T11:37:52.798",
 *        "prospect_count": 2
 *      }
 * ]
 * 
 * Example Error Response (400):
 * {"error": "Missing required query param: user_id"}
 */
