import { useMutation } from '@tanstack/react-query'

const removeFromGroup = async (payload) => {
  const response = await fetch('https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/removeFromGroup', {
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

export const useRemoveFromGroup = (options = {}) => {
  return useMutation({
    mutationFn: removeFromGroup,
    onSuccess: (data) => {
      console.log('Lead(s) successfully removed from group:', data)
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error removing lead(s) from group:', error)
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