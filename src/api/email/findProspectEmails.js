import { useMutation } from '@tanstack/react-query'

const findProspectEmails = async (payload) => {
  const response = await fetch('https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/findProspectEmails', {
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

export const usefindProspectEmails = (options = {}) => {
  return useMutation({
    mutationFn: findProspectEmails,
    onSuccess: (data) => {
      console.log('Prospects submitted successfully:', data)
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error submitting prospects:', error)
      options.onError?.(error)
    },
  })
}

/**
 * Processes a list of prospect IDs, fetches their associated company data,
 * filters out prospects without a company, transforms the data into a specific
 * shape, and sends the resulting array to an external webhook.
 *
 * Endpoint: POST /findProspectEmails
 *
 * Request JSON:
 * {
 *   "user_id": "uuid",
 *   "prospect_ids": ["linkedin_id_1", "linkedin_id_2", ...]
 * }
 *
 * Behavior:
 * 1. Validates the `user_id` and `prospect_ids` inputs.
 * 2. Fetches prospect and their linked company data from the Supabase database.
 * 3. Filters out any prospects that do not have an associated company.
 * 4. Transforms the remaining data into an array of objects with the following shape:
 *    {
 *      prospect_id: string,
 *      company_id: string,
 *      first_name: string | null,
 *      last_name: string | null,
 *      company_name: string | null,
 *      website: string | null
 *    }
 * 5. Chunks the transformed data into batches (default 200 items per chunk).
 * 6. Sends each chunk as a POST request to the configured webhook URL
 *    (https://n8n.coolify.fabiodevelopsthings.com/webhook/9a908ed4-bcc6-4b67-994e-80e5fe064519).
 * 7. Returns a summary of processed, found, and sent prospects.
 *
 * Uses environment variables:
 * - SUPABASE_URL (required)
 * - SUPABASE_SERVICE_ROLE_KEY (required)
 * - WEBHOOK_URL_FIND_PROSPECT_EMAILS (optional, defaults to the n8n webhook URL)
 *
 * Example Request:
 * ```bash
 * curl -i --location --request POST 'http://<supabase-edge-url>/functions/v1/findProspectEmails' \
 *   --header 'Content-Type: application/json' \
 *   --data '{
 *     "user_id":"bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
 *     "prospect_ids":["prospect_linkedin_id_1","prospect_linkedin_id_2"]
 *   }'
 * ```
 *
 * Example Success Response (200):
 * ```json
 * {
 *   "success": true,
 *   "data": {
 *     "requested": 2,
 *     "deduped": 2,
 *     "with_company": 1,
 *     "sent_count": 1,
 *     "not_found": 1,
 *     "no_company": 0
 *   },
 *   "message": "Processed 2 prospect(s). With company: 1, No company: 0, Not found: 1. Sent 1 to webhook.",
 *   "timestamp": "2025-08-13T17:47:12.345Z"
 * }
 * ```
 *
 * Example Error Responses:
 *
 * Invalid JSON payload (400):
 * ```json
 * {"error": "Invalid JSON payload"}
 * ```
 *
 * Invalid user_id (400):
 * ```json
 * {"error": "`user_id` must be a valid UUID string"}
 * ```
 *
 * Invalid prospect_ids (400):
 * ```json
 * {"error": "`prospect_ids` must be a non-empty array of non-empty strings"}
 * ```
 *
 * Server configuration error (500):
 * ```json
 * {"error": "Server configuration error"}
 * ```
 *
 * Database error (500):
 * ```json
 * {"error": "Database error fetching prospects"}
 * ```
 *
 * Webhook activation error (500):
 * ```json
 * {"error": "Error activating the workflow"}
 * ```
 */
