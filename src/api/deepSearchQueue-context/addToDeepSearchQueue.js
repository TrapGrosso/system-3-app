import { useMutation } from '@tanstack/react-query'

const addToDeepSearchQueue = async (payload) => {
  const response = await fetch('https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/addToDeepSearchQueue', {
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

export const useAddToDeepSearchQueue = (options = {}) => {
  return useMutation({
    mutationFn: addToDeepSearchQueue,
    onSuccess: (data) => {
      console.log('Successfully added to queue:', data)
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error adding to queue:', error)
      options.onError?.(error)
    },
  })
}


/**
 * Adds records to the deep_search_queue table and links them to prompts via deep_search_prompt_link.
 * Uses the new table structure where prompts are linked via a separate join table.
 * 
 * Example Payload:
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "prompt_ids": ["b666eceb-26ca-52gc-a7fe-2gfc754g33f8", "c777fdfc-37db-63hd-b8gf-3hgd865h44g9"],
 *   "prospect_ids": ["john-doe-123", "jane-smith-456"]
 * }
 * 
 * Example Success Response (201):
 * {
 *   "success": true,
 *   "data": {
 *     "queue_items": [
 *       {
 *         "id": "d888geec-48ec-74ie-c9hg-4ihe976i55h0",
 *         "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *         "prospect_id": "john-doe-123",
 *         "created_at": "2025-07-08T07:41:15.123456",
 *         "prompt_ids": ["b666eceb-26ca-52gc-a7fe-2gfc754g33f8", "c777fdfc-37db-63hd-b8gf-3hgd865h44g9"]
 *       },
 *       {
 *         "id": "e999hffd-59fd-85jf-d0ih-5jif087j66i1",
 *         "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *         "prospect_id": "jane-smith-456",
 *         "created_at": "2025-07-08T07:41:15.234567",
 *         "prompt_ids": ["b666eceb-26ca-52gc-a7fe-2gfc754g33f8", "c777fdfc-37db-63hd-b8gf-3hgd865h44g9"]
 *       }
 *     ]
 *   },
 *   "message": "2 queue records processed, 4 prompt links created",
 *   "timestamp": "2025-07-08T07:41:15.345Z"
 * }
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid user_id. Must be a valid UUID string"}
 * {"error": "prompt_ids cannot be empty"}
 * {"error": "All prompt_ids must be UUID strings"}
 */
