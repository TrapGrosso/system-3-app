import { useMutation } from '@tanstack/react-query'

const deleteDeepSearchQueueItems = async (payload) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/deleteDeepSearchQueueItems`, {
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
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error deleting deep search item(s):', error)
      options.onError?.(error)
    },
  })
}


/**
 * Deletes multiple deep search queue items by their IDs after validating ownership and returns deletion confirmation.
 * 
 * Table Structure (deep_search_queue):
 * - id: uuid (primary key)
 * - prospect_id: text (references prospect.linkedin_id)
 * - user_id: uuid (references users.id)
 * - created_at: timestamp
 * 
 * Example Payload:
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "queue_item_ids": [
 *     "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *     "0c52c1f7-1b77-4d6f-9e0e-3e75baff7461",
 *     "8a1b2c3d-4e5f-6789-abcd-ef0123456789"
 *   ]
 * }
 * 
 * Example Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "deleted": true,
 *     "items": [
 *       "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *       "0c52c1f7-1b77-4d6f-9e0e-3e75baff7461",
 *       "8a1b2c3d-4e5f-6789-abcd-ef0123456789"
 *     ],
 *     "count": 3
 *   },
 *   "message": "3 queue item(s) deleted successfully",
 *   "timestamp": "2025-01-12T15:27:45.123Z"
 * }
 * 
 * Example Error Response (404):
 * {"error": "Queue items not found or you don't have permission to delete them"}
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid user_id. Must be a valid UUID string"}
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid queue_item_ids. Must be an array of UUID strings"}
 */
