import { useQuery } from '@tanstack/react-query'

const getProspectDetails = async (user_id, prospect_id) => {
  const response = await fetch(`https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/getProspectDetails?user_id=${user_id}&prospect_id=${prospect_id}`, {
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
  
  // Extract only the data field from the response
  return result || []
}

export const usegetProspectDetails = (userId, prospect_id) => {
  return useQuery({
    queryKey: ['getProspectDetails', userId, prospect_id],
    queryFn: () => getProspectDetails(userId, prospect_id),
    staleTime: 30000, // 30 seconds - logs are relatively fresh data
    cacheTime: 300000, // 5 minutes cache
    refetchInterval: 60000, // Refetch every minute to get latest logs
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

/**
 * Fetches detailed information for a specific prospect, including associated company, enrichments, notes, tasks, campaigns, and groups.
 * 
 * Example Request:
 * GET /getProspectDetails?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&prospect_id=annvanino
 * 
 * Example Success Response (200):
 * {
 *     "prospect": {
 *       "linkedin_id": "carlosdeleonlang",
 *       "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
 *       "company_id": "delxico",
 *       "first_name": "Carlos",
 *       "last_name": "Deleon",
 *       "headline": "Helping New Leaders Transition with Confidence Ranked among San Antonio’s Top 15…",
 *       "location": "San Antonio",
 *       "status": "new",
 *       "email": null,
 *       "title": "",
 *       "custom_vars": {},
 *       "created_at": "2025-06-14T19:39:55.513832",
 *       "updated_at": "2025-06-14T19:39:55.513832"
 *     },
 *     "company": {
 *       "linkedin_id": "delxico",
 *       "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
 *       "name": "Delxico Consulting, LLC",
 *       "website": "https://www.delxico.com/",
 *       "industry": "Business Consulting and Services",
 *       "size": "3",
 *       "location": "San Antonio, Texas 78256, US",
 *       "extra": {},
 *       "created_at": "2025-06-14T19:39:55.344781",
 *       "updated_at": "2025-06-14T19:39:55.344781"
 *     },
 *     "enrichment": {
 *       "prospect": [
 *         {
 *           "id": "44daa173-1bf5-48a2-b739-c210393e054a",
 *           "type": "bd_scrape",
 *           "source": "linkedin",
 *           "raw_data": "{linkedin scrape raw}",
 *           "summary": null,
 *           "created_at": "2025-06-14T19:39:55.225607"
 *         }
 *       ],
 *       "company": [
 *         {
 *           "id": "c3192c9e-e375-4047-9062-0792b87dd74e",
 *           "type": "bd_scrape",
 *           "source": "linkedin",
 *           "raw_data": "{linkedin scrape raw}",
 *           "summary": null,
 *           "created_at": "2025-06-14T19:39:55.089519"
 *         }
 *       ]
 *     },
 *     "notes": [
 *       {
 *         "id": "3e0ee4ed-e3c7-4a04-9d15-e7493deec8e4",
 *         "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
 *         "prospect_id": "carlosdeleonlang",
 *         "body": "SOME NOTE",
 *         "created_at": "2025-06-29T15:15:59.615752"
 *       }
 *     ],
 *     "tasks": [
 *       {
 *         "id": "a27f37e9-ccb0-468d-a3cf-beec772cc914",
 *         "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
 *         "prospect_id": "carlosdeleonlang",
 *         "title": "Some title",
 *         "description": "some description",
 *         "due_date": "2025-07-01",
 *         "status": "open",
 *         "created_at": "2025-06-29T15:16:48.706565"
 *       }
 *     ],
 *     "campaigns": [
 *       {
 *         "added_at": "2025-06-29T17:18:07",
 *         "campaign": {
 *           "id": "fb42de3f-68f3-4295-8e5a-befd1053bcd2",
 *           "name": "some name",
 *           "end_at": null,
 *           "start_at": "2025-07-01",
 *           "created_at": "2025-06-29T15:17:34.198751"
 *         }
 *       }
 *     ],
 *     "groups": [
 *       {
 *         "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
 *         "name": "My Awesome Group",
 *         "description": "A group for awesome prospects",
 *         "created_at": "2025-06-29T15:17:34.198751"
 *       }
 *     ]
 *   }
 * 
 * Example Error Response (400):
 * {"error": "`user_id` (string) and `prospect_id` (string) are required as query parameters"}
 */