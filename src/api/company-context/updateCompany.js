import { useMutation } from '@tanstack/react-query'

const updateCompany = async (payload) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/updateCompany`, {
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

export const useUpdateCompany = (options = {}) => {
  return useMutation({
    mutationFn: updateCompany,
    onSuccess: (data) => {
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error updating company:', error)
      options.onError?.(error)
    },
  })
}


/**
 * Updates a company's properties after validating ownership and returns the updated company.
 * 
 * Example Payload (Full Update):
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "company_id": "distinctive-coaching",
 *   "updated_name": "Distinctive Coaching for Business Success",
 *   "updated_website": "https://distinctivecoaching.com/",
 *   "updated_industry": "Coaching",
 *   "updated_size": "1",
 *   "updated_location": "Oak Park, IL, US"
 * }
 * 
 * Example Payload (Partial Update):
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "company_id": "distinctive-coaching",
 *   "updated_industry": "Business Coaching"
 * }
 * 
 * Example Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "company": {
 *       "linkedin_id": "distinctive-coaching",
 *       "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *       "name": "Distinctive Coaching for Business Success",
 *       "website": "https://distinctivecoaching.com/",
 *       "industry": "Business Coaching",
 *       "size": "1",
 *       "location": "Oak Park, IL, US",
 *       "created_at": "2025-07-04T20:29:15.123456",
 *       "updated_at": "2025-07-06T16:14:30.123456"
 *     }
 *   },
 *   "message": "Company updated successfully",
 *   "timestamp": "2025-07-06T16:14:30.123Z"
 * }
 * 
 * Example Error Response (404):
 * {"error": "Company not found or you don't have permission to update it"}
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid user_id. Must be a valid UUID string"}
 */
