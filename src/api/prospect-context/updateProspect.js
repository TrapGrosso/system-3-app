import { useMutation } from '@tanstack/react-query'

const updateProspect = async (payload) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/updateProspect`, {
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

export const useUpdateProspect = (options = {}) => {
  return useMutation({
    mutationFn: updateProspect,
    onSuccess: (data) => {
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error updating prospect:', error)
      options.onError?.(error)
    },
  })
}


/**
 * Updates a prospect's properties after validating ownership and returns the updated prospect.
 * 
 * Example Payload (Full Update):
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "prospect_id": "john-doe-123",
 *   "updated_company_linkedin_id": "company-abc-456",
 *   "updated_first_name": "John",
 *   "updated_last_name": "Doe",
 *   "updated_location": "New York, NY",
 *   "updated_status": "ready",
 *   "updated_title": "Senior Software Engineer"
 * }
 * 
 * Example Payload (Partial Update):
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "prospect_id": "john-doe-123",
 *   "updated_status": "archived"
 * }
 * 
 * Example Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "prospect": {
 *       "linkedin_id": "john-doe-123",
 *       "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *       "company_id": "company-abc-456",
 *       "first_name": "John",
 *       "last_name": "Doe",
 *       "headline": "Senior Software Engineer at Company ABC",
 *       "location": "New York, NY",
 *       "status": "ready",
 *       "email": "john.doe@example.com",
 *       "title": "Senior Software Engineer",
 *       "created_at": "2025-07-04T20:29:15.123456",
 *       "updated_at": "2025-07-06T16:14:30.123456"
 *     }
 *   },
 *   "message": "Prospect updated successfully",
 *   "timestamp": "2025-07-06T16:14:30.123Z"
 * }
 * 
 * Example Error Response (404):
 * {"error": "Prospect not found or you don't have permission to update it"}
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid user_id. Must be a valid UUID string"}
 * 
 * Example Error Response (400):
 * {"error": "Invalid updated_status. Must be one of: new, queued, researching, ready, archived"}
 */
