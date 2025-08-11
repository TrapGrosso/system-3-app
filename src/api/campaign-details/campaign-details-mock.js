export const payload = {
  "campaign": {
    "id": "a3f9e2b4-12d7-4c6a-9f8b-0e1d2c3b4a5f",
    "user_id": "c1b2d3e4-5f6a-7b8c-9d0e-112233445566",
    "name": "Enterprise Outreach - Multi-Step",
    "status": "active",
    "start_at": "2025-10-01",
    "end_at": "2025-11-01",
    "created_at": "2025-09-20T08:45:22.654321",
    "campaign_schedule": [
      {
        "days": {
          "1": true,
          "2": true,
          "3": true,
          "4": true,
          "5": true,
          "6": false,
          "7": false
        },
        "name": "Business Hours Weekdays",
        "timing": {
          "to": "17:30",
          "from": "09:00"
        },
        "timezone": "America/New_York"
      }
    ],
    "campaign_sequence": [
      {
        "type": "email",
        "delay": 0,
        "variants": [
          {
            "body": "<html><body><p>Hi {{first_name}},</p><p>I hope you're well. I'm Sarah from ScaleOps. We help enterprise teams streamline vendor onboarding and reduce manual steps by 70%.</p><p>Would you be open to a short 20-minute chat next week to see if this fits your priorities at {{company}}?</p><p>Best,<br/>Sarah Kim<br/>ScaleOps<br/><a href=\"mailto:sarah@scaleops.com\">sarah@scaleops.com</a></p><p style=\"font-size:12px;color:#888;\">Manage preferences: <a href=\"{{unsubscribe_link}}\">unsubscribe</a></p></body></html>",
            "subject": "Quick intro — Vendor onboarding automation for {{company}}",
            "analytics": {
              "sent": 200,
              "opened": 120,
              "unique_opened": 115,
              "replies": 18,
              "unique_replies": 17,
              "clicks": 48,
              "unique_clicks": 45,
              "updated_at": "2025-10-05T09:15:00"
            }
          },
          {
            "body": "Hi {{first_name}},\n\nI'm Sarah from ScaleOps. We automate vendor onboarding to save teams time and reduce errors. Would you have 20 minutes next week to discuss whether this could help {{company}}?\n\nIf so, pick a time: https://calendly.com/scaleops/demo\n\nThanks,\nSarah\nsarah@scaleops.com\n\nTo unsubscribe, visit {{unsubscribe_link}}",
            "subject": "Intro: onboarding automation for {{company}}",
            "analytics": {
              "sent": 180,
              "opened": 85,
              "unique_opened": 80,
              "replies": 7,
              "unique_replies": 6,
              "clicks": 22,
              "unique_clicks": 21,
              "updated_at": "2025-10-05T09:20:00"
            }
          }
        ],
        "step_totals": {
          "sent": 380,
          "opened": 205,
          "unique_opened": 195,
          "replies": 25,
          "unique_replies": 23,
          "clicks": 70,
          "unique_clicks": 66,
          "updated_at": "2025-10-05T09:25:00"
        }
      },
      {
        "type": "email",
        "delay": 3,
        "variants": [
          {
            "body": "<p>Hi {{first_name}},</p><p>Following up on my previous note — we recently helped Acme Corp cut onboarding time by 60%. If you have a minute, here's a 90-second case study: https://scaleops.example.com/case-study-acme</p><p>Would you be open to a brief call to explore fit?</p><p>— Sarah</p>",
            "subject": "Follow-up: 90s case study on onboarding at Acme",
            "analytics": {
              "sent": 250,
              "opened": 140,
              "unique_opened": 132,
              "replies": 12,
              "unique_replies": 11,
              "clicks": 36,
              "unique_clicks": 34,
              "updated_at": "2025-10-08T11:00:00"
            }
          }
        ],
        "step_totals": {
          "sent": 250,
          "opened": 142,
          "unique_opened": 135,
          "replies": 13,
          "unique_replies": 12,
          "clicks": 37,
          "unique_clicks": 35,
          "updated_at": "2025-10-08T11:05:00"
        }
      },
      {
        "type": "email",
        "delay": 7,
        "variants": [
          {
            "body": "Hi {{first_name}},\n\nQuick final note — we’re running a limited pilot for enterprise teams this quarter. If you’d like to be considered, reply to this email and I’ll share details.\n\nCheers,\nSarah (ScaleOps)\n",
            "subject": "Final note — limited pilot for enterprise teams",
            "analytics": {
              "sent": 150,
              "opened": 78,
              "unique_opened": 74,
              "replies": 5,
              "unique_replies": 5,
              "clicks": 10,
              "unique_clicks": 9,
              "updated_at": "2025-10-14T16:40:00"
            }
          }
        ],
        "step_totals": {
          "sent": 150,
          "opened": 80,
          "unique_opened": 76,
          "replies": 6,
          "unique_replies": 6,
          "clicks": 11,
          "unique_clicks": 10,
          "updated_at": "2025-10-14T16:45:00"
        }
      }
    ]
  },
  "analytics": {
    "campaign_is_evergreen": false,
    "leads_count": 420,
    "contacted_count": 400,
    "open_count": 427,
    "reply_count": 44,
    "link_click_count": 118,
    "bounced_count": 6,
    "unsubscribed_count": 4,
    "completed_count": 120,
    "emails_sent_count": 780,
    "new_leads_contacted_count": 85,
    "total_opportunities": 15,
    "total_opportunity_value": 125000,
    "updated_at": "2025-10-15T10:00:00"
  },
  "prospects": [
    {
      "linkedin_id": "michael-ryan-ops",
      "first_name": "Michael",
      "last_name": "Ryan",
      "email": "michael.ryan@enterpriseltd.com",
      "title": "VP of Operations",
      "company": "Enterprise Ltd"
    },
    {
      "linkedin_id": "lucy.chen",
      "first_name": "Lucy",
      "last_name": "Chen",
      "email": "lucy.chen@globaltech.io",
      "title": "Director of Procurement",
      "company": "GlobalTech"
    },
    {
      "linkedin_id": "omar-al-hassan",
      "first_name": "Omar",
      "last_name": "Al-Hassan",
      "email": "omar@finservices.co",
      "title": "Head of Vendor Management",
      "company": "FinServices Co"
    },
    {
      "linkedin_id": "raja-singh-growth",
      "first_name": "Raja",
      "last_name": "Singh",
      "email": "raja.singh@marketedge.ai",
      "title": "Head of Growth",
      "company": "MarketEdge AI"
    }
  ]
}