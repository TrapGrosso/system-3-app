import { useMutation } from '@tanstack/react-query'

const deleteEnrichments = async (payload) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/deleteEnrichments`, {
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

export const useDeleteEnrichments = (options = {}) => {
  return useMutation({
    mutationFn: deleteEnrichments,
    onSuccess: (data) => {
      console.log('Enrichments deleted successfully:', data)
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error deleting enrichments:', error)
      options.onError?.(error)
    },
  })
}

/**
 * Deletes multiple enrichments after validating ownership and returns deletion confirmation.
 * 
 * Example Payload:
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "enrichment_ids": [
 *     "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *     "0c52c1f7-1b77-4d6f-9e0e-3e75baff7461"
 *   ]
 * }
 * 
 * Example Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "deleted": true,
 *     "enrichment_ids": [
 *       "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *       "0c52c1f7-1b77-4d6f-9e0e-3e75baff7461"
 *     ],
 *     "count": 2
 *   },
 *   "message": "2 enrichment(s) deleted successfully",
 *   "timestamp": "2025-07-29T11:06:45.123Z"
 * }
 * 
 * Example Error Response (404):
 * {"error": "Enrichments not found or you don't have permission to delete them"}
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid user_id. Must be a valid UUID string"}
 */