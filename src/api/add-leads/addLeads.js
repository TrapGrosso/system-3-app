import { useMutation } from '@tanstack/react-query'

const addLeads = async (payload) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/addLeads`, {
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

export const useAddLeads = (options = {}) => {
  return useMutation({
    mutationFn: addLeads,
    onSuccess: (data) => {
      console.log('Leads submitted successfully:', data)
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error submitting leads:', error)
      options.onError?.(error)
    },
  })
}

/**
 * Processes LinkedIn URLs, categorizing them as companies or people and forwarding to webhook.
 * 
 * Example Payload:
 * {"user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f", "leads": ["https://linkedin.com/in/corynott"], "options": {"source": "import", "campaign": "q1-2025"}}
 * 
 * Example Success Response (200):
 * {"message": "Processed 1 leads, 0 companies, 1 people. 0 invalid."}
 * 
 * Example Error Response (400):
 * {"error": "`user_id` (string) and `leads` (array) are required"}
 */
