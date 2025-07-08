import { useMutation } from '@tanstack/react-query'

const updateDeepSearchQueueItems = async (payload) => {
  const response = await fetch('https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/updateDeepSearchQueueItems', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error)
  }

  return response.json()
}

export const useUpdateDeepSearchQueueItems = (options = {}) => {
  return useMutation({
    mutationFn: updateDeepSearchQueueItems,
    onSuccess: (data) => {
      console.log('Deep search item(s) updated successfully:', data)
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error updating deep search item(s):', error)
      options.onError?.(error)
    },
  })
}

/**
 * Updates prompt_id for deep search queue items, skipping duplicates and returning both updated and skipped prospect IDs.
 * 
 * Example Payload:
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "prospect_ids": ["john-doe-123", "jane-smith-456", "bob-wilson-789"],
 *   "updated_prompt_id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66"
 * }
 * 
 * Example Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "updated_prospect_ids": ["john-doe-123", "bob-wilson-789"],
 *     "skipped_prospect_ids": ["jane-smith-456"]
 *   },
 *   "message": "Queue items processed successfully",
 *   "timestamp": "2025-07-08T19:30:45.123Z"
 * }
 * 
 * Example Error Response (404):
 * {"error": "No queue items found for given user and prospects"}
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid user_id. Must be a valid UUID string"}
 * 
 * Example Error Response (400):
 * {"error": "prospect_ids cannot exceed 500 items"}
 */