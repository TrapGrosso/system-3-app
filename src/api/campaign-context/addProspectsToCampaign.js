import { useMutation } from '@tanstack/react-query'

const addProspectToCampaign = async (payload) => {
  const response = await fetch('https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/addProspectToCampaign', {
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
 * Adds one or more prospects to an Instantly campaign and updates the campaign_prospect table.
 *
 * Endpoint: POST /addProspectToCampaign
 *
 * Request JSON:
 * {
 *   "user_id": "uuid",
 *   "prospect_ids": ["linkedin_id_1", "linkedin_id_2"],
 *   "campaign_id": "uuid"
 * }
 *
 * Behavior per prospect:
 * 1) Fetch required fields from DB in a single query (prospect + company + variables)
 * 2) Build Instantly payload with all fields present and set missing values to null
 * 3) POST to Instantly API /api/v2/leads with skip flags set to true
 * 4) On success, upsert into public.campaign_prospect (campaign_id, prospect_id, istantly_id)
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
