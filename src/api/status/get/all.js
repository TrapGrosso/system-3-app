import { useQuery } from '@tanstack/react-query'

const getStatusAll = async (user_id) => {
  if (!user_id) {
    console.warn('getStatusAll: user_id is not defined. Returning null.')
    return null
  }
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/status/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch prompts')
  }

  const result = await response.json()
  
  return result || []
}

export const useGetStatusAll = (userId) => {
  return useQuery({
    queryKey: ['getStatusAll', userId],
    queryFn: () => getStatusAll(userId),
    enabled: Boolean(userId), // Only run query if userId is defined
    staleTime: 30000,
    cacheTime: 300000,
    refetchInterval: 60000, 
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

/**
 * Get all statuses as a flat array
 * 
 * This endpoint fetches all status records from the database and returns them
 * as a simple array without any pagination or metadata wrapper.
 * 
 * @param req - The HTTP request
 * @param ctx - The context containing Supabase client and other utilities
 * @returns Response with array of status objects
 * 
 * Response format:
 * [
 *   {
 *     "id": "uuid-string",
 *     "status": "status-name",
 *     "description": "optional description",
 *     "color": "hex-color-code",
 *     "created_at": "ISO timestamp",
 *     "updated_at": "ISO timestamp"
 *   },
 *   ...
 * ]
 * 
 * Error responses:
 * - 404: Route not found
 * - 500: Database error or internal server error
 * 
 * Example usage:
 * GET /functions/v1/status/all
 * 
 * Response:
 * [
 *   {
 *     "id": "11111111-2222-3333-4444-555555555555",
 *     "status": "new",
 *     "description": "New prospect",
 *     "color": "#007bff",
 *     "created_at": "2025-01-01T00:00:00Z",
 *     "updated_at": "2025-01-01T00:00:00Z"
 *   },
 *   {
 *     "id": "22222222-3333-4444-5555-666666666666",
 *     "status": "contacted",
 *     "description": "Contacted prospect",
 *     "color": "#28a745",
 *     "created_at": "2025-01-01T00:00:00Z",
 *     "updated_at": "2025-01-01T00:00:00Z"
 *   }
 * ]
 */