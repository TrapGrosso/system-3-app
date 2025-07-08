import { useMutation } from '@tanstack/react-query'

const deleteDeepSearchQueueItems = async (payload) => {
  const response = await fetch('https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/deleteDeepSearchQueueItems', {
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

export const useDeleteDeepSearchQueueItems = (options = {}) => {
  return useMutation({
    mutationFn: deleteDeepSearchQueueItems,
    onSuccess: (data) => {
      console.log('Deep search item(s) deleted successfully:', data)
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error deleting deep search item(s):', error)
      options.onError?.(error)
    },
  })
}

/**
 * Deletes multiple deep search queue items after validating ownership and returns deletion confirmation.
 * 
 * Example Payload:
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "prospect_prompt_ids": [
 *     {
 *       "prospect_id": "john-doe-linkedin",
 *       "prompt_id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66"
 *     },
 *     {
 *       "prospect_id": "jane-smith-linkedin", 
 *       "prompt_id": "0c52c1f7-1b77-4d6f-9e0e-3e75baff7461"
 *     }
 *   ]
 * }
 * 
 * Example Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "deleted": true,
 *     "items": [
 *       {
 *         "prospect_id": "john-doe-linkedin",
 *         "prompt_id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66"
 *       },
 *       {
 *         "prospect_id": "jane-smith-linkedin",
 *         "prompt_id": "0c52c1f7-1b77-4d6f-9e0e-3e75baff7461"
 *       }
 *     ],
 *     "count": 2
 *   },
 *   "message": "2 queue item(s) deleted successfully",
 *   "timestamp": "2025-07-08T19:39:45.123Z"
 * }
 * 
 * Example Error Response (404):
 * {"error": "Queue items not found or you don't have permission to delete them"}
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid user_id. Must be a valid UUID string"}
 */