import { useMutation } from '@tanstack/react-query'

const addProspectToCampaign = async (payload) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/addProspectToCampaign`, {
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

export const useAddProspectToCampaign = (options = {}) => {
  return useMutation({
    mutationFn: addProspectToCampaign,
    onSuccess: (data) => {
      console.log('Prospect added successfully:', data)
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error adding prospects:', error)
      options.onError?.(error)
    },
  })
}

/**
 * Adds one or more prospects to an Instantly campaign and triggers a sync to update the campaign_prospect table.
 *
 * Endpoint: POST /addProspectToCampaign
 *
 * Request JSON:
 * {
 *   "user_id": "uuid",
 *   "prospect_ids": ["linkedin_id_1", "linkedin_id_2"],
 *   "campaign_id": "uuid",
 *   "options": {
 *     "include_risky_emails": boolean, // default false
 *     "include_only_verified": boolean // default true
 *   }
 * }
 *
 * Behavior per prospect:
 * 1) Fetch required fields from DB in a single query (prospect + company + variables + email + email_verifications).
 * 2) Determine eligible email based on `options` and email/verification statuses:
 *    - `include_only_verified=true` (default) & `include_risky_emails=false` (default):
 *      - Requires latest verification to be `valid` and `safe_to_send='yes'`.
 *    - `include_only_verified=false` & `include_risky_emails=false`:
 *      - If latest verification exists: requires `valid` and `safe_to_send='yes'`.
 *      - If no verification: requires `email.status='valid'`.
 *    - `include_only_verified=true` & `include_risky_emails=true`:
 *      - Requires latest verification to be NOT `invalid` and `safe_to_send` NOT `no`.
 *    - `include_only_verified=false` & `include_risky_emails=true`:
 *      - If latest verification exists: requires NOT `invalid` and `safe_to_send` NOT `no`.
 *      - If no verification: requires `email.status` NOT `not_found`.
 *    - Latest verification is determined strictly by `created_at` (descending).
 *    - Verification records always override `email.status` if present.
 * 3) Build Instantly payload with the determined eligible email and other fields.
 * 4) POST to Instantly API /api/v2/leads with skip flags set to true.
 * 5) On Instantly success, trigger syncIstantlyProspectCampaigns to reconcile DB (no direct DB writes here).
 *
 * Uses environment variables:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - ISTANTLY_API_KEY
 *
 * Example Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "campaign_id": "...",
 *     "processed": 3,
 *     "inserted": 2,
 *     "skipped_existing": 1,
 *     "failed": 0,
 *     "not_found": 0,
 *     "whithout_email": 0, 
 *     "unauthorized": 0,
 *     "results": [
 *       {"prospect_id":"abc","status":"inserted","istantly_id":"...","error":null},
 *       {"prospect_id":"def","status":"skipped_existing","istantly_id":null,"error":null}
 *     ]
 *   },
 *   "message": "Processed 3 prospect(s). Inserted: 2, Skipped existing: 1, Failed: 0, Not found: 0.",
 *   "timestamp": "..."
 * }
 */
