// Mock dashboard payload mirroring the real API shape.
// Purpose: comprehensive test data to exercise all dashboard UI sections.
//
// Usage example:
// import MOCK_DASHBOARD_DATA from '@/api/dashboard/mockDashboardData'
// or
// import { MOCK_DASHBOARD_DATA } from '@/api/dashboard/mockDashboardData'
//
// Then pass MOCK_DASHBOARD_DATA to your components or mock your data fetching layer.

export const MOCK_DASHBOARD_DATA = {
  meta: {
    generatedAt: '2025-08-21T17:59:59.000Z',
    lookbackDays: 90,
    campaignsLimit: 5,
    topN: 5,
    thresholds: {
      lowOpenRate: 0.15,
      lowReplyRate: 0.02,
      highBounceRate: 0.05,
    },
  },

  campaigns: {
    running: [
      {
        id: 'cmp-active-1',
        name: 'Q3 Outreach',
        status: 'active',
        user_id: 'bb370a65-08df-4ddc-8a0f-aa5c65fc568f',
        start_at: '2025-08-01T09:00:00.000Z',
        end_at: null,
        created_at: '2025-07-20T10:15:00.000Z',
        analytics: {
          campaign_id: 'cmp-active-1',
          emails_sent_count: 240,
          open_count: 108,
          reply_count: 22,
          bounced_count: 3,
          open_rate: 0.45,
          reply_rate: 0.0917,
          bounce_rate: 0.0125,
        },
        steps: [
          {
            campaign_id: 'cmp-active-1',
            step_number: '1',
            variant: '0',
            sent: 120,
            opened: 62,
            replies: 12,
            clicks: 8,
            open_rate: 0.5167,
            reply_rate: 0.1,
            click_rate: 0.0667,
          },
          {
            campaign_id: 'cmp-active-1',
            step_number: '1',
            variant: 'A',
            sent: 80,
            opened: 50,
            replies: 15,
            clicks: 12,
            open_rate: 0.625,
            reply_rate: 0.1875,
            click_rate: 0.15,
          },
          {
            campaign_id: 'cmp-active-1',
            step_number: '2',
            variant: '0',
            sent: 120,
            opened: 46,
            replies: 10,
            clicks: 6,
            open_rate: 0.3833,
            reply_rate: 0.0833,
            click_rate: 0.05,
          },
          {
            campaign_id: 'cmp-active-1',
            step_number: '2',
            variant: 'B',
            sent: 60,
            opened: 28,
            replies: 8,
            clicks: 5,
            open_rate: 0.4667,
            reply_rate: 0.1333,
            click_rate: 0.0833,
          },
          {
            campaign_id: 'cmp-active-1',
            step_number: '3',
            variant: '0',
            sent: 90,
            opened: 25,
            replies: 4,
            clicks: 2,
            open_rate: 0.2778,
            reply_rate: 0.0444,
            click_rate: 0.0222,
          },
        ],
      },
      {
        id: 'cmp-draft-1',
        name: 'New Product Launch',
        status: 'draft',
        user_id: 'bb370a65-08df-4ddc-8a0f-aa5c65fc568f',
        start_at: null,
        end_at: null,
        created_at: '2025-08-18T11:30:42.000Z',
        analytics: {
          campaign_id: 'cmp-draft-1',
          emails_sent_count: 0,
          open_count: 0,
          reply_count: 0,
          bounced_count: 0,
          open_rate: 0,
          reply_rate: 0,
          bounce_rate: 0,
        },
        steps: [],
      },
      {
        id: 'cmp-paused-1',
        name: 'Warm Leads Nurture',
        status: 'paused',
        user_id: 'bb370a65-08df-4ddc-8a0f-aa5c65fc568f',
        start_at: '2025-07-10T08:00:00.000Z',
        end_at: null,
        created_at: '2025-07-05T08:00:00.000Z',
        analytics: {
          campaign_id: 'cmp-paused-1',
          emails_sent_count: 150,
          open_count: 45,
          reply_count: 3,
          bounced_count: 12,
          open_rate: 0.3,
          reply_rate: 0.02,
          bounce_rate: 0.08,
        },
        steps: [
          {
            campaign_id: 'cmp-paused-1',
            step_number: '1',
            variant: '0',
            sent: 150,
            opened: 45,
            replies: 3,
            clicks: 4,
            open_rate: 0.3,
            reply_rate: 0.02,
            click_rate: 0.0267,
          },
        ],
      },
    ],

    bestPerforming: [
      {
        id: 'cmp-active-1',
        name: 'Q3 Outreach',
        reply_rate: 0.0917,
        open_rate: 0.45,
        bounce_rate: 0.0125,
        emails_sent_count: 240,
      },
      {
        id: 'cmp-paused-1',
        name: 'Warm Leads Nurture',
        reply_rate: 0.02,
        open_rate: 0.3,
        bounce_rate: 0.08,
        emails_sent_count: 150,
      },
      {
        id: 'cmp-draft-1',
        name: 'New Product Launch',
        reply_rate: 0,
        open_rate: 0,
        bounce_rate: 0,
        emails_sent_count: 0,
      },
    ],

    needsAttention: {
      lowPerformance: [
        {
          id: 'cmp-paused-1',
          name: 'Warm Leads Nurture',
          open_rate: 0.3,
          reply_rate: 0.02,
        },
        {
          id: 'cmp-draft-1',
          name: 'New Product Launch',
          open_rate: 0,
          reply_rate: 0,
        },
      ],
      highBounceRate: [
        {
          id: 'cmp-paused-1',
          name: 'Warm Leads Nurture',
          bounce_rate: 0.08,
        },
      ],
      codes: {
        accountSuspended: [
          { id: 'acc-001', name: 'some name' },
        ],
        accountsUnhealthy: [
            { id: 'acc-002', name: 'some other name' }
        ],
        bounceProtect: [
          { id: 'acc-003', name: 'some name other' },
        ],
      },
    },
  },

  prospects: {
    newlyAdded: {
      count: 6,
      items: [
        {
          linkedin_id: 'jane-doe-123',
          created_at: '2025-08-21T09:16:58.536Z',
          first_name: 'Jane',
          last_name: 'Doe',
          inCampaign: true,
        },
        {
          linkedin_id: 'john-smith-456',
          created_at: '2025-08-20T15:12:10.102Z',
          first_name: 'John',
          last_name: 'Smith',
          inCampaign: false,
        },
        {
          linkedin_id: 'alex-lee-789',
          created_at: '2025-08-19T12:44:00.000Z',
          first_name: 'Alex',
          last_name: 'Lee',
          inCampaign: false,
        },
        {
          linkedin_id: 'maria-garcia',
          created_at: '2025-08-18T18:20:33.000Z',
          first_name: 'Maria',
          last_name: 'Garcia',
          inCampaign: true,
        },
        {
          linkedin_id: 'sam-wilson',
          created_at: '2025-08-17T21:09:20.000Z',
          first_name: 'Sam',
          last_name: 'Wilson',
          inCampaign: false,
        },
        {
          linkedin_id: 'rachel-green',
          created_at: '2025-08-16T07:33:11.000Z',
          first_name: 'Rachel',
          last_name: 'Green',
          inCampaign: true,
        },
      ],
    },
    dataCompleteness: {
      total: 120,
      hasEmail: {
        count: 72,
        pct: 0.6,
      },
      emailSafeToSend: {
        count: 50,
        pct: 0.4166666666666667,
      },
      hasCompany: {
        count: 90,
        pct: 0.75,
      },
      hasEnrichment: {
        count: 115,
        pct: 0.9583333333333334,
      },
    },
  },

  tasks: {
    overdue: [
      {
        id: 'tsk-ovd-001',
        title: 'Follow-up with Jane Doe',
        due_date: '2025-08-01',
        status: 'overdue',
        prospect: {
          linkedin_id: 'jane-doe-123',
          name: 'Jane Doe',
        },
      },
      {
        id: 'tsk-ovd-002',
        title: 'Prepare intro email',
        due_date: '2025-08-15',
        status: 'overdue',
        prospect: {
          linkedin_id: 'john-smith-456',
          name: 'John Smith',
        },
      },
    ],
    aboutToOverdue: [
      {
        id: 'dd70cce1-09bb-4bed-884e-6869196c05ec',
        title: 'Send case study',
        due_date: '2025-08-22',
        status: 'due_soon',
        prospect: {
          linkedin_id: 'alex-lee-789',
          name: 'Alex Lee',
        },
      },
    ],
    recentlyCompleted: [
      {
        id: 'tsk-done-001',
        title: 'Qualify lead',
        due_date: '2025-08-18',
        status: 'completed',
        prospect: {
          linkedin_id: 'rachel-green',
          name: 'Rachel Green',
        },
      },
      {
        id: 'tsk-done-002',
        title: 'Add to campaign',
        due_date: '2025-08-19',
        status: 'completed',
        prospect: null,
      },
    ],
  },

  activity: {
    recentLogs: {
      byStatus: {
        success: 7,
        failed: 2,
        in_progress: 1,
      },
      byAction: [
        { action: 'create_variables', success: 2, failed: 0, in_progress: 0 },
        { action: 'deep_search', success: 2, failed: 1, in_progress: 0 },
        { action: 'verify_emails', success: 1, failed: 0, in_progress: 0 },
        { action: 'find_emails', success: 1, failed: 0, in_progress: 0 },
        { action: 'ai_company_search', success: 0, failed: 1, in_progress: 0 },
        { action: 'add_leads', success: 1, failed: 0, in_progress: 0 },
      ],
      items: [
        {
          id: 'log-001',
          action: 'create_variables',
          status: 'success',
          message:
            '✅ Variable Creation completed with 100% success rate\n📊 Results: 2/2 variables created successfully',
          start_time: '2025-08-21T19:04:03.616Z',
          end_time: '2025-08-21T19:04:17.533Z',
          prospects: [{ linkedin_id: 'jane-doe-123', name: 'Jane Doe' }],
        },
        {
          id: 'log-002',
          action: 'deep_search',
          status: 'success',
          message:
            'AI WEB SEARCH ENRICHMENT REPORT\n========================================\n\nTotal Enrichments: 1\nSuccessful: 1\nFailed: 0\nSuccess Rate: 100.00%',
          start_time: '2025-08-21T19:01:00.229Z',
          end_time: '2025-08-21T19:02:15.442Z',
          prospects: [{ linkedin_id: 'john-smith-456', name: 'John Smith' }],
        },
        {
          id: 'log-003',
          action: 'deep_search',
          status: 'failed',
          message:
            'AI WEB SEARCH ENRICHMENT REPORT\n========================================\n\nTotal Enrichments: 1\nSuccessful: 0\nFailed: 1\nSuccess Rate: 0.00%',
          start_time: '2025-08-21T18:44:18.185Z',
          end_time: '2025-08-21T18:45:06.709Z',
          prospects: [{ linkedin_id: 'alex-lee-789', name: 'Alex Lee' }],
        },
        {
          id: 'log-004',
          action: 'create_variables',
          status: 'success',
          message:
            '✅ Variable Creation completed with 100% success rate\n📊 Results: 1/1 variables created successfully',
          start_time: '2025-08-20T18:38:55.439Z',
          end_time: '2025-08-20T18:39:09.861Z',
          prospects: [{ linkedin_id: 'maria-garcia', name: 'Maria Garcia' }],
        },
        {
          id: 'log-005',
          action: 'verify_emails',
          status: 'success',
          message:
            '📧 EMAIL VERIFICATION REPORT\nGenerated: 8/20/2025, 7:12:10 PM\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📊 SUMMARY\n• Total Processed: 3\n• Success Rate: 100%',
          start_time: '2025-08-20T19:11:36.878Z',
          end_time: '2025-08-20T19:12:10.636Z',
          prospects: [
            { linkedin_id: 'sam-wilson', name: 'Sam Wilson' },
            { linkedin_id: 'rachel-green', name: 'Rachel Green' },
            { linkedin_id: 'jane-doe-123', name: 'Jane Doe' },
          ],
        },
        {
          id: 'log-006',
          action: 'find_emails',
          status: 'success',
          message:
            'Processed 4 contacts\nFound 3 email addresses (75% success rate)\n\nEMAIL QUALITY\nAverage confidence score: 96%',
          start_time: '2025-08-19T22:43:28.203Z',
          end_time: '2025-08-19T22:44:02.951Z',
          prospects: [
            { linkedin_id: 'john-smith-456', name: 'John Smith' },
            { linkedin_id: 'alex-lee-789', name: 'Alex Lee' },
            { linkedin_id: 'maria-garcia', name: 'Maria Garcia' },
            { linkedin_id: 'sam-wilson', name: 'Sam Wilson' },
          ],
        },
        {
          id: 'log-007',
          action: 'ai_company_search',
          status: 'failed',
          message:
            '❌ Processing failed with 0% success rate\n📊 Results: 0/1 prospects processed successfully\n\n📋 Failure breakdown:\n  • Prospect is self employed thus no point scraping anything else: 1 (100%)',
          start_time: '2025-08-19T17:57:17.705Z',
          end_time: '2025-08-19T17:57:51.619Z',
          prospects: [{ linkedin_id: 'rachel-green', name: 'Rachel Green' }],
        },
        {
          id: 'log-008',
          action: 'add_leads',
          status: 'success',
          message:
            'Processing Summary\n────────────────────────────────────────\nProspects processed: 2 (success 2, failed 0)\nOverall success rate: 100%',
          start_time: '2025-08-18T12:28:27.518Z',
          end_time: '2025-08-18T12:28:36.347Z',
          prospects: [
            { linkedin_id: 'jane-doe-123', name: 'Jane Doe' },
            { linkedin_id: 'john-smith-456', name: 'John Smith' },
          ],
        },
        {
          id: 'log-009',
          action: 'deep_search',
          status: 'success',
          message:
            'AI WEB SEARCH ENRICHMENT REPORT\n========================================\n\nTotal Enrichments: 1\nSuccess Rate: 100.00%',
          start_time: '2025-08-18T10:10:10.000Z',
          end_time: '2025-08-18T10:11:40.000Z',
          prospects: [{ linkedin_id: 'sam-wilson', name: 'Sam Wilson' }],
        },
        {
          id: 'log-010',
          action: 'create_variables',
          status: 'in_progress',
          message: 'Processing 1/3 records…',
          start_time: '2025-08-21T19:50:00.000Z',
          end_time: null,
          prospects: [],
        },
      ],
      failedOperations: [
        {
          id: 'log-003',
          action: 'deep_search',
          status: 'failed',
          message:
            'AI WEB SEARCH ENRICHMENT REPORT\n========================================\n\nTotal Enrichments: 1\nSuccessful: 0\nFailed: 1\nSuccess Rate: 0.00%',
          start_time: '2025-08-21T18:44:18.185Z',
          end_time: '2025-08-21T18:45:06.709Z',
          prospects: [{ linkedin_id: 'alex-lee-789', name: 'Alex Lee' }],
          retry_eligible: false,
        },
        {
          id: 'log-007',
          action: 'ai_company_search',
          status: 'failed',
          message:
            '❌ Processing failed with 0% success rate\n📊 Results: 0/1 prospects processed successfully',
          start_time: '2025-08-19T17:57:17.705Z',
          end_time: '2025-08-19T17:57:51.619Z',
          prospects: [{ linkedin_id: 'rachel-green', name: 'Rachel Green' }],
          retry_eligible: true,
        },
      ],
    },
  },

  queues: {
    deepSearch: {
      total: 13,
      byPrompt: [
        {
          prompt_id: '6b55c92a-6dd8-4372-a804-39b9f2bea411',
          prompt_name: 'search company history',
          count: 10,
        },
        {
          prompt_id: '8f2d1a77-5e1a-4a2c-9d23-4f19b7ab3a90',
          prompt_name: 'search podcasts appearance',
          count: 3,
        },
      ],
    },
  },

  engagement: {
    prompts: {
      byVariables: [
        {
          prompt_id: 'c8ccb966-a570-4237-ab94-ed47a4dcf8d0',
          prompt_name: 'icebreaker reccomendation',
          count: 18,
        },
        {
          prompt_id: '290eb395-0cfa-455d-9678-ceb446947668',
          prompt_name: 'Ice Breaker Company Work',
          count: 4,
        },
        {
          prompt_id: '1135fc13-8399-4aff-a8a2-58173ad31359',
          prompt_name: 'icebreaker-career',
          count: 2,
        },
      ],
      byDeepSearch: [
        {
          prompt_id: '6b55c92a-6dd8-4372-a804-39b9f2bea411',
          prompt_name: 'search company history',
          count: 10,
        },
        {
          prompt_id: '8f2d1a77-5e1a-4a2c-9d23-4f19b7ab3a90',
          prompt_name: 'search podcasts appearance',
          count: 3,
        },
      ],
      top: [
        {
          prompt_id: 'c8ccb966-a570-4237-ab94-ed47a4dcf8d0',
          prompt_name: 'icebreaker reccomendation',
          variables: 18,
          deepSearch: 0,
          totalUsage: 18,
        },
        {
          prompt_id: '6b55c92a-6dd8-4372-a804-39b9f2bea411',
          prompt_name: 'search company history',
          variables: 0,
          deepSearch: 10,
          totalUsage: 10,
        },
        {
          prompt_id: '290eb395-0cfa-455d-9678-ceb446947668',
          prompt_name: 'Ice Breaker Company Work',
          variables: 4,
          deepSearch: 0,
          totalUsage: 4,
        },
        {
          prompt_id: '8f2d1a77-5e1a-4a2c-9d23-4f19b7ab3a90',
          prompt_name: 'search podcasts appearance',
          variables: 0,
          deepSearch: 3,
          totalUsage: 3,
        },
        {
          prompt_id: '1135fc13-8399-4aff-a8a2-58173ad31359',
          prompt_name: 'icebreaker-career',
          variables: 2,
          deepSearch: 0,
          totalUsage: 2,
        },
      ],
    },
  },
}

export default MOCK_DASHBOARD_DATA
