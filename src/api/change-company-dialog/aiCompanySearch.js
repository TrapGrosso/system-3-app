import { useMutation } from '@tanstack/react-query'

const aiCompanySearch = async (payload) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/searchProspectCompaniesWithAi`, {
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

export const useAiCompanySearch = (options = {}) => {
  return useMutation({
    mutationFn: aiCompanySearch,
    onSuccess: (data) => {
      console.log('Leads submitted successfully:', data)
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error submitting leads:', error)
      options.onError?.(error)
    },
  })
}

/**
 * Main edge function handler for sending prospect enrichments to a webhook.
 * 
 * This function receives a POST request with a user ID and a list of prospect IDs.
 * It fetches prospect records where company_id is null and then retrieves their
 * associated 'bd_scrape' enrichments. Finally, it sends this combined data
 * to a predefined external webhook.
 * 
 * Example Payload:
 * {
 *   "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
 *   "prospect_ids": ["prospect1_linkedin_id", "prospect2_linkedin_id"],
 *   "options": { agent_precision: "default", flags: [] }
 * }
 * 
 * Example Success Response (200):
 * {
 *   "message": "Processed 2 prospects, sent 2 records to webhook."
 * }
 * 
 * Example Error Responses:
 * - 400 Bad Request: Invalid JSON, missing/invalid user_id or prospect_ids, or no matching prospects found.
 * - 405 Method Not Allowed: If the request method is not POST or OPTIONS.
 * - 500 Internal Server Error: Server configuration issues, database errors, or webhook activation failures.
 */
