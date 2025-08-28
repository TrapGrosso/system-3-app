import { useMutation } from '@tanstack/react-query'

const verifyProspectEmails = async (payload) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verifyProspectEmails`, {
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

export const useverifyProspectEmails = (options = {}) => {
  return useMutation({
    mutationFn: verifyProspectEmails,
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
 * POST /verifyProspectEmails
 *
 * Fetches prospect-associated email records according to filtering criteria and sends them to a webhook.
 *
 * Payload:
 * ```json
 * {
 *   "user_id": "uuid string",
 *   "prospect_ids": ["linkedin_id_1", "linkedin_id_2"],
 *   "options": {
 *     "include_valid": false, // default
 *     "include_already_verified": false, // default
 *     "verification_status": "all" // default
 *   }
 * }
 * ```
 *
 * Behavior:
 * 1. Validates the `user_id`, `prospect_ids`, and `options` inputs.
 * 2. Fetches prospect and their linked email data from the Supabase database.
 * 3. Filters emails based on `email.status`:
 *    - By default, only `risky` emails are included.
 *    - If `options.include_valid` is `true`, `valid` emails are also included.
 * 4. By default, emails that have any record in the `email_verification` table are excluded.
 * 5. If `options.include_already_verified` is `true`:
 *    - Emails with no verification records are still included.
 *    - Emails with verification records are included based on `options.verification_status`:
 *      - `"all"`: Includes all verified emails.
 *      - `"valid"`: Includes only if the latest `email_verification.verification_status` is `"valid"` AND `email_verification.safe_to_send` is NOT `"no"`.
 *      - `"invalid"`: Includes only if the latest `email_verification.verification_status` is `"invalid"`.
 *      - `"catch_all"`: Includes only if the latest `email_verification.verification_status` is `"catch_all"`.
 * 6. Transforms the included data into an array of objects with the following shape:
 *    ```json
 *    {
 *      "id": "email_uuid",
 *      "email": "email@example.com",
 *      "status": "risky",
 *      "created_at": "timestamp",
 *      "prospect_id": "linkedin_id"
 *    }
 *    ```
 * 7. Chunks the transformed data into batches (default 200 items per chunk).
 * 8. Sends each chunk as a POST request to the configured webhook URL
 *    (https://n8n.coolify.fabiodevelopsthings.com/webhook/2d562f56-ab4b-4896-a1cd-41286649cf80).
 * 9. Returns a summary of processed, found, and sent prospects.
 *
 * Example Success Response (200):
 * ```json
 * {
 *   "success": true,
 *   "data": {
 *     "requested": 2,
 *     "deduped": 2,
 *     "with_email": 2,
 *     "included_verified": 1,
 *     "included_unverified": 1,
 *     "sent_count": 2,
 *     "not_found": 0,
 *     "no_email_or_filtered": 0
 *   },
 *   "message": "Processed 2 prospect(s). With email: 2. Included verified: 1, unverified: 1. Sent 2 item(s) to webhook.",
 *   "timestamp": "2025-08-14T11:22:33.123Z"
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
