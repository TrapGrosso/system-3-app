import { useQuery } from '@tanstack/react-query'

const getOperationDefaults = async (operation) => { 

    const params = operation 
        ? `${new URLSearchParams({ operation })}`
        : null

    const response = await fetch(`https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/getOperationDefaults${params}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
        },
    })

    if (!response.ok) {
        throw new Error('Failed to fetch prompts')
    }

    const result = await response.json()
    console.log(result)
    
    return result || []
    }

    export const useGetOperationDefaults = (operation) => {
    return useQuery({
        queryKey: ['getOperationDefaults', operation],
        queryFn: () => getOperationDefaults(operation),
        staleTime: 30000,
        cacheTime: 300000,
        refetchInterval: 60000, 
        refetchOnWindowFocus: true,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    })
}


/**
 * Fetches operation default settings from the 'operation_defaults' table.
 * 
 * This endpoint supports an optional 'operation' query parameter:
 * - If 'operation' is not provided, is empty, null, "All", or "all" (case-insensitive),
 *   it returns all records from the 'operation_defaults' table.
 * - If 'operation' is provided and a matching record is found, it returns that specific record.
 * - If 'operation' is provided but no matching record is found, it falls back to returning
 *   all records from the 'operation_defaults' table.
 * 
 * Example Requests:
 * GET /getOperationDefaults
 * GET /getOperationDefaults?operation=
 * GET /getOperationDefaults?operation=All
 * GET /getOperationDefaults?operation=all
 * GET /getOperationDefaults?operation=email_verification
 * 
 * Example Success Response (200 - all records):
 * [
 *   {
 *     "operation": "email_verification",
 *     "default_settings": { "provider": "x", "timeout_ms": 5000 },
 *     "updated_at": "2025-08-18T12:34:56.000Z"
 *   },
 *   {
 *     "operation": "prospect_enrichment",
 *     "default_settings": { "sources": ["linkedin","clearbit"] },
 *     "updated_at": "2025-08-18T12:35:56.000Z"
 *   }
 * ]
 * 
 * Example Success Response (200 - specific record):
 * [
 *   {
 *     "operation": "email_verification",
 *     "default_settings": { "provider": "x", "timeout_ms": 5000 },
 *     "updated_at": "2025-08-18T12:34:56.000Z"
 *   }
 * ]
 * 
 * Example Error Response (405):
 * {"error": "Method not allowed"}
 * 
 * Example Error Response (500):
 * {"error": "Server configuration error"}
 * {"error": "Database error: <message>"}
 */
