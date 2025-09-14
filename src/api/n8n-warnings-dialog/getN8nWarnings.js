import { useQuery } from '@tanstack/react-query'

const getN8nWarnings = async (include_seen = false) => {

    const params = new URLSearchParams({
        include_seen
    })

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/getN8nWarnings?${params.toString()}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
    },
    })

    if (!response.ok) {
    throw new Error('Failed to fetch add groups')
    }

    const result = await response.json()

    return result || []
}

export const useGetN8nWarnings = (include_seen) => {
  return useQuery({
    queryKey: ['getN8nWarnings', include_seen],
    queryFn: () => getN8nWarnings(include_seen),
    staleTime: 30000, // 30 seconds - logs are relatively fresh data
    cacheTime: 300000, // 5 minutes cache
    refetchInterval: 60000, // Refetch every minute to get latest logs
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

/**
 * Fetches n8n execution warnings.
 * 
 * Query Parameters:
 * - include_seen (optional): Boolean flag to include seen warnings. 
 *   - If omitted or false: returns only unseen warnings (default behavior)
 *   - If true: returns all warnings (both seen and unseen)
 * 
 * Example Requests:
 * 
 * Get only unseen warnings (default):
 * GET /getN8nWarnings
 * 
 * Get only unseen warnings (explicit):
 * GET /getN8nWarnings?include_seen=false
 * 
 * Get all warnings:
 * GET /getN8nWarnings?include_seen=true
 * 
 * Example Success Response (200):
 * [
 *   {
 *     "id": 12345,
 *     "execution_id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *     "workflow_id": "0c52c1f7-1b77-4d6f-9e0e-3e75baff7461",
 *     "workflow_name": "Email Campaign Workflow",
 *     "node_name": "Send Email Node",
 *     "error_message": "Connection timeout",
 *     "error_details": {"code": "TIMEOUT", "details": "Connection timed out after 30 seconds"},
 *     "failed_at": "2025-07-04T18:35:22.123456+00:00",
 *     "seen": false,
 *     "level": "fatal"
 *   }
 * ]
 * 
 * Example Error Response (400):
 * {"error": "Invalid boolean value \"invalid\". Must be true/false, 1/0, or yes/no"}
 */
