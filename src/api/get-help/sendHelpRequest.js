import { useMutation } from '@tanstack/react-query'

const sendHelpRequest = async (payload) => {
  const isFormData = payload instanceof FormData
  
  const headers = {
    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
  }
  
  // Only set Content-Type for JSON, let browser set it for FormData
  if (!isFormData) {
    headers['Content-Type'] = 'application/json'
  }
  
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sendHelpRequest`, {
    method: 'POST',
    headers,
    body: isFormData ? payload : JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error)
  }

  return response.json()
}

export const useSendHelpRequest = (options = {}) => {
  return useMutation({
    mutationFn: sendHelpRequest,
    onSuccess: (data) => {
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error sending help request:', error)
      options.onError?.(error)
    },
  })
}

/**
 * Sends a help request with optional file attachments.
 * Supports both JSON payloads and FormData (for file uploads).
 * 
 * Example JSON Payload:
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "type": "technical_support",
 *   "title": "Need assistance with campaign setup",
 *   "description": "I'm having trouble configuring the email sequence for my campaign..."
 * }
 * 
 * Example FormData Payload (with attachment):
 * // This would be constructed in the browser
 * // const formData = new FormData()
 * // formData.append('user_id', 'a555dbda-15b9-41fb-96ed-1feb643f22e7')
 * // formData.append('type', 'technical_support')
 * // formData.append('title', 'Need assistance with campaign setup')
 * // formData.append('description', 'I'm having trouble configuring the email sequence for my campaign...')
 * // formData.append('screenshot', fileInput.files[0]) // Optional file attachment
 * 
 * Example Success Response (200):
 * {
 *   "message": "Help request forwarded",
 *   "files_forwarded": 1,
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "webhook_status": 200,
 *   "timestamp": "2025-07-07T10:20:45.123Z"
 * }
 * 
 * Example Error Response (400):
 * {"error": "Valid user_id (UUID) is required"}
 * 
 * Example Error Response (400):
 * {"error": "type is required"}
 * 
 * Example Error Response (400):
 * {"error": "title is required"}
 * 
 * Example Error Response (400):
 * {"error": "description is required"}
 */