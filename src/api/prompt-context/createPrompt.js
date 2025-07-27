import { useMutation } from '@tanstack/react-query'

const createPrompt = async (payload) => {
  const response = await fetch('https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/createPrompt', {
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

export const useCreatePrompt = (options = {}) => {
  return useMutation({
    mutationFn: createPrompt,
    onSuccess: (data) => {
      console.log('Prompt created successfully:', data)
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error creating Prompt:', error)
      options.onError?.(error)
    },
  })
}

/**
 * Creates a new prompt with validation and returns the created prompt details.
 * 
 * Example Payload:
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "prompt_name": "Research Assistant",
 *   "prompt_description": "A prompt for conducting deep research",
 *   "prompt_text": "You are a research assistant specialized in...",
 *   "agent_type": "deep_research",
 *   "tags": ["research", "analysis", "AI"],
 *   "additional_metadata": {"model": "gpt-4", "language": "en"}
 * }
 * 
 * Example Success Response (201):
 * {
 *   "success": true,
 *   "data": {
 *     "prompt": {
 *       "id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *       "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *       "name": "Research Assistant",
 *       "description": "A prompt for conducting deep research",
 *       "prompt_text": "You are a research assistant specialized in...",
 *       "agent_type": "deep_research",
 *       "tags": ["research", "analysis", "AI"],
 *       "created_at": "2025-07-04T20:29:15.123456",
 *       "updated_at": "2025-07-04T20:29:15.123456",
 *       "additional_metadata": {"model": "gpt-4", "language": "en"}
 *     }
 *   },
 *   "message": "Prompt created successfully",
 *   "timestamp": "2025-07-04T20:29:15.345Z"
 * }
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid user_id. Must be a valid UUID string"}
 */
