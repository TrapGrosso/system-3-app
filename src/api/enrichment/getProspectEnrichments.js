import { useQuery } from '@tanstack/react-query'

// Internal fetch function for the actual API call
const getProspectEnrichments = async (params) => {
  // Build query string, omitting undefined/null values
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value)
    }
  })
  
  const response = await fetch(`https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/getProspectsEnrichments?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error)
  }

  const result = await response.json()
  
  // Return the API payload unmodified: { data, total, page, page_size }
  return result
}

// Hook for server-side filtered/sorted/paginated prospects
export const useGetProspectEnrichments = ({ userId, ...query }) => {
  return useQuery({
    queryKey: ['getProspectEnrichments', userId, query],
    queryFn: () => getProspectEnrichments({ user_id: userId, ...query }),
    keepPreviousData: true, // Keep old data visible while refetching
    staleTime: 60000, // 60 seconds - prospects data is relatively stable
    cacheTime: 300000, // 5 minutes cache
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000* 2** attemptIndex, 30000),
  })
}



/**
 * Fetches prospect-centered enrichment bundles for a user, including all related data.
 * Returns only prospects with their enrichments, companies, and variables - never standalone companies.
 * Enrichments exclude raw_data to keep responses lightweight.
 * 
 * Query Parameters:
 * - user_id (required): UUID of the user
 * - page (optional): Page number, default 1
 * - page_size (optional): Results per page, default 10, max 100
 * - type (optional): Comma-separated list of enrichment types to filter by
 * - prompt_name (optional): Comma-separated list of prompt names to filter enrichments by
 * - variable_name (optional): Comma-separated list of variable names to filter prospects by
 * - sort_by (optional): Column to sort by (created_at, first_name, last_name, company_name)
 * - sort_dir (optional): Sort direction, 'asc' or 'desc', default 'asc'
 * 
 * Example Requests:
 * 
 * Basic request:
 * GET /getProspectsEnrichments?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f
 * 
 * Filtered by enrichment type:
 * GET /getProspectsEnrichments?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&type=bd_scrape,deep_search
 * 
 * Filtered by prompt names:
 * GET /getProspectsEnrichments?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&prompt_name=linkedin_profile,company_research
 * 
 * Filtered by variable names:
 * GET /getProspectsEnrichments?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&variable_name=industry,role
 * 
 * Combined filters with pagination and sorting:
 * GET /getProspectsEnrichments?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&type=deep_search&prompt_name=company_research&variable_name=industry&page=2&page_size=20&sort_by=company_name&sort_dir=desc
 * 
 * Example Success Response (200):
 * {
 *   "data": [
 *     {
 *       "prospect": {
 *         "linkedin_id": "john-doe-123",
 *         "first_name": "John",
 *         "last_name": "Doe",
 *         "headline": "Software Engineer at Tech Corp",
 *         "title": "Senior Software Engineer",
 *         "status": "new",
 *         "location": "San Francisco, CA",
 *         "email": "john.doe@techcorp.com"
 *       },
 *       "company": {
 *         "linkedin_id": "tech-corp",
 *         "name": "Tech Corp",
 *         "website": "https://techcorp.com",
 *         "industry": "Technology",
 *         "size": "1000-5000",
 *         "location": "San Francisco, CA"
 *       },
 *       "prospect_enrichments": [
 *         {
 *           "id": "enrichment-uuid-1",
 *           "entity": "john-doe-123",
 *           "entity_kind": "prospect",
 *           "type": "bd_scrape",
 *           "source": "linkedin",
 *           "summary": { "key_points": "..." },
 *           "created_at": "2025-07-15T10:30:00.000Z",
 *           "prompt": {
 *             "id": "prompt-uuid-1",
 *             "name": "linkedin_profile"
 *           }
 *         }
 *       ],
 *       "company_enrichments": [
 *         {
 *           "id": "enrichment-uuid-2",
 *           "entity": "tech-corp",
 *           "entity_kind": "company",
 *           "type": "bd_scrape",
 *           "source": "linkedin",
 *           "summary": null,
 *           "created_at": "2025-07-15T10:25:00.000Z",
 *           "prompt": null
 *         }
 *       ],
 *       "variables": [
 *         {
 *           "id": "variable-uuid-1",
 *           "name": "industry",
 *           "value": "Technology",
 *           "tags": ["tech", "software"],
 *           "created_at": "2025-07-15T10:20:00.000Z"
 *         }
 *       ]
 *     }
 *   ],
 *   "total": 45,
 *   "page": 1,
 *   "page_size": 10
 * }
 * 
 * Example Error Responses:
 * 
 * Missing user_id (400):
 * {"error": "Missing required query param: user_id"}
 * 
 * Invalid sort field (400):
 * {"error": "Parameter validation failed: Invalid value \"invalid_field\". Must be one of: created_at, first_name, last_name, company_name"}
 * 
 * Invalid page size (400):
 * {"error": "Parameter validation failed: Value 150 exceeds maximum of 100"}
 * 
 * Database error (500):
 * {"error": "Database error: [specific error message]"}
 */
