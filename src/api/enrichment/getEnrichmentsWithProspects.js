import { useQuery } from '@tanstack/react-query'

// Internal fetch function for the actual API call
const getEnrichmentsWithProspects = async (params) => {
  // Build query string, omitting undefined/null values
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value)
    }
  })
  
  const response = await fetch(`https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/getEnrichments?${searchParams.toString()}`, {
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
export const useGetEnrichmentsWithProspects = ({ userId, ...query }) => {
  return useQuery({
    queryKey: ['prospects', userId, query],
    queryFn: () => getEnrichmentsWithProspects({ user_id: userId, ...query }),
    keepPreviousData: true, // Keep old data visible while refetching
    staleTime: 60000, // 60 seconds - prospects data is relatively stable
    cacheTime: 300000, // 5 minutes cache
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000* 2** attemptIndex, 30000),
  })
}



/**
 * Fetches all enrichments for a user and maps them back to prospects and companies.
 * Returns an array where each element contains prospect + company + related enrichments.
 * Each enrichment now includes its associated prompt information if available.
 * 
 * Query Parameters:
 * - user_id (required): UUID of the user
 * - page (optional): Page number, default 1
 * - page_size (optional): Results per page, default 10, max 100
 * - type (optional): Comma-separated list of enrichment types to filter by
 * - prompt_name (optional): Comma-separated list of prompt names to filter enrichments by
 * - has_company (optional): Boolean filter - true returns only bundles with companies, false returns only bundles without companies
 * - sort_by (optional): Column to sort by (created_at, first_name, last_name, company_name)
 * - sort_dir (optional): Sort direction, 'asc' or 'desc', default 'asc'
 * 
 * Example Requests:
 * 
 * Basic request:
 * GET /getEnrichments?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f
 * 
 * Filtered by enrichment type:
 * GET /getEnrichments?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&type=bd_scrape,deep_search
 * 
 * Filtered by prompt names:
 * GET /getEnrichments?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&prompt_name=linkedin_profile,company_research
 * 
 * Only bundles with companies:
 * GET /getEnrichments?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&has_company=true
 * 
 * Only bundles without companies:
 * GET /getEnrichments?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&has_company=false
 * 
 * Combined filters with pagination and sorting:
 * GET /getEnrichments?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&type=deep_search&prompt_name=company_research&has_company=true&page=2&page_size=20&sort_by=company_name&sort_dir=desc
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
 *           "raw_data": { "profile_data": "..." },
 *           "summary": null,
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
 *           "raw_data": { "company_data": "..." },
 *           "summary": null,
 *           "created_at": "2025-07-15T10:25:00.000Z",
 *           "prompt": null
 *         }
 *       ]
 *     },
 *     {
 *       "prospect": null,
 *       "company": {
 *         "linkedin_id": "another-company",
 *         "name": "Another Company",
 *         "website": "https://another.com",
 *         "industry": "Finance",
 *         "size": "100-500",
 *         "location": "New York, NY"
 *       },
 *       "prospect_enrichments": [],
 *       "company_enrichments": [
 *         {
 *           "id": "enrichment-uuid-3",
 *           "entity": "another-company",
 *           "entity_kind": "company",
 *           "type": "deep_search",
 *           "source": "web_scraping",
 *           "raw_data": { "research_data": "..." },
 *           "summary": { "key_insights": "..." },
 *           "created_at": "2025-07-15T09:15:00.000Z",
 *           "prompt": {
 *             "id": "prompt-uuid-2",
 *             "name": "company_research"
 *           }
 *         }
 *       ]
 *     }
 *   ],
 *   "total": 145,
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