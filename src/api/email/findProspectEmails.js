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
 *   "prospect_ids": ["linkedin_id_1", "linkedin_id_2", ...],
 *   "options": {
 *     "retry_not_found": false // default
 *   }
 * }
 *
 * Behavior:
 * 1. Validates the `user_id`, `prospect_ids`, and `options` inputs.
 * 2. Fetches prospect and their linked company data from the Supabase database.
 * 3. Default behavior: Only prospects with an associated company (`company_id IS NOT NULL`) AND no email (`email_id IS NULL`) are selected.
 * 4. If `options.retry_not_found` is `true`:
 *    - Additionally, prospects with an associated company (`company_id IS NOT NULL`) and an email record whose `email.status` is `'not_found'` are selected.
 *    - For these "not_found" emails, their corresponding `email` records are deleted from the `email` table.
 *    - Due to foreign key cascading rules:
 *      - Any related `email_verification` records are automatically deleted (`ON DELETE CASCADE`).
 *      - The `prospect.email_id` for these prospects is automatically set to `NULL` (`ON DELETE SET NULL`), making them eligible for future email finding.
 *    - These "reset" prospects are then included in the list sent to the webhook.
 * 5. Transforms the selected data into an array of objects with the following shape:
 *    {
 *      prospect_id: string,
 *      company_id: string,
 *      first_name: string | null,
 *      last_name: string | null,
 *      company_name: string | null,
 *      website: string | null
 *    }
 * 6. Chunks the transformed data into batches (default 200 items per chunk).
 * 7. Sends each chunk as a POST request to the configured webhook URL, including the `options` object.
 * 8. Returns a summary of processed, found, and sent prospects, including counts for default, retried, and deleted emails.
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
 *     "prospect_ids":["prospect_linkedin_id_1","prospect_linkedin_id_2"],
 *     "options": {
 *       "retry_not_found": true
 *     }
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
 *     "with_company_default": 1,
 *     "retried_not_found_count": 1,
 *     "emails_deleted_count": 1,
 *     "sent_count": 2,
 *     "not_found": 0,
 *     "no_company": 0
 *   },
 *   "message": "Processed 2 prospect(s). Default with company & no email: 1. Retried not_found: 1 (emails deleted: 1). Sent 2 to webhook.",
 *   "timestamp": "2025-08-14T18:21:00.000Z"
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
 * Invalid options (400):
 * ```json
 * {"error": "`options` must be an object when provided"}
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
