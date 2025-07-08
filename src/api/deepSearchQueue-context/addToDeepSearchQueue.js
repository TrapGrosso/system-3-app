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
 * Adds records to the deep_search_queue table with validation and duplicate handling.
 * 
 * Example Payload:
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "prompt_id": "b666eceb-26ca-52gc-a7fe-2gfc754g33f8",
 *   "prospect_ids": ["john-doe-123", "jane-smith-456"]
 * }
 * 
 * Example Success Response (201):
 * {
 *   "success": true,
 *   "data": {
 *     "queue_items": [
 *       {
 *         "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *         "prospect_id": "john-doe-123",
 *         "prompt_id": "b666eceb-26ca-52gc-a7fe-2gfc754g33f8",
 *         "created_at": "2025-07-08T07:41:15.123456"
 *       },
 *       {
 *         "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *         "prospect_id": "jane-smith-456",
 *         "prompt_id": "b666eceb-26ca-52gc-a7fe-2gfc754g33f8",
 *         "created_at": "2025-07-08T07:41:15.234567"
 *       }
 *     ]
 *   },
 *   "message": "2 records added to deep_search_queue",
 *   "timestamp": "2025-07-08T07:41:15.345Z"
 * }
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid user_id. Must be a valid UUID string"}
 */