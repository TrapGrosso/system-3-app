import { useMutation } from '@tanstack/react-query'

const updateOperationDefaults = async (payload) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/updateOperationDefaults`, {
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

export const useUpdateOperationDefaults = (options = {}) => {
  return useMutation({
    mutationFn: updateOperationDefaults,
    onSuccess: (data) => {
      console.log('Operation updated successfully:', data)
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error updating operation:', error)
      options.onError?.(error)
    },
  })
}


/**
 * Updates the default settings for a specific operation.
 * 
 * Example Payload:
 * {
 *   "operation": "extract_emails",
 *   "updated_defaults_settings": {
 *     "max_retries": 3,
 *     "timeout_ms": 10000,
 *     "enable_cache": true
 *   }
 * }
 * 
 * Example Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "operation_defaults": {
 *       "operation": "extract_emails",
 *       "default_settings": {
 *         "max_retries": 3,
 *         "timeout_ms": 10000,
 *         "enable_cache": true
 *       },
 *       "updated_at": "2025-08-19T09:35:12.345Z"
 *     }
 *   },
 *   "message": "Operation defaults updated successfully",
 *   "timestamp": "2025-08-19T09:35:12.345Z"
 * }
 * 
 * Example Error Response (400):
 * {"error": "Invalid JSON in request body"}
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid operation. Must be a non-empty string"}
 * 
 * Example Error Response (400):
 * {"error": "Invalid updated_defaults_settings. Must be a non-empty object"}
 * 
 * Example Error Response (404):
 * {"error": "Operation not found"}
 * 
 * Example Error Response (405):
 * {"error": "Method not allowed"}
 * 
 * Example Error Response (500):
 * {"error": "Server configuration error"}
 */
