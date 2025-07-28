import { useMutation } from '@tanstack/react-query'

const updateVariable = async (payload) => {
  const response = await fetch('https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/updateVariable', {
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

export const useUpdateVariable = (options = {}) => {
  return useMutation({
    mutationFn: updateVariable,
    onSuccess: (data) => {
      console.log('Variable updated successfully:', data)
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error updating variable:', error)
      options.onError?.(error)
    },
  })
}

/**
 * Updates a variable's properties after validating ownership and returns the updated variable.
 * 
 * Example Payload (Full Update):
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "variable_id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *   "updated_name": "prospect_company_name",
 *   "updated_value": "Acme Corporation"
 * }
 * 
 * Example Payload (Partial Update - Name Only):
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "variable_id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *   "updated_name": "prospect_industry"
 * }
 * 
 * Example Payload (Partial Update - Value Only):
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "variable_id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *   "updated_value": "Technology Services"
 * }
 * 
 * Example Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "variable": {
 *       "id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *       "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *       "prompt_id": "abc12345-6789-def0-1234-56789abcdef0",
 *       "prospect_id": "john-doe-123",
 *       "name": "prospect_company_name",
 *       "value": "Acme Corporation",
 *       "tags": ["company", "prospect"],
 *       "created_at": "2025-07-04T20:29:15.123456",
 *       "updated_at": "2025-07-28T18:26:30.987654",
 *       "enrichment_ids": ["enrich_001", "enrich_002"]
 *     }
 *   },
 *   "message": "Variable updated successfully",
 *   "timestamp": "2025-07-28T18:26:30.123Z"
 * }
 * 
 * Example Error Response (404):
 * {"error": "Variable not found or you don't have permission to update it"}
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid user_id. Must be a valid UUID string"}
 * 
 * Example Error Response (400):
 * {"error": "No update fields provided. At least one of updated_name or updated_value must be specified"}
 * 
 * Example Error Response (400):
 * {"error": "updated_name cannot exceed 255 characters"}
 * 
 * Example Error Response (400):
 * {"error": "updated_value cannot exceed 10000 characters"}
 */
