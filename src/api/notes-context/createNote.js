import { useMutation } from '@tanstack/react-query'

const createNote = async (payload) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/createNote`, {
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

export const useCreateNote = (options = {}) => {
  return useMutation({
    mutationFn: createNote,
    onSuccess: (data) => {
      console.log('Group creating note:', data)
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error creating note:', error)
      options.onError?.(error)
    },
  })
}

/**
 * Creates notes for an array of prospects or a general note if no prospects specified.
 * 
 * Example Payload (Multiple prospects):
 * {
 *   "prospect_ids": ["john-doe-123", "jane-smith-456"],
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "note_body": "Left voicemail, will follow up tomorrow"
 * }
 * 
 * Example Payload (General note):
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "note_body": "General note for the day"
 * }
 * 
 * Example Success Response (201):
 * {
 *   "success": true,
 *   "data": {
 *     "notes": [
 *       {
 *         "id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *         "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *         "prospect_id": "john-doe-123",
 *         "body": "Left voicemail, will follow up tomorrow",
 *         "created_at": "2025-07-04T20:29:15.123456"
 *       },
 *       {
 *         "id": "0c52c1f7-1b77-4d6f-9e0e-3e75baff7461",
 *         "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *         "prospect_id": "jane-smith-456",
 *         "body": "Left voicemail, will follow up tomorrow",
 *         "created_at": "2025-07-04T20:29:15.234567"
 *       }
 *     ]
 *   },
 *   "message": "2 note(s) created successfully",
 *   "timestamp": "2025-07-04T20:29:15.345Z"
 * }
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid user_id. Must be a valid UUID string"}
 */