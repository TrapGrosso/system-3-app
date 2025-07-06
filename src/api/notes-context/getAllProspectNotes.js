import { useQuery } from '@tanstack/react-query'

const getAllProspectNotes = async (user_id, prospect_id) => {
  const response = await fetch(`https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/getAllProspectNotes?user_id=${user_id}&prospect_id=${prospect_id}`, {
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
  
  return result || []
}

export const useGetAllProspectNotes = (userId, prospect_id) => {
  return useQuery({
    queryKey: ['getAllProspectNotes', userId, prospect_id],
    queryFn: () => getAllProspectNotes(userId, prospect_id),
    staleTime: 30000, // 30 seconds - notes are relatively fresh data
    cacheTime: 300000, // 5 minutes cache
    refetchInterval: 60000, // Refetch every minute
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

/**
 * Fetches all notes for a specific prospect of a user.
 * 
 * Example Request:
 * GET /getAllProspectNotes?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&prospect_id=john-doe-123
 * 
 * Example Success Response (200):
 * [
 *   {
 *     "id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *     "prospect_id": "john-doe-123",
 *     "body": "Left a voicemail",
 *     "created_at": "2025-07-04T18:35:22.123456"
 *   },
 *   {
 *     "id": "0c52c1f7-1b77-4d6f-9e0e-3e75baff7461",
 *     "prospect_id": "john-doe-123",
 *     "body": "Follow up scheduled for next week",
 *     "created_at": "2025-07-03T10:02:11.987654"
 *   }
 * ]
 * 
 * Example Error Response (400):
 * {"error": "Missing required query param: user_id"}
 * {"error": "Missing required query param: prospect_id"}
 */
