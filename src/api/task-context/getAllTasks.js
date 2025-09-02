import { useQuery } from '@tanstack/react-query'
import { buildSearchParams } from '@/utils/searchParams'

/**
 * Internal fetch function for the actual API call.
 * Accepts a params object with snake_case keys.
 */

const fetchTasks = async (params) => {
  if (!params?.user_id) {
    console.warn('fetchTasks: user_id is not defined. Returning null.')
    return null
  }

  const searchParams = buildSearchParams(params, { omitEmpty: true })
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/getAllTasks?${searchParams.toString()}`

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
  
  return result
}

/**
 * Custom hook to fetch tasks.
 * Can fetch all tasks for a user or a single task if taskId is provided.
 * When user_id is not provided, this hook returns null and will not perform any network request.
 *
 * @param {string | { userId: string, taskId?: string }} paramsOrUserId - User ID string or an object containing userId and optional taskId.
 */
/**
 * Canonical hook for fetching tasks with filters/sorting/pagination.
 */
export const useGetAllTasksQuery = ({ userId, taskId, ...query }) => {
  return useQuery({
    queryKey: ['tasks', userId, { taskId, ...query }],
    queryFn: () => fetchTasks({ user_id: userId, task_id: taskId, ...query }),
    enabled: Boolean(userId),
    keepPreviousData: true,
    staleTime: 60000,
    cacheTime: 300000,
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}


/**
 * Fetches all tasks for a user.
 * 
 * Query Parameters:
 * - user_id (required): UUID of the user
 * - task_id (optional): UUID of a specific task to fetch; if provided overrides normal list
 * - title (optional): Filter by case-insensitive partial match on title
 * - description (optional): Filter by case-insensitive partial match on description
 * - status (optional): Filter by status enum (open, in_progress, done, canceled, overdue); invalid values ignored
 * - due_date_from (optional): Filter tasks due on or after this date (YYYY-MM-DD)
 * - due_date_to (optional): Filter tasks due on or before this date (YYYY-MM-DD, inclusive)
 * - ended_at_from (optional): Filter tasks ended on or after this date (YYYY-MM-DD)
 * - ended_at_to (optional): Filter tasks ended on or before this date (YYYY-MM-DD, inclusive)
 * - sort_by (optional): Column to sort by (due_date, ended_at, created_at)
 * - sort_dir (optional): Sort direction asc|desc (default asc when sort_by present; legacy default created_at desc when sort_by omitted)
 * 
 * Example Requests:
 * 
 * All tasks (legacy behavior):
 * GET /getAllTasks?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f
 * 
 * Single task (legacy behavior):
 * GET /getAllTasks?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&task_id=5d3e2f36-8db3-49c2-93e6-96bf9f632d66
 * 
 * Filter by title:
 * GET /getAllTasks?user_id=...&title=review
 * 
 * Filter by due_date range:
 * GET /getAllTasks?user_id=...&due_date_from=2025-07-01&due_date_to=2025-07-31
 * 
 * Filter by ended_at range:
 * GET /getAllTasks?user_id=...&ended_at_from=2025-07-01&ended_at_to=2025-08-01
 * 
 * Sort by due_date asc:
 * GET /getAllTasks?user_id=...&sort_by=due_date&sort_dir=asc
 * 
 * Sort by created_at asc (explicit):
 * GET /getAllTasks?user_id=...&sort_by=created_at
 * 
 * Example Success Response (200):
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
 * Example Error Response (400):
 * {"error": "Missing required query param: user_id"}
 */
