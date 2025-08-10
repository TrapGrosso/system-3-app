import { useMutation } from '@tanstack/react-query'

const removeProspectFromCampaign = async (payload) => {
  const response = await fetch('https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/removeProspectFromCampaign', {
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

export const useRemoveProspectFromCampaign = (options = {}) => {
  return useMutation({
    mutationFn: removeProspectFromCampaign,
    onSuccess: (data) => {
      console.log('Prospect removed successfully:', data)
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error removing prospects:', error)
      options.onError?.(error)
    },
  })
}


/**
 * Removes one or more prospects from an Instantly campaign and updates the campaign_prospect table.
 *
 * Endpoint: POST /removeProspectFromCampaign
 *
 * Request JSON:
 * ```json
 * {
 *   "user_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
 *   "campaign_id": "f0e9d8c7-b6a5-4321-fedc-ba9876543210",
 *   "prospect_ids": ["linkedin_id_example_1", "linkedin_id_example_2"]
 * }
 * ```
 *
 * Guarantees:
 * - The campaign belongs to the user
 * - All provided prospects belong to the user
 * - All provided prospects are in the provided campaign (otherwise the request is rejected with 400)
 *
 * Strategy:
 * - Instantly-first delete (DELETE /api/v2/leads/{id}); treat 404 as idempotent success
 * - Then hard delete rows from public.campaign_prospect
 * - Best-effort trigger syncIstantlyProspectCampaigns to reconcile state
 *
 * Example Response:
 * ```json
 * {
 *   "success": true,
 *   "data": {
 *     "user_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
 *     "campaign_id": "f0e9d8c7-b6a5-4321-fedc-ba9876543210",
 *     "attempted": 2,
 *     "removed": 2,
 *     "results": [
 *       {
 *         "prospect_id": "linkedin_id_example_1",
 *         "istantly_id": "instantly_id_1",
 *         "status": "deleted",
 *         "error": null
 *       },
 *       {
 *         "prospect_id": "linkedin_id_example_2",
 *         "istantly_id": "instantly_id_2",
 *         "status": "already_deleted",
 *         "error": null
 *       }
 *     ]
 *   },
 *   "message": "Removed 2/2 prospect(s) from campaign f0e9d8c7-b6a5-4321-fedc-ba9876543210",
 *   "timestamp": "2025-08-10T13:00:00.000Z"
 * }
 * ```
 *
 * Uses environment variables:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - ISTANTLY_API_KEY
 */
