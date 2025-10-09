import { useMutation } from '@tanstack/react-query'

const retryLog = async (payload) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/retryLog`, {
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

export const useRetryLog = (options = {}) => {
  return useMutation({
    mutationFn: retryLog,
    onSuccess: (data) => {
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error retrying log provided', error)
      options.onError?.(error)
    },
  })
}

/**
 * Retry Log Function
 * 
 * This function handles retrying failed operations by:
 * 1. Validating the request with user_id and log_id
 * 2. Fetching the log record with status='failed' and retry_eligible=true
 * 3. Validating the retry_payload is a plain object
 * 4. Building a webhook URL based on the action in the log
 * 5. Adding is_retry: true to the payload options
 * 6. Sending the modified payload to the webhook
 * 7. Updating the log record with retried_at timestamp and retry_eligible=false
 * 
 * Example Request:
 * {
 *   "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
 *   "log_id": "123e4567-e89b-12d3-a456-426614174000"
 * }
 * 
 * Example Success Response (200):
 * {
 *   "success": true,
 *   "message": "Retry triggered successfully",
 *   "log_id": "123e4567-e89b-12d3-a456-426614174000"
 * }
 * 
 * Example Error Responses:
 * - 400: Invalid request body, log not found or not eligible, invalid retry_payload
 * - 405: Method not allowed
 * - 500: Server configuration error, database errors
 * - 502: Webhook activation failure
 * 
 * Environment Variables Required:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - N8N_INSTANCE_URL
 * 
 * Action Registry:
 * - add_leads -> add-leads webhook
 * 
 * Note: The outgoing payload will have options.is_retry = true, but the log record 
 * will have is_retry = false since this is not a retry of a previous retry attempt.
 */