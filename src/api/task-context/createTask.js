import { useMutation } from '@tanstack/react-query'

const createTask = async (payload) => {
  const response = await fetch('https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/createTask', {
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

export const useCreateTask = (options = {}) => {
  return useMutation({
    mutationFn: createTask,
    onSuccess: (data) => {
      console.log('Task created successfully:', data)
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error creating task:', error)
      options.onError?.(error)
    },
  })
}

/**
 * Creates new tasks with validation and returns the created task details.
 * 
 * Example Payload:
 * {"user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7", "prospect_ids": ["123", "456"], "task_title": "Send Intro Email", "task_description": "Personalize email to both leads", "task_duedate": "2025-07-10"}
 * 
 * Example Success Response (201):
 * {"success": true, "data": {"tasks": [{"id": "...", "title": "Send Intro Email", ...}]}, "message": "2 tasks created successfully", "timestamp": "..."}
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid user_id. Must be a valid UUID string"}
 */