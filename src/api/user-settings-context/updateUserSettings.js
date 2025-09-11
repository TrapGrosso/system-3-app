import { useMutation } from '@tanstack/react-query'

const updateUserSettings = async (payload) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/updateUserSettings`, {
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

export const useUpdateUserSettings = (options = {}) => {
  return useMutation({
    mutationFn: updateUserSettings,
    onSuccess: (data) => {
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error updating settings:', error)
      options.onError?.(error)
    },
  })
}

/**
 * Updates user settings after validating ownership and returns the updated settings.
 * 
 * Example Payload (Update with aliases):
 * {
 *   "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
 *   "updated_add_leads": {
 *     "source": "linkedin",
 *     "limit": 20
 *   },
 *   "updated_verify_emails_clearout": {
 *     "timeout": 45
 *   }
 * }
 * 
 * Example Payload (Update with full column names):
 * {
 *   "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
 *   "updated_add_leads_default_options": {
 *     "source": "csv"
 *   }
 * }
 * 
 * Example Payload (Clear a setting):
 * {
 *   "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
 *   "updated_search_company_with_ai": null
 * }
 * 
 * Example Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "settings": {
 *       "add_leads_default_options": {
 *         "source": "linkedin",
 *         "limit": 20
 *       },
 *       "verify_emails_clearout_default_options": {
 *         "timeout": 45
 *       }
 *     }
 *   },
 *   "message": "User settings updated successfully",
 *   "timestamp": "2025-07-07T10:20:45.123Z"
 * }
 * 
 * Example Error Response (404):
 * {"error": "User settings not found for this user_id"}
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid user_id. Must be a valid UUID string"}
 * 
 * Example Error Response (400):
 * {"error": "Invalid update fields: updated_unknown_setting. Valid aliases are: add_leads, create_variables_with_ai, ..."}
 * 
 * Example Error Response (400):
 * {"error": "No update fields provided. At least one updated_<setting> field must be specified"}
 */
