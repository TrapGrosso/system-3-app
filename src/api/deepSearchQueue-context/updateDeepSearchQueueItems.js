import { useMutation } from '@tanstack/react-query'

const updateDeepSearchQueueItems = async (payload) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/updateDeepSearchQueueItems`, {
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
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error updating deep search item(s):', error)
      options.onError?.(error)
    },
  })
}


/**
 * Replaces all prompt links for specified deep search queue items. This function performs a complete 
 * replacement - it deletes all existing prompt links for the queue items and creates new ones.
 * 
 * Example Payload:
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "prospect_ids": ["john-doe-123", "jane-smith-456", "bob-wilson-789"],
 *   "updated_prompt_ids": ["5d3e2f36-8db3-49c2-93e6-96bf9f632d66", "7f4g3h47-9ec4-50d3-a4f7-a7cg0g743e77"]
 * }
 * 
 * Example Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "processed_prospect_ids": ["john-doe-123", "jane-smith-456"],
 *     "skipped_prospect_ids": ["bob-wilson-789"]
 *   },
 *   "message": "Prompts replaced successfully",
 *   "timestamp": "2025-07-12T14:10:15.123Z"
 * }
 * 
 * Example Error Response (404):
 * {"error": "No queue items found for given user and prospects"}
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid user_id. Must be a valid UUID string"}
 * 
 * Example Error Response (400):
 * {"error": "updated_prompt_ids cannot exceed 50 items"}
 * 
 * Example Error Response (400):
 * {"error": "Operation would create 12000 rows, which exceeds the limit of 10,000"}
 */
