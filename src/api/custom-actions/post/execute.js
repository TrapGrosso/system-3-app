import { useMutation } from '@tanstack/react-query'

const executeCustomAction = async ({ action_id, payload }) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/custom-actions/${action_id}/execute`, {
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

export const useExecuteCustomAction = (options = {}) => {
  return useMutation({
    mutationFn: executeCustomAction,
    onSuccess: (data) => {
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error executing custom action:', error)
      options.onError?.(error)
    },
  })
}


/**
 * Executes a custom action for specified prospects, fetching related data based on action configuration
 * and sending the data to a configured webhook endpoint.
 * 
 * This endpoint processes prospects through a user-defined custom action that specifies:
 * - What data to include (prospect, company, email, notes, variables, enrichments)
 * - What data is required (filtering prospects that don't meet criteria)
 * - Custom filters to apply to the data
 * - Authentication method for the webhook
 * 
 * The endpoint always sends data as an array of items, even for a single prospect.
 * 
 * Request Body:
 * - user_id (required): UUID of the user who owns the custom action
 * - prospectIds (required): Array of prospect LinkedIn IDs to process
 * 
 * URL Parameters:
 * - actionId (required): UUID of the custom action to execute
 * 
 * Response:
 * - 200: Success with summary of execution
 * - 400: Invalid input, missing data, or filtering resulted in no prospects
 * - 404: Custom action not found or not active
 * - 422: Webhook call failed
 * - 502: Network error calling webhook
 * - 504: Webhook timeout
 * - 500: Internal server error
 * 
 * Example Request:
 * POST /functions/v1/custom-actions/custom-actions/123e4567-e89b-12d3-a456-426614174000/execute
 * {
 *   "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
 *   "prospectIds": ["john-doe-123", "jane-smith-456"]
 * }
 * 
 * Example Success Response (200):
 * {
 *   "action_id": "123e4567-e89b-12d3-a456-426614174000",
 *   "total_input": 2,
 *   "qualified_after_require": 2,
 *   "sent": 2
 * }
 * 
 * Example Error Response (400):
 * {
 *   "error": "No items after required-data filtering"
 * }
 * 
 * Webhook Payload Format:
 * {
 *   "action_id": "uuid",
 *   "user_id": "uuid",
 *   "items": [
 *     {
 *       "prospect_id": "linkedin_id",
 *       "data": {
 *         "prospect": {
 *           "linkedin_id": "john-doe-123",
 *           "first_name": "John",
 *           "last_name": "Doe",
 *           "headline": "Software Engineer",
 *           "title": "Senior Developer",
 *           "status": "new",
 *           "location": "San Francisco, CA",
 *           "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
 *           "company_id": "tech-company-789",
 *           "email_id": "email-uuid-123"
 *         },
 *         "company": {
 *           "linkedin_id": "tech-company-789",
 *           "name": "Tech Company Inc",
 *           "website": "https://techcompany.com",
 *           "industry": "Software",
 *           "size": 100,
 *           "location": "San Francisco, CA",
 *           "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f"
 *         },
 *         "email": {
 *           "id": "email-uuid-123",
 *           "email": "john@techcompany.com",
 *           "status": "valid",
 *           "created_at": "2025-01-01T00:00:00Z",
 *           "verification": {
 *             "id": "verification-uuid-456",
 *             "email_id": "email-uuid-123",
 *             "verification_status": "valid",
 *             "safe_to_send": "yes",
 *             "verified_on": "2025-01-02T00:00:00Z",
 *             "disposable": "no",
 *             "free": "no",
 *             "role": "no",
 *             "gibberish": "no",
 *             "bounce_type": null,
 *             "created_at": "2025-01-02T00:00:00Z"
 *           }
 *         },
 *         "notes": [
 *           {
 *             "id": "note-uuid-789",
 *             "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
 *             "prospect_id": "john-doe-123",
 *             "body": "Met at conference, interested in our product",
 *             "created_at": "2025-01-03T00:00:00Z"
 *           }
 *         ],
 *         "variables": [
 *           {
 *             "id": "variable-uuid-123",
 *             "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
 *             "prospect_id": "john-doe-123",
 *             "name": "icp_score",
 *             "value": "85",
 *             "created_at": "2025-01-04T00:00:00Z",
 *             "updated_at": "2025-01-04T00:00:00Z"
 *           }
 *         ],
 *         "enrichments": [
 *           {
 *             "id": "enrichment-uuid-456",
 *             "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
 *             "entity": "john-doe-123",
 *             "entity_kind": "prospect",
 *             "type": "linkedin_profile",
 *             "source": "linkedin",
 *             "raw_data": {
 *               "profile_url": "https://linkedin.com/in/johndoe",
 *               "connections": 500
 *             },
 *             "summary": "Senior software engineer with 10 years experience",
 *             "created_at": "2025-01-05T00:00:00Z",
 *             "prompt_id": null
 *           }
 *         ]
 *       }
 *     }
 *   ]
 * }
 */
