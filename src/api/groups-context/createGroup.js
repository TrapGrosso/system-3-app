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
 * Creates a new group with validation and returns the created group details.
 * 
 * Example Payload:
 * {"user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7", "group_name": "Sales Team", "group_description": "Main sales group"}
 * 
 * Example Success Response (201):
 * {"success": true, "data": {"group": {"id": "...", "name": "Sales Team", ...}}, "message": "Group created successfully", "timestamp": "..."}
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid user_id. Must be a valid UUID string"}
 */