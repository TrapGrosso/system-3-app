import { useMutation } from '@tanstack/react-query'

const updateNote = async (payload) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/updateNote`, {
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

export const useUpdateNote = (options = {}) => {
  return useMutation({
    mutationFn: updateNote,
    onSuccess: (data) => {
      console.log('Note updated successfully:', data)
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error updating note:', error)
      options.onError?.(error)
    },
  })
}

/**
 * Updates a note's content after validating ownership and returns the updated note.
 * 
 * Example Payload:
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "note_id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *   "updated_content": "Updated note content with new information"
 * }
 * 
 * Example Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "note": {
 *       "id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *       "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *       "prospect_id": "john-doe-123",
 *       "body": "Updated note content with new information",
 *       "created_at": "2025-07-04T20:29:15.123456"
 *     }
 *   },
 *   "message": "Note updated successfully",
 *   "timestamp": "2025-07-06T16:14:30.123Z"
 * }
 * 
 * Example Error Response (404):
 * {"error": "Note not found or you don't have permission to update it"}
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid user_id. Must be a valid UUID string"}
 */