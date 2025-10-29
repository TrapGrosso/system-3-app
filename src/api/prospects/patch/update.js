import { useMutation } from '@tanstack/react-query'

const updateProspect = async (payload) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/prospects/update`, {
    method: 'PATCH',
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

export const useUpdateProspect = (options = {}) => {
  return useMutation({
    mutationFn: updateProspect,
    onSuccess: (data) => {
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error updating prospect(s):', error)
      options.onError?.(error)
    },
  })
}


/**
 * Updates prospects with specified fields.
 * 
 * This endpoint supports both single and bulk updates:
 * - Single updates: Can modify any allowed field
 * - Bulk updates: Can only modify status or status_id fields
 * 
 * Request Body:
 * - user_id (required): UUID of the user who owns the prospects
 * - prospect_ids (required): Array of prospect LinkedIn IDs to update
 * - updated_fields (required): Object containing fields to update
 * 
 * Allowed fields in updated_fields:
 * - first_name: string | null (max 120 chars)
 * - last_name: string | null (max 120 chars)
 * - location: string | null (max 255 chars)
 * - title: string | null (max 255 chars)
 * - company_id: string | null (max 255 chars, LinkedIn ID)
 * - status: string | null (maps to status_id via status table)
 * - status_id: UUID | null (direct reference to status table)
 * 
 * Response (Single):
 * {
 *   "success": true,
 *   "updated": {
 *     "linkedin_id": "john-doe-123",
 *     "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
 *     "first_name": "John",
 *     "last_name": "Doe",
 *     "location": "New York, NY",
 *     "title": "Senior Engineer",
 *     "company_id": "tech-company-456",
 *     "status_id": "11111111-2222-3333-4444-555555555555",
 *     "created_at": "2025-01-01T00:00:00Z",
 *     "updated_at": "2025-01-02T00:00:00Z",
 *     "email_id": null
 *   },
 *   "message": "Prospect updated successfully",
 *   "updated_fields": ["first_name", "last_name"]
 * }
 * 
 * Response (Bulk):
 * {
 *   "success": true,
 *   "total_input": 120,
 *   "updated_count": 115,
 *   "not_found_ids": ["li-3", "li-7"],
 *   "message": "received 120 prospects, updated 115 after ownership filtering",
 *   "updated_fields": ["status_id"]
 * }
 * 
 * Error Responses:
 * - 400: Validation errors, invalid input
 * - 404: Prospect not found (single update only)
 * - 500: Internal server error
 * 
 * Example Requests:
 * 
 * Single update:
 * PATCH /functions/v1/prospects/update
 * {
 *   "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
 *   "prospect_ids": ["john-doe-123"],
 *   "updated_fields": {
 *     "first_name": "John",
 *     "last_name": "Doe",
 *     "status": "ready"
 *   }
 * }
 * 
 * Bulk status update:
 * PATCH /functions/v1/prospects/update
 * {
 *   "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
 *   "prospect_ids": ["john-doe-123", "jane-smith-456"],
 *   "updated_fields": {
 *     "status": "ready"
 *   }
 * }
 * 
 * Bulk status_id update:
 * PATCH /functions/v1/prospects/update
 * {
 *   "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
 *   "prospect_ids": ["john-doe-123", "jane-smith-456"],
 *   "updated_fields": {
 *     "status_id": "11111111-2222-3333-4444-555555555555"
 *   }
 * }
 */
