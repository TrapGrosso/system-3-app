import { useMutation } from '@tanstack/react-query'

const retryAddLeads = async (payload) => {
  const response = await fetch('https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/retryAddLeads', {
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

export const useRetryAddLeads = (options = {}) => {
  return useMutation({
    mutationFn: retryAddLeads,
    onSuccess: (data) => {
      console.log('Retry request submitted successfully:', data)
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error submitting retry request:', error)
      options.onError?.(error)
    },
  })
}

/**
 * Retries failed 'add_leads' operations by re-processing leads from failed branches of a log record.
 * 
 * Example Payload:
 * {"log_id": "b2a38cb7-cc22-4659-bd48-48af7567d9d4", "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f"}
 * 
 * Example Success Response (200):
 * {"message": "Retry dispatched for X leads from failed branches: people, companies", "retried_leads_count": X, "failed_branches": ["people", "companies"]}
 * 
 * Example Error Response (400):
 * {"error": "`log_id` and `user_id` must be valid UUIDs"}
 */