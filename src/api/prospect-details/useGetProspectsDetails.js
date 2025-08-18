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
 * Fetches detailed information for a specific prospect, including associated company, variables, enrichments, notes, tasks, campaigns, groups, and deep search queue status.
 * 
 * Example Request:
 * GET /getProspectDetails?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&prospect_id=annvanino
 * 
 * Example Success Response (200):
 * {
 *   "prospect": {
 *     "linkedin_id": "carlosdeleonlang",
 *     "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
 *     "company_id": "delxico",
 *     "first_name": "Carlos",
 *     "last_name": "Deleon",
 *     "headline": "Helping New Leaders Transition with Confidence Ranked among San Antonio's Top 15…",
 *     "location": "San Antonio",
 *     "status": "new",
 *     "email": {
 *       "id": "some-uuid-for-email",
 *       "email": "carlos@example.com",
 *       "status": "verified",
 *       "created_at": "2025-06-14T19:39:55.513832",
 *       "verifications": [
 *         {
 *           "id": "some-uuid-for-verification",
 *           "verification_status": "deliverable",
 *           "safe_to_send": "yes",
 *           "verified_on": "2025-06-14T19:39:55.513832",
 *           "disposable": "no",
 *           "free": "no",
 *           "role": "no",
 *           "gibberish": "no",
 *           "bounce_type": null,
 *           "created_at": "2025-06-14T19:39:55.513832"
 *         }
 *       ]
 *     },
 *     "title": "",
 *     "created_at": "2025-06-14T19:39:55.513832",
 *     "updated_at": "2025-06-14T19:39:55.513832"
 *   },
 *   "company": {
 *     "linkedin_id": "delxico",
 *     "name": "Delxico Consulting, LLC",
 *     "website": "https://www.delxico.com/",
 *     "industry": "Business Consulting and Services",
 *     "size": 3,
 *     "location": "San Antonio, Texas 78256, US",
 *     "extra": {},
 *     "created_at": "2025-06-14T19:39:55.344781",
 *     "updated_at": "2025-06-14T19:39:55.344781"
 *   },
 *   "variables": [
 *     {
 *       "id": "d4508141-7727-418a-87a3-a10339bcbfa7",
 *       "name": "company_focus",
 *       "value": "Leadership consulting and business transformation",
 *       "created_at": "2025-06-29T15:16:48.706565",
 *       "updated_at": "2025-06-29T15:16:48.706565",
 *       "prompt": {
 *         "id": "11111111-2222-3333-4444-555555555555",
 *         "name": "Extract Company Focus",
 *         "agent_type": "extractor"
 *       },
 *       "enrichments": [
 *         {
 *           "id": "44daa173-1bf5-48a2-b739-c210393e054a",
 *           "type": "bd_scrape",
 *           "source": "linkedin",
 *           "prompt": {
 *             "id": "aaaa-bbbb-cccc-dddd-eeeeffff0001",
 *             "name": "LinkedIn Scrape",
 *             "agent_type": "scraper"
 *           }
 *         }
 *       ]
 *     }
 *   ],
 *   "enrichment": {
 *     "prospect": [
 *       {
 *         "id": "99daa173-1bf5-48a2-b739-c210393e0999",
 *         "type": "bio_summary",
 *         "source": "openai",
 *         "raw_data": "{model output}",
 *         "summary": {"bio": "Short bio..."},
 *         "created_at": "2025-06-20T09:10:11.123456",
 *         "prompt": {
 *           "id": "p1a2b3c4-d5e6-f789-0123-456789abcdef",
 *           "name": "Summarize Bio",
 *           "agent_type": "generator"
 *         }
 *       }
 *     ],
 *     "company": [
 *       {
 *         "id": "c3192c9e-e375-4047-9062-0792b87dd74e",
 *         "type": "bd_scrape",
 *         "source": "linkedin",
 *         "raw_data": "{linkedin scrape raw}",
 *         "summary": null,
 *         "created_at": "2025-06-14T19:39:55.089519",
 *         "prompt": {
 *           "id": "bbbbbbbb-cccc-dddd-eeee-ffffffff0002",
 *           "name": "Company Scrape",
 *           "agent_type": "scraper"
 *         }
 *       }
 *     ]
 *   },
 *   "notes": [
 *     {
 *       "id": "3e0ee4ed-e3c7-4a04-9d15-e7493deec8e4",
 *       "body": "SOME NOTE",
 *       "created_at": "2025-06-29T15:15:59.615752"
 *     }
 *   ],
 *   "tasks": [
 *     {
 *       "id": "a27f37e9-ccb0-468d-a3cf-beec772cc914",
 *       "title": "Some title",
 *       "description": "some description",
 *       "due_date": "2025-07-01",
 *       "status": "open",
 *       "created_at": "2025-06-29T15:16:48.706565"
 *     }
 *   ],
 *   "campaigns": [
 *     {
 *       "added_at": "2025-06-29T17:18:07",
 *       "campaign": {
 *         "id": "fb42de3f-68f3-4295-8e5a-befd1053bcd2",
 *         "name": "some name",
 *         "end_at": null,
 *         "start_at": "2025-07-01",
 *         "created_at": "2025-06-29T15:17:34.198751"
 *       }
 *     }
 *   ],
 *   "groups": [
 *     {
 *       "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
 *       "name": "My Awesome Group",
 *       "description": "A group for awesome prospects",
 *       "created_at": "2025-06-29T15:17:34.198751"
 *     }
 *   ],
 *   "deep_search": {
 *     "is_in_queue": true,
 *     "queue_id": "f1e2d3c4-b5a6-9876-5432-10fedcba9876",
 *     "created_at": "2025-06-29T15:17:34.198751",
 *     "prompts": [
 *       {
 *         "id": "p1a2b3c4-d5e6-f789-0123-456789abcdef",
 *         "name": "Initial Research",
 *         "description": "Gather basic company and prospect information",
 *         "agent_type": "researcher"
 *       },
 *       {
 *         "id": "p2b3c4d5-e6f7-8901-2345-6789abcdef01",
 *         "name": "Deep Analysis",
 *         "description": "Perform comprehensive market and competitive analysis",
 *         "agent_type": "analyst"
 *       }
 *     ]
 *   },
 *   "logs": [
 *     {
 *       "id": "f1e2d3c4-b5a6-9876-5432-10fedcba9876",
 *       "action": "add_leads",
 *       "status": "success",
 *       "start_time": "2025-08-01T10:00:00",
 *       "end_time": "2025-08-01T10:00:03",
 *       "duration_ms": 3450,
 *       "prospect_success": true,
 *       "prospect_result": { "added_variables": 4 },
 *       "prospect_created_at": "2025-08-01T10:00:00"
 *     }
 *   ]
 * }
 * 
 * Example Error Response (400):
 * {"error": "`user_id` (string) and `prospect_id` (string) are required as query parameters"}
 */
