import { useQuery } from '@tanstack/react-query'

const getAllProspectTasks = async (user_id, prospect_id) => {
  if (!user_id) {
    console.warn('getAllProspectTasks: user_id is not defined. Returning null.')
    return null
  }
  const response = await fetch(`https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/getAllProspectTasks?user_id=${user_id}&prospect_id=${prospect_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch prospect tasks')
  }

  const result = await response.json()
  console.log(result)
  
  return result || []
}

export const useGetAllProspectTasks = (userId, prospect_id) => {
  return useQuery({
    queryKey: ['getAllProspectTasks', userId, prospect_id],
    queryFn: () => getAllProspectTasks(userId, prospect_id),
    enabled: Boolean(userId), // Only run query if userId is defined
    staleTime: 30000, // 30 seconds - notes are relatively fresh data
    cacheTime: 300000, // 5 minutes cache
    refetchInterval: 60000, // Refetch every minute
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

/**
 * Fetches all tasks for a specific prospect of a user.
 * 
 * Example Request:
 * GET /getAllProspectTasks?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&prospect_id=john-doe-123
 * 
 * Example Success Response (200):
 * [
 *   {
 *     "id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *     "prospect_id": "john-doe-123",
 *     "title": "Follow up call",
 *     "description": "Call John to discuss the proposal",
 *     "due_date": "2025-07-10",
 *     "status": "open",
 *     "created_at": "2025-07-04T18:35:22.123456"
 *   },
 *   {
 *     "id": "0c52c1f7-1b77-4d6f-9e0e-3e75baff7461",
 *     "prospect_id": "john-doe-123",
 *     "title": "Send proposal document",
 *     "description": "Email the updated proposal to John",
 *     "due_date": "2025-07-08",
 *     "status": "in_progress",
 *     "created_at": "2025-07-03T10:02:11.987654"
 *   }
 * ]
 * 
 * Example Error Response (400):
 * {"error": "Missing required query param: user_id"}
 * {"error": "Missing required query param: prospect_id"}
 */
