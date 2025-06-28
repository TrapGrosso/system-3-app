import { useMutation } from '@tanstack/react-query'

const submitLeads = async (payload) => {
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
    mutationFn: submitLeads,
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
