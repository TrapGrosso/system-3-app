import { useQuery } from '@tanstack/react-query'

const fetchProspects = async (user_id) => {
  const response = await fetch(`https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/getAllProspects?user_id=${user_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch prospects')
  }

  const result = await response.json()
  
  // Extract only the data field from the response
  return result || []
}

export const useFetchProspects = (userId) => {
  return useQuery({
    queryKey: ['prospects', userId],
    queryFn: () => fetchProspects(userId),
    staleTime: 60000, // 60 seconds - prospects data is relatively stable
    cacheTime: 300000, // 5 minutes cache
    refetchInterval: 120000, // Refetch every 2 minutes to get latest prospects
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

/**
 * Fetches all prospects for a user with enriched data including groups and campaigns.
 * 
 * Example Request:
 * GET /getAllProspects?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f
 * 
 * Example Success Response (200):
 * [
 *   {
 *     "linkedin_id": "elizaveta-sheshko",
 *     "first_name": "Lizaveta",
 *     "last_name": "Sheshka",
 *     "headline": "IT Innovations Manager | FTECH",
 *     "title": "IT Innovation Manager",
 *     "status": "new",
 *     "location": "Poland",
 *     "email": null,
 *     "company_name": null,
 *     "has_bd_scrape": true,
 *     "has_deep_search": false,
 *     "note_count": 0,
 *     "task_count": 0,
 *     "groups": [
 *       {
 *         "id": "3ecaa693-ee42-4e1a-82a9-7a959d719b15",
 *         "name": "test group"
 *       },
 *       {
 *         "id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *         "name": "some other group"
 *       }
 *     ],
 *     "campaigns": []
 *   },
 *   {
 *     "linkedin_id": "adamjtraub",
 *     "first_name": "Adam",
 *     "last_name": "Traub",
 *     "headline": "Franchise Business Coach",
 *     "title": "Franchise Business Coach",
 *     "status": "new",
 *     "location": "Carlsbad, California, United States",
 *     "email": null,
 *     "company_name": null,
 *     "has_bd_scrape": true,
 *     "has_deep_search": false,
 *     "note_count": 0,
 *     "task_count": 0,
 *     "groups": [
 *       {
 *         "id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *         "name": "some other group"
 *       },
 *       {
 *         "id": "3ecaa693-ee42-4e1a-82a9-7a959d719b15",
 *         "name": "test group"
 *       }
 *     ],
 *     "campaigns": []
 *   }
 * ]
 * 
 * Example Error Response (400):
 * {"error": "Missing required query param: user_id"}
 */
