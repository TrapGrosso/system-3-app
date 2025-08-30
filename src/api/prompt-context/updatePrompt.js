import { useMutation } from '@tanstack/react-query'

const updatePrompt = async (payload) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/updatePrompt`, {
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

export const useUpdatePrompt = (options = {}) => {
  return useMutation({
    mutationFn: updatePrompt,
    onSuccess: (data) => {
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error updating prompt:', error)
      options.onError?.(error)
    },
  })
}

/**
 * Updates a prompt's properties after validating ownership and returns the updated prompt.
 * 
 * Example Payload (Full Update):
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "prompt_id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *   "updated_prompt_name": "Updated Research Prompt",
 *   "updated_prompt_description": "Enhanced description for deep research analysis",
 *   "updated_prompt_text": "You are an expert researcher. Analyze the following data thoroughly...",
 *   "updated_agent_type": "deep_research",
 *   "updated_tags": ["research", "analysis", "llm"],
 *   "updated_additional_metadata": {
 *     "source": "web",
 *     "version": 2,
 *     "custom_config": {
 *       "temperature": 0.7,
 *       "max_tokens": 1000
 *     }
 *   }
 * }
 * 
 * Example Payload (Partial Update):
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "prompt_id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *   "updated_prompt_name": "New Prompt Name",
 *   "updated_tags": ["updated", "tags"]
 * }
 * 
 * Example Payload (Metadata Update - Merge):
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "prompt_id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *   "updated_additional_metadata": {
 *     "new_field": "value",
 *     "existing_field": "updated_value"
 *   }
 * }
 * 
 * Example Payload (Metadata Reset):
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "prompt_id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *   "updated_additional_metadata": null
 * }
 * 
 * Example Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "prompt": {
 *       "id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *       "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *       "name": "Updated Research Prompt",
 *       "description": "Enhanced description for deep research analysis",
 *       "prompt_text": "You are an expert researcher. Analyze the following data thoroughly...",
 *       "agent_type": "deep_research",
 *       "tags": ["research", "analysis", "llm"],
 *       "created_at": "2025-07-04T20:29:15.123456",
 *       "updated_at": "2025-07-07T10:20:45.987654",
 *       "additional_metadata": {
 *         "source": "web",
 *         "version": 2,
 *         "custom_config": {
 *           "temperature": 0.7,
 *           "max_tokens": 1000
 *         }
 *       }
 *     }
 *   },
 *   "message": "Prompt updated successfully",
 *   "timestamp": "2025-07-07T10:20:45.123Z"
 * }
 * 
 * Example Error Response (404):
 * {"error": "Prompt not found or you don't have permission to update it"}
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid user_id. Must be a valid UUID string"}
 * 
 * Example Error Response (400):
 * {"error": "Invalid updated_agent_type. Must be one of: deep_research"}
 * 
 * Example Error Response (400):
 * {"error": "No update fields provided. At least one of updated_prompt_name, updated_prompt_description, updated_prompt_text, updated_agent_type, updated_tags, or updated_additional_metadata must be specified"}
 * 
 * Example Error Response (400):
 * {"error": "Invalid updated_additional_metadata. Must be an object or null, and cannot exceed 10KB when serialized"}
 */
