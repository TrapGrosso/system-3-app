import { useMutation } from '@tanstack/react-query'

const submitLeads = async (leads) => {
  const response = await fetch('https://n8n.coolify.fabiodevelopsthings.com/webhook/add-leads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ leads }),
  })

  if (!response.ok) {
    throw new Error('Failed to submit leads')
  }

  return response.json()
}

export const useAddLeads = (options = {}) => {
  return useMutation({
    mutationFn: submitLeads,
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
