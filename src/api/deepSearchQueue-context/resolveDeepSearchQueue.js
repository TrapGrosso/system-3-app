import { useMutation } from '@tanstack/react-query'

const resolveDeepSearchQueue = async (payload) => {
  const response = await fetch('https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/resolveDeepSearchQueue', {
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

export const useResolveDeepSearchQueue = (options = {}) => {
  return useMutation({
    mutationFn: resolveDeepSearchQueue,
    onSuccess: (data) => {
      console.log('Successfully resolved queue:', data)
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error resolving queue:', error)
      options.onError?.(error)
    },
  })
}

/**
 * Processes prospect-prompt pairs, retrieves prospect and company data with enrichments,
 * and forwards to webhook for deep search workflow.
 * 
 * Example Payload:
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "prospect_prompt_ids": [
 *     {"prospect_id": "john-doe-123", "prompt_id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66"},
 *     {"prospect_id": "jane-smith-456", "prompt_id": "6e4f3g47-9ac4-50d3-04f7-07cg0g743e77"}
 *   ]
 * }
 * 
 * Example Success Response (200):
 * {"message": "Resolved 2 prospects (1 companies). Sent to workflow."}
 * 
 * Example Error Response (404):
 * {"error": "No prospects found or you don't have permission to access them"}
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid user_id. Must be a valid UUID string"}
 */