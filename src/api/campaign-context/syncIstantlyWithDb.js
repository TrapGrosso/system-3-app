import { useMutation } from '@tanstack/react-query'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const withRetry = async (fn, { retries = 3, baseDelay = 1000, maxDelay = 30000, factor = 2 } = {}) => {
  let attempt = 0
  let delay = baseDelay
  // Retry on any thrown error from fn
  while (true) {
    try {
      return await fn()
    } catch (err) {
      attempt += 1
      if (attempt > retries) throw err
      const jitter = Math.random() * 200
      await sleep(Math.min(delay, maxDelay) + jitter)
      delay = Math.min(delay * factor, maxDelay)
    }
  }
}

const syncIstantlyCampaigns = async (userId) => {
  const response = await fetch(`https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/syncIstantlyCampaigns?user_id=${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
    }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error)
  }

  return response.json()
}

export const useSyncIstantlyCampaigns = (options = {}) => {
  return useMutation({
    mutationKey: ['syncIstantlyCampaigns'],
    mutationFn: ({ userId }) => withRetry(() => syncIstantlyCampaigns(userId)),
    ...options,
  })
}

/**
 * Synchronizes campaigns from Instantly API to the public.campaign table.
 * 
 * Query Parameters:
 * - user_id (required): UUID of the user
 * 
 * Example Request:
 * GET /syncInstantlyCampaigns?user_id=a555dbda-15b9-41fb-96ed-1feb643f22e7
 * 
 * Example Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "synced": 5,
 *     "inserted": 2,
 *     "updated": 3,
 *     "softDeleted": 1
 *   },
 *   "message": "Synced 5 campaigns (inserted: 2, updated: 3, soft-deleted: 1)",
 *   "timestamp": "2025-08-07T19:22:33.123Z"
 * }
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid user_id. Must be a valid UUID string"}
 */

const syncIstantlyProspectCampaigns = async (userId) => {
  const response = await fetch(`https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/syncIstantlyProspectCampaigns?user_id=${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
    }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error)
  }

  return response.json()
}

export const useSyncIstantlyProspectCampaigns = (options = {}) => {
  return useMutation({
    mutationKey: ['syncIstantlyProspectCampaigns'],
    mutationFn: ({ userId }) => withRetry(() => syncIstantlyProspectCampaigns(userId)),
    ...options,
  })
}

/**
 * Synchronizes Instantly leads with public.campaign_prospect per campaign for a given user.
 *
 * Endpoint: GET /syncIstantlyProspectCampaigns?user_id=<uuid>
 *
 * Behavior per campaign:
 * - Load DB state from campaign_prospect
 * - Fetch Instantly leads (/api/v2/leads/list, paginated)
 * - Compare:
 *   - Hard-delete DB-only rows from campaign_prospect
 *   - Insert Instantly-only (only if payload.prospect_linkedin_id present)
 *   - Repair istantly_id when null or mismatched
 * - Use istantly_id to detect conflicts and avoid rewiring across different prospects
 * - Delay 300–500 ms between campaigns
 *
 * Env:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - ISTANTLY_API_KEY (Bearer)
 */

const updateAllProspectsInCampaigns = async (userId) => {
  const response = await fetch(`https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/updateAllProspectsInCampaigns?user_id=${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
    }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error)
  }

  return response.json()
}

export const useUpdateAllProspectsInCampaigns = (options = {}) => {
  return useMutation({
    mutationKey: ['updateAllProspectsInCampaigns'],
    mutationFn: ({ userId }) => withRetry(() => updateAllProspectsInCampaigns(userId)),
    ...options,
  })
}

/**
 * Updates all Instantly leads for user-owned prospects in active-like campaigns.
 *
 * Endpoint: GET /updateAllProspectsInCampaigns?user_id=<uuid>
 *
 * Behavior:
 * 1) Forces sync of campaigns and campaign->prospect mappings from Instantly.
 * 2) Loads campaign_prospect rows where campaign.status ∈ {"Draft","Active","Paused"} and campaign.user_id=user_id.
 * 3) Bulk-fetches prospect details (email, company, variables) for those links.
 * 4) Builds Instantly PATCH payload per lead (email directly from email table; no verification gating).
 * 5) PATCHes Instantly /api/v2/leads/{istantly_id} in small batches with timeouts.
 *
 * Env:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - ISTANTLY_API_KEY
 */
