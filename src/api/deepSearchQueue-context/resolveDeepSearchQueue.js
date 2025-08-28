import { useMutation } from '@tanstack/react-query'

const resolveDeepSearchQueue = async (payload) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/resolveDeepSearchQueue`, {
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

export const useResolveDeepSearchQueue = (options = {}) => {
  return useMutation({
    mutationFn: resolveDeepSearchQueue,
    onSuccess: (data) => {
      console.log('Successfully resolved queue:', data)
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error resolving queue:', error)
      options.onError?.(error)
    },
  })
}

/**
 * Processes deep search queue items, retrieves prospect and company data with enrichments,
 * and forwards to webhook for deep search workflow. Now uses the new queue-based architecture
 * with batched queries for optimal performance.
 * 
 * Example Request Payload:
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "queue_item_ids": [
 *     "queue-uuid-1",
 *     "queue-uuid-2"
 *   ]
 * }
 * 
 * Example Webhook Payload Sent to n8n:
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "items": [
 *     {
 *       "prospect": {
 *         "linkedin_id": "john-doe-123",
 *         "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *         "first_name": "John",
 *         "last_name": "Doe",
 *         "enrichment": {"linkedin": {...}, "apollo": {...}}
 *       },
 *       "company": {
 *         "linkedin_id": "company-123",
 *         "name": "Example Corp",
 *         "enrichment": {"website": {...}}
 *       },
 *       "prompts": [
 *         {
 *           "id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *           "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *           "name": "Sales Outreach",
 *           "description": "Template for cold outreach",
 *           "prompt_text": "Hello {{first_name}}...",
 *           "agent_type": "sales",
 *           "tags": ["outreach", "cold"],
 *           "created_at": "2024-01-01T00:00:00Z",
 *           "updated_at": "2024-01-01T00:00:00Z"
 *         }
 *       ]
 *     }
 *   ],
 *   "options": {
 *     "extend_propsect_bd_scrape": false,
 *     "extend_company_bd_scrape": false,
 *     "precision": "default",
 *     "use_standard_search": false
 *   }
 * }
 * 
 * Example Success Response (200):
 * {"message": "Resolved 2 prospects (1 companies). Sent to workflow."}
 * 
 * Example Error Response (404):
 * {"error": "No queue items found or you don't have permission to access them"}
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid user_id. Must be a valid UUID string"}
 */
