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

// Updated fetchProspects with error fallback logic
const fetchProspects = async (params) => {
  try {
    return await innerFetch(params)
  } catch (error) {
    // If we have filters/params beyond user_id, try fallback with only user_id
    if (params.user_id && Object.keys(params).length > 1) {
      console.warn('Fetch with filters failed, retrying with only user_id:', error.message)
      return await innerFetch({ user_id: params.user_id })
    }
    // Re-throw error if it's already a minimal request or no user_id
    throw error
  }
}

// Legacy hook for backward compatibility (will be deprecated)
export const useFetchProspects = (userId) => {
  return useQuery({
    queryKey: ['prospects', userId],
    queryFn: () => fetchProspects({ user_id: userId }),
    staleTime: 60000, // 60 seconds - prospects data is relatively stable
    cacheTime: 300000, // 5 minutes cache
    refetchInterval: 120000, // Refetch every 2 minutes to get latest prospects
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

// New hook for server-side filtered/sorted/paginated prospects with fallback
export const useProspectsQuery = ({ userId, ...query }) => {
  return useQuery({
    queryKey: ['prospects', userId, query],
    queryFn: async () => {
      try {
        // Try with all filters first
        return await fetchProspects({ user_id: userId, ...query })
      } catch (error) {
        // If it fails and we have filters, fallback to just user_id
        const hasFilters = Object.keys(query).some(key => 
          query[key] !== '' && query[key] !== null && query[key] !== undefined
        )
        
        if (hasFilters) {
          console.warn('Query with filters failed, falling back to user_id only:', error.message)
          
          try {
            const fallbackResult = await fetchProspects({ user_id: userId })
            
            // Mark the result to indicate it's fallback data
            fallbackResult._isFallback = true
            fallbackResult._originalError = error.message
            
            return fallbackResult
          } catch (fallbackError) {
            // If even the fallback fails, throw the original error
            throw error
          }
        } else {
          // If no filters were applied, just throw the error
          throw error
        }
      }
    },
    keepPreviousData: true, // Keep old data visible while refetching
    staleTime: 60000, // 60 seconds - prospects data is relatively stable
    cacheTime: 300000, // 5 minutes cache
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
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
 * - group_name (optional): Filter by specific group name
 * - in_campaign (optional): 'yes' or 'no' to filter by campaign membership
 * - campaign_name (optional): Filter by specific campaign name
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
 *       "email": null,
 *       "company_name": "FTECH",
 *       "has_bd_scrape": true,
 *       "has_deep_search": false,
 *       "note_count": 2,
 *       "task_count": 1,
 *       "groups": [
 *         {
 *           "id": "3ecaa693-ee42-4e1a-82a9-7a959d719b15",
 *           "name": "test group"
 *         }
 *       ],
 *       "campaigns": []
 *     }
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
