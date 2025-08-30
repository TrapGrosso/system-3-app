import { useMutation } from '@tanstack/react-query'

const createVariables = async (payload) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/createVariables`, {
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

export const useCreateVariables = (options = {}) => {
  return useMutation({
    mutationFn: createVariables,
    onSuccess: (data) => {
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error creating note:', error)
      options.onError?.(error)
    },
  })
}

/**
 * Creates variables by fetching prospect, enrichment, and prompt data, then forwarding to webhook.
 * 
 * This function receives a list of prospects with their associated enrichment and prompt IDs,
 * fetches the complete data from the database in optimized batch queries, assembles the payload,
 * and forwards it to a webhook for variable creation processing.
 * 
 * Example Payload:
 * {
 *   "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
 *   "prospect_enrichments_ids": [
 *     {
 *       "prospect_id": "bizcoachjason",
 *       "enrichment_ids": [
 *         "a3f93a7f-0d1b-4617-a232-6cdd0ec91e16",
 *         "cc9cf551-f54a-4c48-b884-1eb30859650c"
 *       ],
 *       "prompt_ids": [
 *         "81a10e69-6386-4ea6-9131-b6eb7906dc62"
 *       ]
 *     },
 *     {
 *       "prospect_id": "jason-kaprelian",
 *       "enrichment_ids": [
 *         "66412b06-55fe-424f-89c5-d8e3fbf02810"
 *       ],
 *       "prompt_ids": [
 *         "81a10e69-6386-4ea6-9131-b6eb7906dc62"
 *       ]
 *     }
 *   ]
 * }
 * 
 * Example Success Response (200):
 * {
 *   "message": "Successfully processed 2 prospects for variable creation",
 *   "processed_prospects": 2
 * }
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid user_id. Must be a valid UUID string"}
 * 
 * Example Error Response (404):
 * {"error": "No matching prospects found"}
 * 
 * The function performs the following optimizations:
 * - Uses only 3 database round-trips (prospects+companies, enrichments, prompts)
 * - Deduplicates IDs across all prospect items to minimize query size
 * - Uses efficient lookup maps for data assembly
 * - Handles missing companies gracefully (sets company to null)
 * - Logs warnings for missing enrichments/prompts but continues processing
 * - Forwards complete payload to webhook for downstream processing
 */
