import { useQuery } from '@tanstack/react-query'

// Internal fetch function for the actual API call
const getAllCompanies = async (params) => {
  // Build query string, omitting undefined/null values
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value)
    }
  })
  
  const response = await fetch(`https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/getAllCompanies?${searchParams.toString()}`, {
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
export const useGetAllCompaniesQuery = ({ userId, ...query }) => {
  return useQuery({
    queryKey: ['companies', userId, query],
    queryFn: () => getAllCompanies({ user_id: userId, ...query }),
    keepPreviousData: true, // Keep old data visible while refetching
    staleTime: 60000, // 60 seconds - companies data is relatively stable
    cacheTime: 300000, // 5 minutes cache
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000* 2** attemptIndex, 30000),
  })
}


/**
 * Fetches companies for a user with server-side filtering, sorting, and pagination.
 * 
 * Query Parameters:
 * - user_id (required): UUID of the user
 * - page (optional): Page number, default 1
 * - page_size (optional): Results per page, default 10, max 100
 * - sort_by (optional): Column to sort by (name, industry, size, location)
 * - sort_dir (optional): Sort direction, 'asc' or 'desc', default 'asc'
 * - name (optional): Filter companies by name (case-insensitive partial match)
 * - industry (optional): Filter companies by industry (case-insensitive partial match)
 * - location (optional): Filter companies by location (case-insensitive partial match)
 * - size_op (optional): Size comparison operator (<, >, <=, >=, =)
 * - size_val (optional): Size value for comparison (number)
 * - prospect_first_name (optional): Filter by prospect first name (case-insensitive partial match)
 * - prospect_last_name (optional): Filter by prospect last name (case-insensitive partial match)
 * 
 * Example Requests:
 * 
 * Basic request:
 * GET /getAllCompanies?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&page=1&page_size=10
 * 
 * Filter by company name:
 * GET /getAllCompanies?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&name=tech
 * 
 * Filter by company size:
 * GET /getAllCompanies?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&size_op=>&size_val=100
 * 
 * Filter by prospect name:
 * GET /getAllCompanies?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&prospect_first_name=john
 * 
 * Sort by industry:
 * GET /getAllCompanies?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&sort_by=industry&sort_dir=desc
 * 
 * Combined filters:
 * GET /getAllCompanies?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&name=corp&size_op=>&size_val=50&sort_by=name
 * 
 * Example Success Response (200):
 * {
 *   "data": [
 *     {
 *       "linkedin_id": "1234567890",
 *       "name": "Tech Corp",
 *       "website": "https://techcorp.com",
 *       "industry": "Software",
 *       "size": "100-249",
 *       "location": "San Francisco, CA",
 *       "prospect_count": 5,
 *       "created_at": "2023-01-15T10:30:00Z",
 *       "updated_at": "2023-01-15T10:30:00Z"
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
 * Invalid user_id format (400):
 * {"error": "Invalid user_id format. Must be a valid UUID"}
 * 
 * Invalid size operator (400):
 * {"error": "Parameter validation failed: Invalid size operator \"<>\". Must be one of: <, >, <=, >=, ="}
 * 
 * Database error (500):
 * {"error": "Database error: [specific error message]"}
 */
