import { useMutation } from '@tanstack/react-query'

const deleteCompanies = async (payload) => {
  const response = await fetch('https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/deleteCompanies', {
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

export const useDeleteCompanies = (options = {}) => {
  return useMutation({
    mutationFn: deleteCompanies,
    onSuccess: (data) => {
      console.log('Prompt deleted successfully:', data)
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error deleting prompt:', error)
      options.onError?.(error)
    },
  })
}

/**
 * Deletes one or more companies after validating ownership and returns deletion confirmation.
 * 
 * Example Payload:
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "company_ids": ["acme-inc", "globex-corp"]
 * }
 * 
 * Example Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "deleted": true,
 *     "company_ids": ["acme-inc", "globex-corp"],
 *     "count": 2
 *   },
 *   "message": "2 company(ies) deleted successfully",
 *   "timestamp": "2025-07-06T22:24:45.123Z"
 * }
 * 
 * Example Error Response (404):
 * {"error": "Companies not found or you don't have permission to delete them"}
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid user_id. Must be a valid UUID string"}
 */
