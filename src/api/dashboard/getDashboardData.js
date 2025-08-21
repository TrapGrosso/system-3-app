import { useQuery } from '@tanstack/react-query'

const getDashboardData = async (params) => {
  const { userId, lookbackDays, campaignsLimit, topN, thresholds, ...extra } = params

  const searchParams = new URLSearchParams({
    user_id: userId,
  })

  if (lookbackDays) searchParams.append('lookbackDays', String(lookbackDays))
  if (campaignsLimit) searchParams.append('campaignsLimit', String(campaignsLimit))
  if (topN) searchParams.append('topN', String(topN))
  if (thresholds) {
    if (typeof thresholds === 'object') {
      searchParams.append('thresholds', JSON.stringify(thresholds))
    } else {
      searchParams.append('thresholds', String(thresholds))
    }
  }

  Object.entries(extra).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      searchParams.append(key, String(value))
    }
  })

  const response = await fetch(`https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/getDashboardData?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
    },
  })

  if (!response.ok) {
    let errorMsg = 'Failed to fetch dashboard data'
    try {
      const err = await response.json()
      if (err?.error) errorMsg = err.error
    } catch {
      // ignore parse errors
    }
    throw new Error(errorMsg)
  }

  const result = await response.json()
  return result || {}
}

export const useDashboardDataQuery = (params) => {
  return useQuery({
    queryKey: ['getDashboardData', params.userId, params],
    queryFn: () => getDashboardData(params),
    staleTime: 30000, // 30 seconds 
    cacheTime: 300000, // 5 minutes cache
    refetchInterval: 60000, // Refetch every minute 
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}


/**
 * Fetches dashboard aggregates for a user, combining campaigns, prospects, tasks,
 * logs, queues, and engagement metrics into a single payload.
 *
 * Method: GET
 * CORS: Supported (OPTIONS preflight)
 *
 * Query Parameters:
 * - user_id (required): UUID of the user. Must be valid UUID format.
 * - lookbackDays (optional): Positive integer (1–90). Default 7. Defines lookback window for
 *   activity (tasks, logs, prospects).
 * - campaignsLimit (optional): Positive integer (1–100). Default 5. Maximum campaigns fetched.
 * - topN (optional): Positive integer (1–50). Default 5. Maximum top-performing items.
 * - thresholds (optional): JSON object (URL-encoded) with numeric fields in [0,1]:
 *   - lowOpenRate: default 0.15
 *   - lowReplyRate: default 0.02
 *   - highBounceRate: default 0.05
 *
 * Example Requests:
 *
 * Minimal:
 * GET /getDashboardData?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f
 *
 * With optional params:
 * GET /getDashboardData?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&lookbackDays=14&campaignsLimit=10&topN=5
 *
 * With thresholds param as object (auto encoded to JSON):
 * useDashboardDataQuery({
 *   userId: "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
 *   thresholds: { lowOpenRate: 0.2, lowReplyRate: 0.05 }
 * })
 * -> GET /getDashboardData?...&thresholds=%7B%22lowOpenRate%22%3A0.2%2C%22lowReplyRate%22%3A0.05%7D
 *
 * Full:
 * GET /getDashboardData?user_id=bb370a65-08df-4ddc-8a0f-aa5c65fc568f&lookbackDays=7&campaignsLimit=5&topN=5&thresholds=%7B%22lowOpenRate%22%3A0.15%2C%22lowReplyRate%22%3A0.02%2C%22highBounceRate%22%3A0.05%7D
 *
 * Example Success Response (200):
 * {
 *   "meta": {
 *     "generatedAt": "2025-08-21T16:08:17.569Z",
 *     "lookbackDays": 7,
 *     "campaignsLimit": 5,
 *     "topN": 5,
 *     "thresholds": {
 *       "lowOpenRate": 0.15,
 *       "lowReplyRate": 0.02,
 *       "highBounceRate": 0.05
 *     }
 *   },
 *   "campaigns": {
 *     "running": [
 *       {
 *         "id": "c1",
 *         "name": "Q3 Outreach",
 *         "status": "active",
 *         "analytics": {
 *           "open_rate": 0.40,
 *           "reply_rate": 0.07,
 *           "bounce_rate": 0.01,
 *           "emails_sent_count": 100,
 *           "open_count": 40,
 *           "reply_count": 7,
 *           "bounced_count": 1
 *         },
 *         "steps": [
 *           {
 *             "campaign_id": "c1",
 *             "step_number": 1,
 *             "sent": 100,
 *             "opened": 40,
 *             "replies": 7,
 *             "clicks": 5,
 *             "open_rate": 0.40,
 *             "reply_rate": 0.07,
 *             "click_rate": 0.05
 *           }
 *         ]
 *       }
 *     ],
 *     "bestPerforming": [
 *       {
 *         "id": "c1",
 *         "name": "Q3 Outreach",
 *         "reply_rate": 0.07,
 *         "open_rate": 0.40,
 *         "bounce_rate": 0.01,
 *         "emails_sent_count": 100
 *       }
 *     ],
 *     "needsAttention": {
 *       "lowPerformance": [],
 *       "highBounceRate": [],
 *       "codes": {
 *         "accountSuspended": [],
 *         "accountsUnhealthy": [],
 *         "bounceProtect": []
 *       }
 *     }
 *   },
 *   "prospects": {
 *     "newlyAdded": {
 *       "count": 1,
 *       "items": [
 *         {
 *           "linkedin_id": "p1",
 *           "created_at": "2025-08-20T14:00:00Z",
 *           "first_name": "Jane",
 *           "last_name": "Doe",
 *           "inCampaign": true
 *         }
 *       ]
 *     },
 *     "dataCompleteness": {
 *       "total": 94,
 *       "hasEmail": {
 *         "count": 20,
 *         "pct": 0.2127659574468085
 *       },
 *       "emailSafeToSend": {
 *         "count": 4,
 *         "pct": 0.0425531914893617
 *       },
 *       "hasCompany": {
 *         "count": 53,
 *         "pct": 0.5638297872340425
 *       },
 *       "hasEnrichment": {
 *         "count": 94,
 *         "pct": 1
 *       }
 *     }
 *   },
 *   "tasks": {
 *     "overdue": [
 *       {
 *         "id": "a27f37e9-ccb0-468d-a3cf-beec772cc914",
 *         "title": "Some title",
 *         "due_date": "2025-07-01",
 *         "status": "overdue",
 *         "prospect": {
 *           "linkedin_id": "carlosdeleonlang",
 *           "name": "Carlos Deleon"
 *         }
 *       }
 *     ],
 *     "aboutToOverdue": [],
 *     "recentlyCompleted": []
 *   },
 *   "activity": {
 *     "recentLogs": {
 *       "byStatus": {
 *         "success": 6,
 *         "failed": 1,
 *         "in_progress": 0
 *       },
 *       "byAction": [
 *         {
 *           "action": "create_variables",
 *           "success": 3,
 *           "failed": 0,
 *           "in_progress": 0
 *         }
 *       ],
 *       "items": [
 *         {
 *           "id": "a1a4c806-4240-45bc-a388-72b23fec096b",
 *           "action": "create_variables",
 *           "status": "success",
 *           "message": "✅ Variable Creation completed with 100% success rate",
 *           "start_time": "2025-08-18T19:04:03.616",
 *           "end_time": "2025-08-18T19:04:17.533",
 *           "prospects": [
 *             {
 *               "linkedin_id": "maximilianmessing",
 *               "name": "Maximilian Messing"
 *             }
 *           ]
 *         }
 *       ],
 *       "failedOperations": [
 *         {
 *           "id": "15f3d028-1d33-4331-9591-203934f9a892",
 *           "action": "deep_search",
 *           "status": "failed",
 *           "message": "AI WEB SEARCH ENRICHMENT REPORT",
 *           "start_time": "2025-08-18T18:44:18.185",
 *           "end_time": "2025-08-18T18:45:06.709",
 *           "prospects": [
 *             {
 *               "linkedin_id": "maximilianmessing",
 *               "name": "Maximilian Messing"
 *             }
 *           ],
 *           "retry_eligible": false
 *         }
 *       ]
 *     }
 *   },
 *   "queues": {
 *     "deepSearch": {
 *       "total": 10,
 *       "byPrompt": [
 *         {
 *           "prompt_id": "6b55c92a-6dd8-4372-a804-39b9f2bea411",
 *           "prompt_name": "search company history",
 *           "count": 10
 *         }
 *       ]
 *     }
 *   },
 *   "engagement": {
 *     "prompts": {
 *       "byVariables": [
 *         {
 *           "prompt_id": "c8ccb966-a570-4237-ab94-ed47a4dcf8d0",
 *           "prompt_name": "icebreaker reccomendation",
 *           "count": 15
 *         }
 *       ],
 *       "byDeepSearch": [
 *         {
 *           "prompt_id": "6b55c92a-6dd8-4372-a804-39b9f2bea411",
 *           "prompt_name": "search company history",
 *           "count": 10
 *         }
 *       ],
 *       "top": [
 *         {
 *           "prompt_id": "c8ccb966-a570-4237-ab94-ed47a4dcf8d0",
 *           "prompt_name": "icebreaker reccomendation",
 *           "variables": 15,
 *           "deepSearch": 0,
 *           "totalUsage": 15
 *         }
 *       ]
 *     }
 *   }
 * }
 *
 * Example Error Responses:
 *
 * 400 Missing user_id:
 * {"error": "Missing required query param: user_id"}
 *
 * 400 Invalid user_id format:
 * {"error": "Invalid user_id format. Must be a valid UUID"}
 *
 * 400 Invalid thresholds JSON:
 * {"error": "Invalid thresholds JSON"}
 *
 * 400 Out of range integer:
 * {"error": "Value 150 exceeds maximum of 100"}
 *
 * 500 Server configuration error:
 * {"error": "Server configuration error"}
 *
 * Operational Notes:
 * - Dates use server’s current time; all timestamps are ISO8601.
 * - Component warnings (e.g. partial fetch errors) are logged, not returned.
 * - Threshold JSON values must be URL-encoded.
 * - Rates are fractional values [0..1], not percentages.
 */
