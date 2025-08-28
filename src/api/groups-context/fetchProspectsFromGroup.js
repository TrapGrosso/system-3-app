import { useQuery } from '@tanstack/react-query'

const fetchProspectsFromGroup = async (user_id, group_id) => {
  if (!user_id) {
    console.warn('fetchProspectsFromGroup: user_id is not defined. Returning null.')
    return null
  }
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetchProspectsFromGroup?user_id=${user_id}&group_id=${group_id}`, {
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
  console.log(result)
  
  // Extract only the data field from the response
  return result || []
}

export const useFetchProspectsFromGroup = (userId, groupId) => {
  return useQuery({
    queryKey: ['fetchProspectsFromGroup', userId, groupId],
    queryFn: () => fetchProspectsFromGroup(userId, groupId),
    enabled: Boolean(userId) && Boolean(groupId), // Only run query if userId is defined
    staleTime: 30000, // 30 seconds - logs are relatively fresh data
    cacheTime: 300000, // 5 minutes cache
    refetchInterval: 60000, // Refetch every minute to get latest logs
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

/**
 * Fetches all prospects for a specific group of a user.
 * 
 * Example Request:
 * GET /fetchProspectsFromGroup?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&group_id=3ecaa693-ee42-4e1a-82a9-7a959d719b15
 * 
 * Example Success Response (200):
 * [
 *   {
 *     "linkedin_id": "john-doe-123",
 *     "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
 *     "company_id": "apple-001",
 *     "first_name": "John",
 *     "last_name": "Doe",
 *     "headline": "AE @ Apple",
 *     "location": "San Francisco, CA",
 *     "status": "new",
 *     "email": "john@apple.com",
 *     "title": "Account Executive",
 *     "custom_vars": {},
 *     "created_at": "2025-07-04T18:35:22.123456",
 *     "updated_at": "2025-07-05T08:11:02.987654"
 *   }
 * ]
 * 
 * Example Error Response (400):
 * {"error": "Missing required query param: user_id"}
 * {"error": "Missing required query param: group_id"}
 * 
 * Example Error Response (404):
 * {"error": "Group not found for user"}
 */
