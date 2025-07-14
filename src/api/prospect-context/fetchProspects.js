import { useQuery } from '@tanstack/react-query'

// Internal fetch function for the actual API call
const innerFetch = async (params) => {
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

// Simple fetchProspects function - no internal fallback logic
const fetchProspects = innerFetch

// Hook for server-side filtered/sorted/paginated prospects
export const useProspectsQuery = ({ userId, ...query }) => {
  return useQuery({
    queryKey: ['prospects', userId, query],
    queryFn: () => fetchProspects({ user_id: userId, ...query }),
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
*   - Prospect fields: first_name, last_name, headline, location, email, title
*   - Company fields: company_name, company_website, company_industry, company_size, company_location
*   - Related data: notes, task_titles, task_descriptions, group_names, campaign_names, enrichment_data
*   Default: all fields if q is provided
* - status (optional): Filter by prospect status
* - in_group (optional): 'yes' or 'no' to filter by group membership
* - group_name (optional): Filter by specific group name (deprecated, use group_names)
* - group_names (optional): Comma-separated list of group names to filter by
* - in_campaign (optional): 'yes' or 'no' to filter by campaign membership
* - campaign_name (optional): Filter by specific campaign name (deprecated, use campaign_names)
* - campaign_names (optional): Comma-separated list of campaign names to filter by
* - prompt_names (optional): Comma-separated list of prompt names to filter by enrichments
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
*    {
*        "linkedin_id": "maximilianmessing",
*        "first_name": "Maximilian",
*        "last_name": "Messing",
*        "headline": "",
*        "title": "",
*        "status": "new",
*        "location": "Cologne, North Rhine-Westphalia, Germany",
*        "email": null,
*        "company_name": null,
*        "has_bd_scrape": true,
*        "has_deep_search": true,
*        "note_count": 2,
*        "task_count": 2,
*        "notes": [
*                    {
*                        "id": "4c317c77-fd19-4c47-bcbd-cafafb6c4a17",
*                        "body": "aaaa"
*                    },
*                    {
*                        "id": "a9706c0f-8934-43e9-9bff-1613a68e69f5",
*                        "body": "fanculo i neri"
*                    }
*                ],
*        "tasks": [
*            {
*                "id": "c396e6ef-2ee3-4233-93c4-75407a257065",
*                "title": "the task",
*                "status": "open",
*                "due_date": "2025-07-23",
*                "description": "salam"
*            },
*            {
*                "id": "1ebe404b-6ce5-4a8c-9293-969096447370",
*                "title": "task",
*                "status": "open",
*                "due_date": "2025-07-25",
*                "description": "really important task"
*            }
*          ],
*        "groups": [
*            {
*                "id": "8939a893-5363-4e0b-8fb1-138c27473bc5",
*                "name": "salam"
*            }
*        ],
*        "campaigns": []
*      }
*   ],
*   "total": 523,
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
* {"error": "Parameter validation failed: Invalid search field \"invalid_field\". Must be one of: first_name, last_name, headline, location, email, title, company_name, company_website, company_industry, company_size, company_location, notes, task_titles, task_descriptions, group_names, campaign_names, enrichment_data"}
* 
* Invalid page size (400):
* {"error": "Parameter validation failed: Value 150 exceeds maximum of 100"}
* 
* Database error (500):
* {"error": "Database error: [specific error message]"}
*/
