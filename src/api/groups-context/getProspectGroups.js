import { useQuery } from '@tanstack/react-query'

const getProspectGroups = async (user_id, prospect_id) => {
  if (!user_id) {
    console.warn('getProspectGroups: user_id is not defined. Returning null.')
    return null
  }
  const response = await fetch(`https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/getProspectGroups?user_id=${user_id}&prospect_id=${prospect_id}`, {
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

export const useGetProspectGroups = (userId, prospectId) => {
  return useQuery({
    queryKey: ['getProspectGroups', userId, prospectId],
    queryFn: () => getProspectGroups(userId, prospectId),
    enabled: Boolean(userId), // Only run query if userId is defined
    initialData: null, // Return null if query is not enabled
    staleTime: 30000, // 30 seconds - logs are relatively fresh data
    cacheTime: 300000, // 5 minutes cache
    refetchInterval: 60000, // Refetch every minute to get latest logs
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}


/**
 * Fetches all groups associated with a prospect for a specific user.
 * 
 * Example Request:
 * GET /getProspectGroups?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&prospect_id=john-doe-123
 * 
 * Example Success Response (200):
 * [
 *   {
 *     "id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *     "name": "Tech Prospects",
 *     "description": "Technology industry prospects",
 *     "created_at": "2025-06-30T18:42:38.90691",
 *     "updated_at": "2025-06-30T18:42:38.90691"
 *   },
 *   {
 *     "id": "3ecaa693-ee42-4e1a-82a9-7a959d719b15",
 *     "name": "High Priority",
 *     "description": "High priority prospects for immediate follow-up",
 *     "created_at": "2025-06-30T18:36:28.954714",
 *     "updated_at": "2025-06-30T18:36:28.954714"
 *   }
 * ]
 * 
 * Example Error Response (400):
 * {"error": "Missing required query param: user_id"}
 * 
 * Example Error Response (400):
 * {"error": "Missing required query param: prospect_id"}
 */
