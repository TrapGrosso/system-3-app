import { useMutation } from '@tanstack/react-query'

const createGroup = async (payload) => {
  const response = await fetch('https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/createGroup', {
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

export const useCreateGroup = (options = {}) => {
  return useMutation({
    mutationFn: createGroup,
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
 *   group_name: string,
 *   group_description: string,   
 * }
 * 
 * Example response:
 * {
    "success": true,
    "data": {
      "group": {
        "id": "568de373-e4d4-4f49-964b-dcf3c6a15497",
        "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
        "name": "example group",
        "description": "example description",
        "created_at": "2025-07-01T11:46:31.384471",
        "updated_at": "2025-07-01T11:46:31.384471"
      }
    },
    "timestamp": "2025-07-01T11:46:31.426Z"
  }
 * 
 */