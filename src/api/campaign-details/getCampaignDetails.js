import { useQuery } from '@tanstack/react-query'

const getCampaignDetails = async (user_id, campaign_id) => {
  if (!user_id) {
    console.warn('getCampaignDetails: user_id is not defined. Returning null.')
    return null
  }
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/getCampaignDetails?user_id=${user_id}&campaign_id=${campaign_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch add lead logs')
  }

  const result = await response.json()
  
  return result || {}
}

export const usegetCampaignDetails = (userId, campaign_id) => {
  return useQuery({
    queryKey: ['getCampaignDetails', userId, campaign_id],
    queryFn: () => getCampaignDetails(userId, campaign_id),
    enabled: Boolean(userId), // Only run query if userId is defined
    staleTime: 30000, // 30 seconds 
    cacheTime: 300000, // 5 minutes cache
    refetchInterval: 60000, // Refetch every minute 
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}


/**
 * Fetches details for a specific campaign, including:
 * - campaign base info (owned by user)
 * - campaign analytics
 * - campaign step analytics mapped onto each step's variants
 * - all prospects related to the campaign with selected fields and company name
 *
 * Example Request:
 * GET /getCampaignDetails?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&campaign_id=fb42de3f-68f3-4295-8e5a-befd1053bcd2
 *
 * Example Success Response (200):
 * {
 *   "campaign": {
 *     "id": "fb42de3f-68f3-4295-8e5a-befd1053bcd2",
 *     "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
 *     "name": "My Email Campaign",
 *     "status": "active",
 *     "start_at": "2025-07-01",
 *     "end_at": null,
 *     "created_at": "2025-06-29T15:17:34.198751",
 *     "campaign_schedule": [
 *      {
 *        "days": {
 *          "1": true,
 *          "2": true,
 *          "3": true,
 *          "4": true,
 *          "5": true
 *        },
 *        "name": "New schedule",
 *        "timing": {
 *          "to": "18:00",
 *          "from": "09:00"
 *        },
 *        "timezone": "America/Detroit"
 *      }
 *    ],
 *     "campaign_sequence": [
 *       {
 *         "type": "email",
 *         "delay": 1,
 *         "variants": [
 *           {
 *             "body": "some email",
 *             "subject": "some subject",
 *             "analytics": {
 *               "sent": 10,
 *               "opened": 7,
 *               "unique_opened": 6,
 *               "replies": 1,
 *               "unique_replies": 1,
 *               "clicks": 2,
 *               "unique_clicks": 2,
 *               "updated_at": "2025-07-02T10:00:00"
 *             }
 *           }
 *         ],
 *         "step_totals": {
 *           "sent": 20,
 *           "opened": 13,
 *           "unique_opened": 11,
 *           "replies": 2,
 *           "unique_replies": 2,
 *           "clicks": 5,
 *           "unique_clicks": 5,
 *           "updated_at": "2025-07-02T10:00:00"
 *         }
 *       }
 *     ]
 *   },
 *   "analytics": {
 *     "campaign_is_evergreen": false,
 *     "leads_count": 0,
 *     "contacted_count": 0,
 *     "open_count": 0,
 *     "reply_count": 0,
 *     "link_click_count": 0,
 *     "bounced_count": 0,
 *     "unsubscribed_count": 0,
 *     "completed_count": 0,
 *     "emails_sent_count": 0,
 *     "new_leads_contacted_count": 0,
 *     "total_opportunities": 0,
 *     "total_opportunity_value": 0,
 *     "updated_at": null
 *   },
 *   "prospects": [
 *     {
 *       "linkedin_id": "annvanino",
 *       "first_name": "Ann",
 *       "last_name": "Vanino",
 *       "email": {
 *         "id": "uuid",
 *         "email": "ann@example.com",
 *         "status": "not_found",
 *         "created_at": "2025-07-01T00:00:00"
 *       },
 *       "title": "CEO",
 *       "company": "The Overnight Success Co."
 *     }
 *   ]
 * }
 *
 * Example Error Response (400):
 * {"error": "`user_id` (UUID) and `campaign_id` (UUID) are required as query parameters"}
 *
 * Example Error Response (404):
 * {"error": "Campaign not found"}
 */
