import { useQuery } from '@tanstack/react-query'

/**
 * Normalizes input for task fetching to a consistent params object.
 * Supports string user_id for backward compatibility, or an object with userId and
 * optional taskId in camelCase, converting to snake_case for the API.
 */
const normalizeTaskParams = (paramsOrUserId) => {
  let params = {}
  if (typeof paramsOrUserId === 'string') {
    params = { user_id: paramsOrUserId }
  } else if (typeof paramsOrUserId === 'object' && paramsOrUserId !== null) {
    if (paramsOrUserId.userId) {
      params.user_id = paramsOrUserId.userId
    }
    if (paramsOrUserId.taskId) {
      params.task_id = paramsOrUserId.taskId
    }
  }
  return params
}

const fetchTasks = async (params) => {
  if (!params?.user_id) {
    console.warn('fetchTasks: user_id is not defined. Returning null.')
    return null
  }

  // Build query string, omitting undefined/null/empty values
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value)
    }
  })

  const url = `https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/getAllTasks?${searchParams.toString()}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch tasks')
  }

  const result = await response.json()
  console.log(result) // Keep original console.log as it was in the prompt
  
  return result
}

/**
 * Custom hook to fetch tasks.
 * Can fetch all tasks for a user or a single task if taskId is provided.
 * When user_id is not provided, this hook returns null and will not perform any network request.
 *
 * @param {string | { userId: string, taskId?: string }} paramsOrUserId - User ID string or an object containing userId and optional taskId.
 */
export const useGetAllTasks = (paramsOrUserId) => {
  const queryParams = normalizeTaskParams(paramsOrUserId) // Normalize input for queryFn
  
  // Use the normalized queryParams object directly in queryKey for consistent caching
  return useQuery({
    queryKey: ['getAllTasks', queryParams], // queryKey now uses the normalized object
    queryFn: () => fetchTasks(queryParams), // Pass the normalized object to the fetch function
    enabled: Boolean(queryParams.user_id), // Only run query if user_id is defined
    initialData: null, // Return null if query is not enabled
    staleTime: 30000,
    cacheTime: 300000,
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

/**
 * Fetches all tasks for a user or a specific task if taskId is provided.
 *
 * Query Parameters:
 * - user_id (required): UUID of the user
 * - task_id (optional): UUID of the specific task to fetch
 *
 * Example Requests:
 *
 * Fetch all tasks for a user:
 * GET /getAllTasks?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f
 *
 * Fetch a single task by ID for a user:
 * GET /getAllTasks?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&task_id=5d3e2f36-8db3-49c2-93e6-96bf9f632d66
 *
 * Example Success Response (200) for all tasks:
 * [
 *   {
 *     "id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *     "prospect_id": "john-doe-123",
 *     "title": "Follow up call",
 *     "description": "Call John to discuss the proposal",
 *     "due_date": "2025-07-10",
 *     "status": "open",
 *     "created_at": "2025-07-04T18:35:22.123456"
 *   },
 *   {
 *     "id": "0c52c1f7-1b77-4d6f-9e0e-3e75baff7461",
 *     "prospect_id": null,
 *     "title": "Review quarterly targets",
 *     "description": null,
 *     "due_date": "2025-07-15",
 *     "status": "in_progress",
 *     "created_at": "2025-07-03T10:02:11.987654"
 *   }
 * ]
 *
 * Example Success Response (200) for a single task:
 * {
 *   "id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *   "prospect_id": "john-doe-123",
 *   "title": "Follow up call",
 *   "description": "Call John to discuss the proposal",
 *   "due_date": "2025-07-10",
 *   "status": "open",
 *   "created_at": "2025-07-04T18:35:22.123456"
 * }
 *
 * Example Error Response (400):
 * {"error": "Missing required query param: user_id"}
 * {"error": "Failed to fetch tasks"} // Generic error or detailed from backend.
 */
