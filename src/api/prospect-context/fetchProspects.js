import { useQuery } from '@tanstack/react-query'

// Internal fetch function for the actual API call
const fetchProspects = async (params) => {
  if (!params?.user_id) {
    console.warn('fetchProspects: user_id is not defined. Returning null.')
    return null
  }
  // Build query string, omitting undefined/null values
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value)
    }
  })
  
  const response = await fetch(`https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/getAllProspects?${searchParams.toString()}`, {
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
export const useProspectsQuery = ({ userId, ...query }) => {
  return useQuery({
    queryKey: ['prospects', userId, query],
    queryFn: () => fetchProspects({ user_id: userId, ...query }),
    enabled: Boolean(userId), // Only run query if userId is defined
    initialData: null, // Return null if query is not enabled
    keepPreviousData: true, // Keep old data visible while refetching
    staleTime: 60000, // 60 seconds - prospects data is relatively stable
    cacheTime: 300000, // 5 minutes cache
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000* 2** attemptIndex, 30000),
  })
}

/**
* Fetches prospects for a user with server-side filtering, sorting, and pagination.
* 
* Query Parameters:
* - user_id (required): UUID of the user
* - page (optional): Page number, default 1
* - page_size (optional): Results per page, default 10, max 100
* - sort_by (optional): Column to sort by (first_name, last_name, status, etc.)
* - sort_dir (optional): Sort direction, 'asc' or 'desc', default 'asc'
* - q (optional): Global search term across specified fields
* - search_fields (optional): Comma-separated list of fields to search in. 
*   Available fields:
*   - Prospect fields: first_name, last_name, headline, location, title
*   - Company fields: company_name, company_website, company_industry, company_size, company_location
*   - Related data: notes, task_titles, task_descriptions, group_names, campaign_names, variable_name, enrichment_types, enrichment_prompt_names
*   Default: all fields if q is provided
* - status (optional): Filter by prospect status
* - in_group (optional): 'yes' or 'no' to filter by group membership
* - group_name (optional): Filter by specific group name (deprecated, use group_names)
* - group_names (optional): Comma-separated list of group names to filter by
* - in_campaign (optional): 'yes' or 'no' to filter by campaign membership
* - campaign_name (optional): Filter by specific campaign name (deprecated, use campaign_names)
* - campaign_names (optional): Comma-separated list of campaign names to filter by
* - prompt_names (optional): Comma-separated list of prompt names to filter by enrichments (matches prompts used on prospect OR company enrichments)
* - has_bd_scrape (optional): Filter by BD scrape enrichment flag
* - has_deep_search (optional): Filter by deep search enrichment flag
* 
* Example Requests:
* 
* Basic search:
* GET /getAllProspects?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&page=1&page_size=10
* 
* Search with enrichment filters:
* GET /getAllProspects?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&has_deep_search=true&has_bd_scrape=false
* 
* Search in specific fields:
* GET /getAllProspects?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&q=john&search_fields=first_name,last_name
* 
* Search in company data:
* GET /getAllProspects?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&q=tech&search_fields=company_name,company_industry
* 
* Search in notes and tasks:
* GET /getAllProspects?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&q=meeting&search_fields=notes,task_titles,task_descriptions
* 
* Search in enrichment types:
* GET /getAllProspects?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&q=bd&search_fields=enrichment_types
* 
* Search in enrichment prompt names:
* GET /getAllProspects?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&q=initial&search_fields=enrichment_prompt_names
* 
* Combined filters:
* GET /getAllProspects?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&q=manager&search_fields=title,headline&status=new&sort_by=created_at&sort_dir=desc
* 
* Multi-value filters:
* GET /getAllProspects?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&group_names=VCs,Angels&campaign_names=Q1%20Outreach,Q2%20Follow-up
* 
* Prompt-based filtering:
* GET /getAllProspects?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&prompt_names=Initial%20Pitch,Follow-up%20Research
* 
* Example Success Response (200):
* {
*   "data": [
*     {
*       "linkedin_id": "elizaveta-sheshko",
*       "first_name": "Lizaveta",
*       "last_name": "Sheshka",
*       "headline": "IT Innovations Manager | FTECH",
*       "title": "IT Innovation Manager",
*       "status": "new",
*       "location": "Poland",
*       "email": {
*         "id": "e1d2c3b4-f5a6-7890-1234-567890abcdef",
*         "email": "test@example.com",
*         "status": "valid",
*         "created_at": "2025-07-20T12:00:00Z",
*         "last_verification": [
*           {
*             "id": "v1d2c3b4-f5a6-7890-1234-567890abcdef",
*             "email_id": "e1d2c3b4-f5a6-7890-1234-567890abcdef",
*             "verification_status": "valid",
*             "safe_to_send": "yes",
*             "verified_on": "2025-07-21T09:00:00Z",
*             "disposable": "no",
*             "free": "no",
*             "role": "no",
*             "gibberish": "no",
*             "bounce_type": null,
*             "created_at": "2025-07-21T09:00:00Z"
*           }
*         ]
*       },
*       "company_name": null,
*       "has_bd_scrape": true,
*       "has_deep_search": false,
*       "note_count": 1,
*       "task_count": 1,
*       "notes": [
*         {
*           "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
*           "body": "Follow up on initial contact."
*         }
*       ],
*       "tasks": [
*         {
*           "id": "f1e2d3c4-b5a6-9876-5432-10fedcba9876",
*           "title": "Schedule demo call",
*           "status": "open",
*           "due_date": "2025-08-01",
*           "description": "Prepare presentation for product demo."
*         }
*       ],
*       "groups": [
*         {
*           "id": "3ecaa693-ee42-4e1a-82a9-7a959d719b15",
*           "name": "test group"
*         }
*       ],
*       "campaigns": [],
*       "variables": [
*         {
*           "id": "d4508141-7727-418a-87a3-a10339bcbfa7",
*           "name": "some name",
*           "value": "some description"
*         }
*       ],
*       "enrichments": [
*         {
*           "id": "8e9f9c16-4ff8-4678-8064-f5ab5a62ea59",
*           "type": "bd_scrape",
*           "prompt_id": null,
*           "entity_kind": "prospect",
*           "prompt_name": null
*         },
*         {
*           "id": "8f150696-6ae9-4e53-bc23-d9230adee62f",
*           "type": "bd_scrape",
*           "prompt_id": null,
*           "entity_kind": "company",
*           "prompt_name": null
*         }
*       ],
*       "last_log": {
*         "prospect_log_id": "some-log-id-1",
*         "prospect_success": true,
*         "prospect_created_at": "2025-07-30T10:00:00Z",
*         "id": "some-log-entry-id-1",
*         "action": "email_sent",
*         "status": "completed",
*         "start_time": "2025-07-30T09:59:00Z",
*         "end_time": "2025-07-30T10:00:00Z",
*         "duration_ms": 60000
*       }
*     }
*   ],
*   "total": 1,
*   "page": 1,
*   "page_size": 10
* }
* 
* Example Error Responses:
* 
* Missing user_id (400):
* {"error": "Missing required query param: user_id"}
* 
* Invalid search field (400):
* {"error": "Parameter validation failed: Invalid search field \"invalid_field\". Must be one of: first_name, last_name, headline, location, title, company_name, company_website, company_industry, company_size, company_location, notes, task_titles, task_descriptions, group_names, campaign_names, variable_name, enrichment_types, enrichment_prompt_names"}
* 
* Invalid page size (400):
* {"error": "Parameter validation failed: Value 150 exceeds maximum of 100"}
* 
* Database error (500):
* {"error": "Database error: [specific error message]"}
*/
