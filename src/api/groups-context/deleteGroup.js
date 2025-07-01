import { useMutation } from '@tanstack/react-query'

const deleteGroup = async (payload) => {
  const response = await fetch('https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/deleteGroup', {
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

export const useDeleteGroup = (options = {}) => {
  return useMutation({
    mutationFn: deleteGroup,
    onSuccess: (data) => {
      console.log('Group deleted successfully:', data)
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error deleting group:', error)
      options.onError?.(error)
    },
  })
}

/**
 * Example body:
 * {
 *   user_id: string,
 *   group_id: string
 * }
 * 
 * Example response:
 * 
 * {
    "success": true,
    "data": {
      "deleted": true,
      "group_id": "568de373-e4d4-4f49-964b-dcf3c6a15497"
    },
    "timestamp": "2025-07-01T11:47:05.269Z"
  }
 * 
 */