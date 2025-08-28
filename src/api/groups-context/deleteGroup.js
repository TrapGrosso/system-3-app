import { useMutation } from '@tanstack/react-query'

const deleteGroup = async (payload) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/deleteGroup`, {
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
 * Deletes a group after validating ownership and returns deletion confirmation.
 * 
 * Example Payload:
 * {"user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7", "group_id": "b666eceb-26ca-52gc-a7fe-2gfd754g33f8"}
 * 
 * Example Success Response (200):
 * {"success": true, "data": {"deleted": true, "group_id": "..."}, "message": "Group deleted successfully", "timestamp": "..."}
 * 
 * Example Error Response (404):
 * {"error": "Group not found or you don't have permission to delete it"}
 */