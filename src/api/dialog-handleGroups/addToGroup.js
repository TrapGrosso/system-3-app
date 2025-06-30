import { useMutation } from '@tanstack/react-query'

const addToGroup = async (payload) => {
  const response = await fetch('https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/addToGroup', {
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

export const useAddToGroup = (options = {}) => {
  return useMutation({
    mutationFn: addToGroup,
    onSuccess: (data) => {
      console.log('Leads successfully added to group:', data)
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error adding leads to group:', error)
      options.onError?.(error)
    },
  })
}

/**
 * Example body:
 * {
 *   prospect_ids: ['id1', 'id2'],
 *   group_id: 'group id'
 * }
 * 
 * Example response:
 * 
 * success
 * {
    "added": 1,
    "duplicates": 0,
    "message": "All prospects added successfully",
    "timestamp": "2025-06-30T19:09:40.206Z"
  }
 * 
 */