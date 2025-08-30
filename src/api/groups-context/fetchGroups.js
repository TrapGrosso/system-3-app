import { useQuery } from '@tanstack/react-query'

const fetchGroups = async (user_id) => {
  if (!user_id) {
    console.warn('fetchGroups: user_id is not defined. Returning null.')
    return null
  }
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetchGroups?user_id=${user_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch add groups')
  }

  const result = await response.json()
  
  // Extract only the data field from the response
  return result || []
}

export const useFetchGroups = (userId) => {
  return useQuery({
    queryKey: ['fetchGroups', userId],
    queryFn: () => fetchGroups(userId),
    enabled: Boolean(userId), // Only run query if userId is defined
    staleTime: 30000, // 30 seconds - logs are relatively fresh data
    cacheTime: 300000, // 5 minutes cache
    refetchInterval: 60000, // Refetch every minute to get latest logs
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

/**
 * Fetches all groups for a user with prospect counts.
 * 
 * Example Request:
 * GET /fetchGroups?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f
 * 
 * Example Success Response (200):
 * [
 *   {
 *     "id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *     "name": "some other group",
 *     "description": "IDK",
 *     "created_at": "2025-06-30T18:42:38.90691",
 *     "updated_at": "2025-06-30T18:42:38.90691",
 *     "prospect_count": 0
 *   },
 *   {
 *     "id": "3ecaa693-ee42-4e1a-82a9-7a959d719b15",
 *     "name": "test group",
 *     "description": "some description",
 *     "created_at": "2025-06-30T18:36:28.954714",
 *     "updated_at": "2025-06-30T18:36:28.954714",
 *     "prospect_count": 1
 *   }
 * ]
 * 
 * Example Error Response (400):
 * {"error": "Missing required query param: user_id"}
 */
