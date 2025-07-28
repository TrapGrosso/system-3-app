import { useMutation } from '@tanstack/react-query'

const createVariable = async (payload) => {
  const response = await fetch('https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/createVariable', {
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

export const useCreateVariable = (options = {}) => {
  return useMutation({
    mutationFn: createVariable,
    onSuccess: (data) => {
      console.log('Variable created successfully:', data)
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error creating variable:', error)
      options.onError?.(error)
    },
  })
}


/**
 * Creates a new variable with validation and returns the created variable details.
 * 
 * Example Payload:
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "prospect_id": "john-doe-123",
 *   "variable_name": "company",
 *   "variable_value": "Acme Inc."
 * }
 * 
 * Example Success Response (201):
 * {
 *   "success": true,
 *   "data": {
 *     "variable": {
 *       "id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *       "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *       "prompt_id": null,
 *       "prospect_id": "john-doe-123",
 *       "name": "company",
 *       "value": "Acme Inc.",
 *       "created_at": "2025-07-28T15:46:15.123456",
 *       "updated_at": "2025-07-28T15:46:15.123456",
 *       "enrichment_ids": null
 *     }
 *   },
 *   "message": "Variable created successfully",
 *   "timestamp": "2025-07-28T15:46:15.345Z"
 * }
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid user_id. Must be a valid UUID string"}
 * {"error": "Missing or invalid prospect_id. Must be a non-empty string"}
 */
