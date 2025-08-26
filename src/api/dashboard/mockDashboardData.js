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
  "meta": {
    "generatedAt": "2025-08-26T13:07:18.015Z",
    "lookbackDays": 90,
    "campaignsLimit": 5,
    "topN": 5,
    "thresholds": {
      "lowOpenRate": 0.15,
      "lowReplyRate": 0.02,
      "highBounceRate": 0.05
    }
  },
  "campaigns": {
    "running": [
      {
        "id": "8abaf4ba-9051-4980-ac14-3d42f20298df",
        "name": "Coach outreach 2025",
        "status": "active",
        "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
        "start_at": null,
        "end_at": null,
        "created_at": "2025-08-08T16:45:35.18152",
        "analytics": {
          "campaign_id": "8abaf4ba-9051-4980-ac14-3d42f20298df",
          "campaign_is_evergreen": true,
          "leads_count": 1500,
          "contacted_count": 1200,
          "open_count": 800,
          "reply_count": 300,
          "link_click_count": 600,
          "bounced_count": 50,
          "unsubscribed_count": 20,
          "completed_count": 1100,
          "emails_sent_count": 5000,
          "new_leads_contacted_count": 200,
          "total_opportunities": 10,
          "total_opportunity_value": 1000,
          "updated_at": "2025-08-26T12:22:34.709266",
          "open_rate": 0.16,
          "reply_rate": 0.06,
          "bounce_rate": 0.01
        },
        "steps": [
          {
            "campaign_id": "8abaf4ba-9051-4980-ac14-3d42f20298df",
            "step": "1",
            "variant": "0",
            "sent": 850,
            "opened": 160,
            "unique_opened": 130,
            "replies": 55,
            "unique_replies": 45,
            "clicks": 120,
            "unique_clicks": 100,
            "updated_at": "2025-08-26T12:22:34.709266",
            "open_rate": 0.18823529411764706,
            "reply_rate": 0.06470588235294118,
            "click_rate": 0.1411764705882353
          },
          {
            "campaign_id": "8abaf4ba-9051-4980-ac14-3d42f20298df",
            "step": "1",
            "variant": "A",
            "sent": 850,
            "opened": 170,
            "unique_opened": 140,
            "replies": 60,
            "unique_replies": 50,
            "clicks": 130,
            "unique_clicks": 110,
            "updated_at": "2025-08-26T12:22:34.709266",
            "open_rate": 0.2,
            "reply_rate": 0.07058823529411765,
            "click_rate": 0.15294117647058825
          },
          {
            "campaign_id": "8abaf4ba-9051-4980-ac14-3d42f20298df",
            "step": "2",
            "variant": "0",
            "sent": 850,
            "opened": 130,
            "unique_opened": 100,
            "replies": 45,
            "unique_replies": 40,
            "clicks": 100,
            "unique_clicks": 80,
            "updated_at": "2025-08-26T12:22:34.709266",
            "open_rate": 0.15294117647058825,
            "reply_rate": 0.052941176470588235,
            "click_rate": 0.11764705882352941
          },
          {
            "campaign_id": "8abaf4ba-9051-4980-ac14-3d42f20298df",
            "step": "2",
            "variant": "A",
            "sent": 850,
            "opened": 140,
            "unique_opened": 110,
            "replies": 50,
            "unique_replies": 40,
            "clicks": 110,
            "unique_clicks": 90,
            "updated_at": "2025-08-26T12:22:34.709266",
            "open_rate": 0.16470588235294117,
            "reply_rate": 0.058823529411764705,
            "click_rate": 0.12941176470588237
          },
          {
            "campaign_id": "8abaf4ba-9051-4980-ac14-3d42f20298df",
            "step": "3",
            "variant": "0",
            "sent": 850,
            "opened": 60,
            "unique_opened": 50,
            "replies": 40,
            "unique_replies": 30,
            "clicks": 70,
            "unique_clicks": 60,
            "updated_at": "2025-08-26T12:22:34.709266",
            "open_rate": 0.07058823529411765,
            "reply_rate": 0.047058823529411764,
            "click_rate": 0.08235294117647059
          },
          {
            "campaign_id": "8abaf4ba-9051-4980-ac14-3d42f20298df",
            "step": "3",
            "variant": "A",
            "sent": 850,
            "opened": 60,
            "unique_opened": 50,
            "replies": 40,
            "unique_replies": 30,
            "clicks": 70,
            "unique_clicks": 60,
            "updated_at": "2025-08-26T12:22:34.709266",
            "open_rate": 0.07058823529411765,
            "reply_rate": 0.047058823529411764,
            "click_rate": 0.08235294117647059
          }
        ]
      },
      {
        "id": "a7d67ac2-5326-4fd9-936c-6674af000ac4",
        "name": "My Campaign demo",
        "status": "active",
        "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
        "start_at": null,
        "end_at": null,
        "created_at": "2025-08-08T11:39:09.481092",
        "analytics": {
          "campaign_id": "a7d67ac2-5326-4fd9-936c-6674af000ac4",
          "campaign_is_evergreen": true,
          "leads_count": 1000,
          "contacted_count": 800,
          "open_count": 150,
          "reply_count": 30,
          "link_click_count": 60,
          "bounced_count": 80,
          "unsubscribed_count": 40,
          "completed_count": 600,
          "emails_sent_count": 4000,
          "new_leads_contacted_count": 100,
          "total_opportunities": 2,
          "total_opportunity_value": 100,
          "updated_at": "2025-08-26T12:22:34.709266",
          "open_rate": 0.0375,
          "reply_rate": 0.0075,
          "bounce_rate": 0.02
        },
        "steps": [
          {
            "campaign_id": "a7d67ac2-5326-4fd9-936c-6674af000ac4",
            "step": "1",
            "variant": "0",
            "sent": 700,
            "opened": 25,
            "unique_opened": 20,
            "replies": 8,
            "unique_replies": 7,
            "clicks": 12,
            "unique_clicks": 10,
            "updated_at": "2025-08-26T12:22:34.709266",
            "open_rate": 0.03571428571428571,
            "reply_rate": 0.011428571428571429,
            "click_rate": 0.017142857142857144
          },
          {
            "campaign_id": "a7d67ac2-5326-4fd9-936c-6674af000ac4",
            "step": "1",
            "variant": "A",
            "sent": 700,
            "opened": 30,
            "unique_opened": 25,
            "replies": 10,
            "unique_replies": 8,
            "clicks": 15,
            "unique_clicks": 12,
            "updated_at": "2025-08-26T12:22:34.709266",
            "open_rate": 0.04285714285714286,
            "reply_rate": 0.014285714285714285,
            "click_rate": 0.02142857142857143
          },
          {
            "campaign_id": "a7d67ac2-5326-4fd9-936c-6674af000ac4",
            "step": "2",
            "variant": "0",
            "sent": 700,
            "opened": 20,
            "unique_opened": 15,
            "replies": 5,
            "unique_replies": 4,
            "clicks": 10,
            "unique_clicks": 8,
            "updated_at": "2025-08-26T12:22:34.709266",
            "open_rate": 0.02857142857142857,
            "reply_rate": 0.007142857142857143,
            "click_rate": 0.014285714285714285
          },
          {
            "campaign_id": "a7d67ac2-5326-4fd9-936c-6674af000ac4",
            "step": "2",
            "variant": "A",
            "sent": 700,
            "opened": 20,
            "unique_opened": 15,
            "replies": 5,
            "unique_replies": 4,
            "clicks": 10,
            "unique_clicks": 8,
            "updated_at": "2025-08-26T12:22:34.709266",
            "open_rate": 0.02857142857142857,
            "reply_rate": 0.007142857142857143,
            "click_rate": 0.014285714285714285
          },
          {
            "campaign_id": "a7d67ac2-5326-4fd9-936c-6674af000ac4",
            "step": "3",
            "variant": "0",
            "sent": 700,
            "opened": 10,
            "unique_opened": 8,
            "replies": 1,
            "unique_replies": 1,
            "clicks": 3,
            "unique_clicks": 2,
            "updated_at": "2025-08-26T12:22:34.709266",
            "open_rate": 0.014285714285714285,
            "reply_rate": 0.0014285714285714286,
            "click_rate": 0.004285714285714286
          },
          {
            "campaign_id": "a7d67ac2-5326-4fd9-936c-6674af000ac4",
            "step": "3",
            "variant": "A",
            "sent": 700,
            "opened": 15,
            "unique_opened": 12,
            "replies": 1,
            "unique_replies": 1,
            "clicks": 3,
            "unique_clicks": 2,
            "updated_at": "2025-08-26T12:22:34.709266",
            "open_rate": 0.02142857142857143,
            "reply_rate": 0.0014285714285714286,
            "click_rate": 0.004285714285714286
          }
        ]
      },
      {
        "id": "6c872a06-15bb-4ef8-ac13-bd5a79bbf4c9",
        "name": "Demo Campaign",
        "status": "active",
        "user_id": "bb370a65-08df-4ddc-8a0f-aa5c65fc568f",
        "start_at": null,
        "end_at": null,
        "created_at": "2025-08-08T11:37:52.798",
        "analytics": {
          "campaign_id": "6c872a06-15bb-4ef8-ac13-bd5a79bbf4c9",
          "campaign_is_evergreen": true,
          "leads_count": 2000,
          "contacted_count": 1800,
          "open_count": 1400,
          "reply_count": 600,
          "link_click_count": 1200,
          "bounced_count": 40,
          "unsubscribed_count": 15,
          "completed_count": 1500,
          "emails_sent_count": 6000,
          "new_leads_contacted_count": 300,
          "total_opportunities": 15,
          "total_opportunity_value": 2000,
          "updated_at": "2025-08-26T12:22:34.709266",
          "open_rate": 0.23333333333333334,
          "reply_rate": 0.1,
          "bounce_rate": 0.006666666666666667
        },
        "steps": [
          {
            "campaign_id": "6c872a06-15bb-4ef8-ac13-bd5a79bbf4c9",
            "step": "1",
            "variant": "0",
            "sent": 1000,
            "opened": 300,
            "unique_opened": 250,
            "replies": 120,
            "unique_replies": 100,
            "clicks": 250,
            "unique_clicks": 220,
            "updated_at": "2025-08-26T12:22:34.709266",
            "open_rate": 0.3,
            "reply_rate": 0.12,
            "click_rate": 0.25
          },
          {
            "campaign_id": "6c872a06-15bb-4ef8-ac13-bd5a79bbf4c9",
            "step": "1",
            "variant": "A",
            "sent": 1000,
            "opened": 350,
            "unique_opened": 300,
            "replies": 140,
            "unique_replies": 120,
            "clicks": 300,
            "unique_clicks": 260,
            "updated_at": "2025-08-26T12:22:34.709266",
            "open_rate": 0.35,
            "reply_rate": 0.14,
            "click_rate": 0.3
          },
          {
            "campaign_id": "6c872a06-15bb-4ef8-ac13-bd5a79bbf4c9",
            "step": "2",
            "variant": "0",
            "sent": 1000,
            "opened": 250,
            "unique_opened": 220,
            "replies": 90,
            "unique_replies": 80,
            "clicks": 200,
            "unique_clicks": 180,
            "updated_at": "2025-08-26T12:22:34.709266",
            "open_rate": 0.25,
            "reply_rate": 0.09,
            "click_rate": 0.2
          },
          {
            "campaign_id": "6c872a06-15bb-4ef8-ac13-bd5a79bbf4c9",
            "step": "2",
            "variant": "A",
            "sent": 1000,
            "opened": 250,
            "unique_opened": 230,
            "replies": 90,
            "unique_replies": 85,
            "clicks": 210,
            "unique_clicks": 190,
            "updated_at": "2025-08-26T12:22:34.709266",
            "open_rate": 0.25,
            "reply_rate": 0.09,
            "click_rate": 0.21
          },
          {
            "campaign_id": "6c872a06-15bb-4ef8-ac13-bd5a79bbf4c9",
            "step": "3",
            "variant": "0",
            "sent": 1000,
            "opened": 130,
            "unique_opened": 120,
            "replies": 80,
            "unique_replies": 70,
            "clicks": 120,
            "unique_clicks": 100,
            "updated_at": "2025-08-26T12:22:34.709266",
            "open_rate": 0.13,
            "reply_rate": 0.08,
            "click_rate": 0.12
          },
          {
            "campaign_id": "6c872a06-15bb-4ef8-ac13-bd5a79bbf4c9",
            "step": "3",
            "variant": "A",
            "sent": 1000,
            "opened": 120,
            "unique_opened": 110,
            "replies": 80,
            "unique_replies": 70,
            "clicks": 120,
            "unique_clicks": 100,
            "updated_at": "2025-08-26T12:22:34.709266",
            "open_rate": 0.12,
            "reply_rate": 0.08,
            "click_rate": 0.12
          }
        ]
      }
    ],
    "bestPerforming": [
      {
        "id": "6c872a06-15bb-4ef8-ac13-bd5a79bbf4c9",
        "name": "Demo Campaign",
        "reply_rate": 0.1,
        "open_rate": 0.23333333333333334,
        "bounce_rate": 0.006666666666666667,
        "emails_sent_count": 6000
      },
      {
        "id": "8abaf4ba-9051-4980-ac14-3d42f20298df",
        "name": "Coach outreach 2025",
        "reply_rate": 0.06,
        "open_rate": 0.16,
        "bounce_rate": 0.01,
        "emails_sent_count": 5000
      },
      {
        "id": "a7d67ac2-5326-4fd9-936c-6674af000ac4",
        "name": "My Campaign demo",
        "reply_rate": 0.0075,
        "open_rate": 0.0375,
        "bounce_rate": 0.02,
        "emails_sent_count": 4000
      }
    ],
    "needsAttention": {
      "lowPerformance": [
        {
          "id": "a7d67ac2-5326-4fd9-936c-6674af000ac4",
          "name": "My Campaign demo",
          "open_rate": 0.0375,
          "reply_rate": 0.0075
        }
      ],
      "highBounceRate": [],
      "codes": {
        "accountSuspended": [],
        "accountsUnhealthy": [],
        "bounceProtect": []
      }
    }
  },
  "prospects": {
    "newlyAdded": {
      "count": 50,
      "items": [
        {
          "linkedin_id": "bizcoachjason",
          "created_at": "2025-07-21T19:16:58.536352",
          "first_name": "Jason",
          "last_name": "Rosado",
          "inCampaign": false
        },
        {
          "linkedin_id": "jason-kaprelian",
          "created_at": "2025-07-21T19:16:57.9327",
          "first_name": "Jason",
          "last_name": "Kaprelian",
          "inCampaign": false
        },
        {
          "linkedin_id": "christiancoachinstitute",
          "created_at": "2025-07-21T19:16:57.380961",
          "first_name": "Janice",
          "last_name": "LaVore Fletcher",
          "inCampaign": false
        },
        {
          "linkedin_id": "jameslopata",
          "created_at": "2025-07-21T19:16:56.816245",
          "first_name": "James",
          "last_name": "Lopata",
          "inCampaign": false
        },
        {
          "linkedin_id": "jaimieskultety",
          "created_at": "2025-07-21T19:16:56.237649",
          "first_name": "Jaimie",
          "last_name": "Skultety",
          "inCampaign": false
        },
        {
          "linkedin_id": "jackiewoodside",
          "created_at": "2025-07-21T19:16:55.655778",
          "first_name": "Jackie",
          "last_name": "Woodside",
          "inCampaign": false
        },
        {
          "linkedin_id": "jjshawver",
          "created_at": "2025-07-21T19:16:55.314072",
          "first_name": "J.J.",
          "last_name": "Shawver",
          "inCampaign": false
        },
        {
          "linkedin_id": "ivywoolfturk-cpc",
          "created_at": "2025-07-21T19:16:54.792586",
          "first_name": "Ivy",
          "last_name": "Woolf Turk",
          "inCampaign": false
        },
        {
          "linkedin_id": "drioanapopa",
          "created_at": "2025-07-21T19:16:54.478281",
          "first_name": "Ioana",
          "last_name": "Popa",
          "inCampaign": false
        },
        {
          "linkedin_id": "scottdnielsen",
          "created_at": "2025-07-21T19:16:53.928633",
          "first_name": "Scott",
          "last_name": "D. Nielsen",
          "inCampaign": false
        },
        {
          "linkedin_id": "rebecca-akpan-0a7711215",
          "created_at": "2025-07-21T19:16:53.572795",
          "first_name": "Rebecca",
          "last_name": "Akpan",
          "inCampaign": false
        },
        {
          "linkedin_id": "hcogliano",
          "created_at": "2025-07-21T19:16:53.188662",
          "first_name": "Herb",
          "last_name": "Cogliano",
          "inCampaign": false
        },
        {
          "linkedin_id": "heather-petersen-36286125",
          "created_at": "2025-07-21T19:16:52.585228",
          "first_name": "Heather",
          "last_name": "Petersen",
          "inCampaign": false
        },
        {
          "linkedin_id": "ivan-joseph-cu",
          "created_at": "2025-07-21T19:16:51.905605",
          "first_name": "Ivan",
          "last_name": "Joseph",
          "inCampaign": false
        },
        {
          "linkedin_id": "heathercrabtree",
          "created_at": "2025-07-20T20:28:47.966536",
          "first_name": "Heather",
          "last_name": "Crabtree, JD",
          "inCampaign": false
        },
        {
          "linkedin_id": "aditya-sharma-b63241317",
          "created_at": "2025-07-20T20:21:02.302664",
          "first_name": "Aditya",
          "last_name": "Sharma",
          "inCampaign": false
        },
        {
          "linkedin_id": "maximilianmessing",
          "created_at": "2025-06-28T20:39:01.033631",
          "first_name": "Maximilian",
          "last_name": "Messing",
          "inCampaign": true
        },
        {
          "linkedin_id": "gloria-walker-phd-acc-6054a916",
          "created_at": "2025-06-15T19:22:59.439568",
          "first_name": "Gloria",
          "last_name": "Walker",
          "inCampaign": false
        },
        {
          "linkedin_id": "mentalfitnessguy",
          "created_at": "2025-06-15T19:22:53.269369",
          "first_name": "Glen",
          "last_name": "Stevens Jr",
          "inCampaign": true
        },
        {
          "linkedin_id": "gisel-brito",
          "created_at": "2025-06-15T19:22:36.593047",
          "first_name": "Gisel",
          "last_name": "Brito Silverberg",
          "inCampaign": false
        },
        {
          "linkedin_id": "genia-silva-8a351775",
          "created_at": "2025-06-15T19:22:20.210717",
          "first_name": "Genia",
          "last_name": "Silva",
          "inCampaign": false
        },
        {
          "linkedin_id": "forrest-huguenin-648480b",
          "created_at": "2025-06-15T19:22:02.122023",
          "first_name": "Forrest",
          "last_name": "Huguenin",
          "inCampaign": false
        },
        {
          "linkedin_id": "fatimajouetavie",
          "created_at": "2025-06-15T19:21:54.378151",
          "first_name": "Fatima",
          "last_name": "Medjoubi",
          "inCampaign": false
        },
        {
          "linkedin_id": "coachever",
          "created_at": "2025-06-15T19:21:44.620127",
          "first_name": "Everardo",
          "last_name": "Recendiz",
          "inCampaign": false
        },
        {
          "linkedin_id": "erin-maccoy-15408312",
          "created_at": "2025-06-15T19:21:33.592503",
          "first_name": "Erin",
          "last_name": "MacCoy",
          "inCampaign": false
        },
        {
          "linkedin_id": "erikagilchrist",
          "created_at": "2025-06-15T19:21:11.272079",
          "first_name": "Erika",
          "last_name": "Gilchrist",
          "inCampaign": false
        },
        {
          "linkedin_id": "ericaleary",
          "created_at": "2025-06-15T19:21:02.825718",
          "first_name": "Erica",
          "last_name": "Leary",
          "inCampaign": false
        },
        {
          "linkedin_id": "emily-rivera-coach",
          "created_at": "2025-06-15T19:20:37.126606",
          "first_name": "Emily",
          "last_name": "Rivera",
          "inCampaign": false
        },
        {
          "linkedin_id": "emilylamia",
          "created_at": "2025-06-15T19:20:21.48329",
          "first_name": "Emily",
          "last_name": "Lamia",
          "inCampaign": false
        },
        {
          "linkedin_id": "emefaboamah",
          "created_at": "2025-06-15T19:20:00.754912",
          "first_name": "Emefa",
          "last_name": "Boamah",
          "inCampaign": false
        },
        {
          "linkedin_id": "ellen-tyler-coaching",
          "created_at": "2025-06-15T19:19:39.993441",
          "first_name": "Ellen",
          "last_name": "Tyler",
          "inCampaign": false
        },
        {
          "linkedin_id": "elise-m-oranges-70489a15",
          "created_at": "2025-06-15T19:19:24.158137",
          "first_name": "Elise",
          "last_name": "Oranges",
          "inCampaign": false
        },
        {
          "linkedin_id": "elexa-orrange-allen-25b98629",
          "created_at": "2025-06-15T19:19:16.825198",
          "first_name": "Elexa",
          "last_name": "Orrange-Allen",
          "inCampaign": false
        },
        {
          "linkedin_id": "elenayearly",
          "created_at": "2025-06-15T19:19:10.346252",
          "first_name": "Elena",
          "last_name": "Yearly",
          "inCampaign": false
        },
        {
          "linkedin_id": "eden-holt",
          "created_at": "2025-06-15T19:18:48.845611",
          "first_name": "Eden",
          "last_name": "Holt",
          "inCampaign": false
        },
        {
          "linkedin_id": "robinlavitch",
          "created_at": "2025-06-15T19:18:34.528582",
          "first_name": "Robin",
          "last_name": "Lavitch",
          "inCampaign": false
        },
        {
          "linkedin_id": "lisa-m-stephen-phd",
          "created_at": "2025-06-15T19:18:13.584971",
          "first_name": "Lisa",
          "last_name": "Stephen",
          "inCampaign": false
        },
        {
          "linkedin_id": "springforthcoaching",
          "created_at": "2025-06-15T19:18:07.684211",
          "first_name": "Julie",
          "last_name": "Tofilon",
          "inCampaign": false
        },
        {
          "linkedin_id": "imchristiecooper",
          "created_at": "2025-06-15T19:18:01.340016",
          "first_name": "Christie",
          "last_name": "Cooper",
          "inCampaign": false
        },
        {
          "linkedin_id": "dolores-neira-8b4996a",
          "created_at": "2025-06-15T19:17:48.334958",
          "first_name": "Dolores",
          "last_name": "Neira",
          "inCampaign": false
        },
        {
          "linkedin_id": "diana-swillinger-5759a013",
          "created_at": "2025-06-15T19:17:38.34076",
          "first_name": "Diana",
          "last_name": "Swillinger",
          "inCampaign": false
        },
        {
          "linkedin_id": "derickjohnson1",
          "created_at": "2025-06-15T19:17:16.673167",
          "first_name": "Derick",
          "last_name": "Johnson",
          "inCampaign": false
        },
        {
          "linkedin_id": "derekeuralesjr",
          "created_at": "2025-06-15T19:16:56.030869",
          "first_name": "Derek",
          "last_name": "Eurales",
          "inCampaign": true
        },
        {
          "linkedin_id": "debralamfers",
          "created_at": "2025-06-15T19:16:38.995883",
          "first_name": "Debra",
          "last_name": "Lamfers",
          "inCampaign": false
        },
        {
          "linkedin_id": "deborahbeatty",
          "created_at": "2025-06-15T19:16:24.432854",
          "first_name": "DeBorah",
          "last_name": "Beatty",
          "inCampaign": false
        },
        {
          "linkedin_id": "debbie-zimmerman-phytofit-life",
          "created_at": "2025-06-15T19:16:11.143071",
          "first_name": "Debbie",
          "last_name": "Zimmerman",
          "inCampaign": false
        },
        {
          "linkedin_id": "debbie-pickus",
          "created_at": "2025-06-15T19:16:04.751433",
          "first_name": "Debbie",
          "last_name": "Pickus",
          "inCampaign": false
        },
        {
          "linkedin_id": "debbie-o-connell",
          "created_at": "2025-06-15T19:15:59.457567",
          "first_name": "Debbie",
          "last_name": "O'Connell",
          "inCampaign": true
        },
        {
          "linkedin_id": "dawn-cooper-design-the-future-you",
          "created_at": "2025-06-15T19:15:46.632797",
          "first_name": "Dawn",
          "last_name": "Cooper",
          "inCampaign": false
        },
        {
          "linkedin_id": "daviddowdy",
          "created_at": "2025-06-15T19:15:35.092854",
          "first_name": "David",
          "last_name": "Dowdy",
          "inCampaign": false
        }
      ]
    },
    "dataCompleteness": {
      "total": 94,
      "hasEmail": {
        "count": 20,
        "pct": 0.2127659574468085
      },
      "emailSafeToSend": {
        "count": 4,
        "pct": 0.0425531914893617
      },
      "hasCompany": {
        "count": 53,
        "pct": 0.5638297872340425
      },
      "hasEnrichment": {
        "count": 94,
        "pct": 1
      }
    }
  },
  "tasks": {
    "overdue": [
      {
        "id": "a27f37e9-ccb0-468d-a3cf-beec772cc914",
        "title": "Some title",
        "due_date": "2025-07-01",
        "status": "overdue",
        "prospect": {
          "linkedin_id": "carlosdeleonlang",
          "name": "Carlos Deleon"
        }
      },
      {
        "id": "c396e6ef-2ee3-4233-93c4-75407a257065",
        "title": "the task",
        "due_date": "2025-07-23",
        "status": "overdue",
        "prospect": {
          "linkedin_id": "maximilianmessing",
          "name": "Maximilian Messing"
        }
      },
      {
        "id": "1ebe404b-6ce5-4a8c-9293-969096447370",
        "title": "task",
        "due_date": "2025-07-25",
        "status": "overdue",
        "prospect": {
          "linkedin_id": "maximilianmessing",
          "name": "Maximilian Messing"
        }
      }
    ],
    "aboutToOverdue": [],
    "recentlyCompleted": []
  },
  "activity": {
    "recentLogs": {
      "byStatus": {
        "success": 37,
        "failed": 6,
        "in_progress": 0
      },
      "byAction": [
        {
          "action": "create_variables",
          "success": 9,
          "failed": 0,
          "in_progress": 0
        },
        {
          "action": "deep_search",
          "success": 8,
          "failed": 3,
          "in_progress": 0
        },
        {
          "action": "verify_emails",
          "success": 3,
          "failed": 0,
          "in_progress": 0
        },
        {
          "action": "find_emails",
          "success": 4,
          "failed": 0,
          "in_progress": 0
        },
        {
          "action": "ai_company_search",
          "success": 2,
          "failed": 2,
          "in_progress": 0
        },
        {
          "action": "add_leads",
          "success": 11,
          "failed": 1,
          "in_progress": 0
        }
      ],
      "items": [
        {
          "id": "a1a4c806-4240-45bc-a388-72b23fec096b",
          "action": "create_variables",
          "status": "success",
          "message": "✅ Variable Creation completed with 100% success rate\n📊 Results: 1/1 variables created successfully",
          "start_time": "2025-08-18T19:04:03.616",
          "end_time": "2025-08-18T19:04:17.533",
          "prospects": [
            {
              "linkedin_id": "maximilianmessing",
              "name": "Maximilian Messing"
            }
          ]
        },
        {
          "id": "d6127914-593f-4f69-9775-3b581034db42",
          "action": "deep_search",
          "status": "success",
          "message": "AI WEB SEARCH ENRICHMENT REPORT\n========================================\n\nTotal Enrichments: 1\nSuccessful: 1\nFailed: 0\nSuccess Rate: 100.00%\n\nPROMPT PERFORMANCE\n-------------------------\n✓ search company history: 1/1 (100.00%)",
          "start_time": "2025-08-18T19:01:00.229",
          "end_time": "2025-08-18T19:02:15.442",
          "prospects": [
            {
              "linkedin_id": "maximilianmessing",
              "name": "Maximilian Messing"
            }
          ]
        },
        {
          "id": "15f3d028-1d33-4331-9591-203934f9a892",
          "action": "deep_search",
          "status": "failed",
          "message": "AI WEB SEARCH ENRICHMENT REPORT\n========================================\n\nTotal Enrichments: 1\nSuccessful: 0\nFailed: 1\nSuccess Rate: 0.00%\n\nPROMPT PERFORMANCE\n-------------------------\n✗ search company history: 0/1 (0.00%)",
          "start_time": "2025-08-18T18:44:18.185",
          "end_time": "2025-08-18T18:45:06.709",
          "prospects": [
            {
              "linkedin_id": "maximilianmessing",
              "name": "Maximilian Messing"
            }
          ]
        },
        {
          "id": "4c0e9e58-85cc-4760-8eb7-efe1dd9d1a00",
          "action": "create_variables",
          "status": "success",
          "message": "✅ Variable Creation completed with 100% success rate\n📊 Results: 1/1 variables created successfully",
          "start_time": "2025-08-18T18:38:55.439",
          "end_time": "2025-08-18T18:39:09.861",
          "prospects": [
            {
              "linkedin_id": "mentalfitnessguy",
              "name": "Glen Stevens Jr"
            }
          ]
        },
        {
          "id": "492912af-aca3-40be-bc9f-f3158b93741a",
          "action": "create_variables",
          "status": "success",
          "message": "✅ Variable Creation completed with 100% success rate\n📊 Results: 1/1 variables created successfully",
          "start_time": "2025-08-16T10:52:41.764",
          "end_time": "2025-08-16T10:53:01.619",
          "prospects": [
            {
              "linkedin_id": "derekeuralesjr",
              "name": "Derek Eurales"
            }
          ]
        },
        {
          "id": "f2e648a5-834e-45c0-b098-17097505112c",
          "action": "verify_emails",
          "status": "success",
          "message": "📧 EMAIL VERIFICATION REPORT\nGenerated: 8/14/2025, 7:12:10 PM\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📊 SUMMARY\n• Total Processed: 5\n• Success Rate: 100%\n\n💡 RECOMMENDATIONS\n1. Multiple 'Risky' safe-to-send results. Consider caution in sending.",
          "start_time": "2025-08-14T19:11:36.878",
          "end_time": "2025-08-14T19:12:10.636",
          "prospects": [
            {
              "linkedin_id": "adamjtraub",
              "name": "Adam Traub"
            },
            {
              "linkedin_id": "sashaluccioniphd",
              "name": "Sasha Luccioni"
            },
            {
              "linkedin_id": "carmenconnectsu",
              "name": "Carmen Caldwell"
            },
            {
              "linkedin_id": "mentalfitnessguy",
              "name": "Glen Stevens Jr"
            },
            {
              "linkedin_id": "debbie-o-connell",
              "name": "Debbie O'Connell"
            }
          ]
        },
        {
          "id": "82b28814-3206-4661-86b8-74d858659889",
          "action": "find_emails",
          "status": "success",
          "message": "Processed 8 contacts\nFound 5 email addresses (62.5% success rate)\n\nEMAIL QUALITY\nAverage confidence score: 95%\nBusiness email accounts found: 5 out of 5\n\nWHAT DIDN'T WORK\n3 contacts had no discoverable emails\nMain issue: Companies don't publish their email patterns publicly\n\nRECOMMENDATIONS\n1. Consider using LinkedIn or other direct contact methods for these prospects.\n\n",
          "start_time": "2025-08-14T19:09:27.83",
          "end_time": "2025-08-14T19:11:35.927",
          "prospects": [
            {
              "linkedin_id": "alannalevenson",
              "name": "Alanna Levenson"
            },
            {
              "linkedin_id": "adamjtraub",
              "name": "Adam Traub"
            },
            {
              "linkedin_id": "carmenconnectsu",
              "name": "Carmen Caldwell"
            },
            {
              "linkedin_id": "amy-schadt-aa390b19",
              "name": "Amy Schadt"
            },
            {
              "linkedin_id": "debbie-o-connell",
              "name": "Debbie O'Connell"
            },
            {
              "linkedin_id": "eden-holt",
              "name": "Eden Holt"
            },
            {
              "linkedin_id": "mentalfitnessguy",
              "name": "Glen Stevens Jr"
            },
            {
              "linkedin_id": "sashaluccioniphd",
              "name": "Sasha Luccioni"
            }
          ]
        },
        {
          "id": "17e7593e-13bd-423d-bc44-e9e12c067cfe",
          "action": "verify_emails",
          "status": "success",
          "message": "📧 EMAIL VERIFICATION REPORT\nGenerated: 8/14/2025, 4:22:20 PM\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📊 SUMMARY\n• Total Processed: 1\n• Success Rate: 100%",
          "start_time": "2025-08-14T16:22:18.406",
          "end_time": "2025-08-14T16:22:20.345",
          "prospects": [
            {
              "linkedin_id": "alanmelton",
              "name": "Alan Melton"
            }
          ]
        },
        {
          "id": "6861c0e2-83ea-473d-852d-a2f1232781ca",
          "action": "verify_emails",
          "status": "success",
          "message": "📧 EMAIL VERIFICATION REPORT\nGenerated: 8/14/2025, 4:13:37 PM\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📊 SUMMARY\n• Total Processed: 5\n• Success Rate: 100%\n\n💡 RECOMMENDATIONS\n1. Multiple 'Risky' safe-to-send results. Consider caution in sending.",
          "start_time": "2025-08-14T16:13:34.306",
          "end_time": "2025-08-14T16:13:38.001",
          "prospects": [
            {
              "linkedin_id": "alanmelton",
              "name": "Alan Melton"
            },
            {
              "linkedin_id": "danwegner1",
              "name": "Dan Wegner"
            },
            {
              "linkedin_id": "derekeuralesjr",
              "name": "Derek Eurales"
            },
            {
              "linkedin_id": "debbie-zimmerman-phytofit-life",
              "name": "Debbie Zimmerman"
            },
            {
              "linkedin_id": "carolyncummins",
              "name": "Carolyn Cummins"
            }
          ]
        },
        {
          "id": "f35ae718-019f-484b-b4b6-8c1b533e623d",
          "action": "find_emails",
          "status": "success",
          "message": "Processed 5 contacts\nFound 5 email addresses (100% success rate)\n\nEMAIL QUALITY\nAverage confidence score: 95%\nBusiness email accounts found: 5 out of 5\n\n",
          "start_time": "2025-08-13T22:43:28.203",
          "end_time": "2025-08-13T22:44:02.951",
          "prospects": [
            {
              "linkedin_id": "carolyncummins",
              "name": "Carolyn Cummins"
            },
            {
              "linkedin_id": "danwegner1",
              "name": "Dan Wegner"
            },
            {
              "linkedin_id": "debbie-zimmerman-phytofit-life",
              "name": "Debbie Zimmerman"
            },
            {
              "linkedin_id": "emilylamia",
              "name": "Emily Lamia"
            },
            {
              "linkedin_id": "genia-silva-8a351775",
              "name": "Genia Silva"
            }
          ]
        },
        {
          "id": "f0ae606e-d4b1-4b3c-a7b8-3e786daf2626",
          "action": "find_emails",
          "status": "success",
          "message": "Processed 5 contacts\nFound 3 email addresses (60% success rate)\n\nEMAIL QUALITY\nAverage confidence score: 95.67%\nBusiness email accounts found: 3 out of 3\n\nWHAT DIDN'T WORK\n2 contacts had no discoverable emails\nMain issue: Companies don't publish their email patterns publicly\n\nRECOMMENDATIONS\n1. Consider using LinkedIn or other direct contact methods for these prospects.\n\n",
          "start_time": "2025-08-13T22:42:13.589",
          "end_time": "2025-08-13T22:42:17.542",
          "prospects": [
            {
              "linkedin_id": "corynott",
              "name": "Cory Nott"
            },
            {
              "linkedin_id": "derekeuralesjr",
              "name": "Derek Eurales"
            },
            {
              "linkedin_id": "eden-holt",
              "name": "Eden Holt"
            },
            {
              "linkedin_id": "maximilianmessing",
              "name": "Maximilian Messing"
            },
            {
              "linkedin_id": "robinlavitch",
              "name": "Robin Lavitch"
            }
          ]
        },
        {
          "id": "b972523f-1837-4faa-92b4-142429baf1f8",
          "action": "find_emails",
          "status": "success",
          "message": "Processed 5 contacts\nFound 3 email addresses (60% success rate)\n\nEMAIL QUALITY\nAverage confidence score: 99%\nBusiness email accounts found: 3 out of 3\n\nWHAT DIDN'T WORK\n2 contacts had no discoverable emails\nMain issue: Companies don't publish their email patterns publicly\n\nRECOMMENDATIONS\n1. Consider using LinkedIn or other direct contact methods for these prospects.\n\n",
          "start_time": "2025-08-13T22:33:18.926",
          "end_time": "2025-08-13T22:33:22.546",
          "prospects": [
            {
              "linkedin_id": "adamjtraub",
              "name": "Adam Traub"
            },
            {
              "linkedin_id": "alanmelton",
              "name": "Alan Melton"
            },
            {
              "linkedin_id": "amy-schadt-aa390b19",
              "name": "Amy Schadt"
            },
            {
              "linkedin_id": "catherine-a-wood-mba-mcc",
              "name": "Catherine Wood"
            },
            {
              "linkedin_id": "coachalisonsmith",
              "name": "Alison Smith"
            }
          ]
        },
        {
          "id": "c8618907-eaa3-45cd-9c7b-ac063f08078a",
          "action": "create_variables",
          "status": "success",
          "message": "✅ Variable Creation completed with 100% success rate\n📊 Results: 3/3 variables created successfully",
          "start_time": "2025-08-07T15:53:28.343",
          "end_time": "2025-08-07T18:39:51.132",
          "prospects": [
            {
              "linkedin_id": "bizcoachjason",
              "name": "Jason Rosado"
            },
            {
              "linkedin_id": "christiancoachinstitute",
              "name": "Janice LaVore Fletcher"
            },
            {
              "linkedin_id": "jason-kaprelian",
              "name": "Jason Kaprelian"
            }
          ]
        },
        {
          "id": "7bcce483-2f3d-45d6-9f3f-e4a7c0b64c7a",
          "action": "deep_search",
          "status": "success",
          "message": "AI WEB SEARCH ENRICHMENT REPORT\n========================================\n\nTotal Enrichments: 2\nSuccess Rate: 50.00%\n\nPROMPT PERFORMANCE\n-------------------------\n✗ random data boxing world champion      0/1 successful (0.00%)\n✓ random data mars mission      1/1 successful (100.00%)",
          "start_time": "2025-08-06T06:40:10.652982",
          "end_time": "2025-08-06T08:41:13.564",
          "prospects": [
            {
              "linkedin_id": "bizcoachjason",
              "name": "Jason Rosado"
            }
          ]
        },
        {
          "id": "f2bb0f2c-00c6-4d34-a4a8-9039bcbaf8ff",
          "action": "deep_search",
          "status": "failed",
          "message": "AI WEB SEARCH ENRICHMENT REPORT\n========================================\n\nTotal Enrichments: 2\nSuccess Rate: 0.00%\n\nPROMPT PERFORMANCE\n-------------------------\n✗ random data boxing world champion      0/1 successful (0.00%)\n✗ random data mars mission      0/1 successful (0.00%)",
          "start_time": "2025-08-06T06:35:40.054014",
          "end_time": "2025-08-06T08:35:55.667",
          "prospects": []
        },
        {
          "id": "0c735a4c-0239-409b-aeaf-a799ab170981",
          "action": "create_variables",
          "status": "success",
          "message": "📊 OVERALL SUMMARY\nTotal Records: 2 | Successes: 2 | Failures: 0 | Success Rate: 100.00%\n\n🎯 PROMPT PERFORMANCE\n\"random\": 1/1 (100.00%)\n\"name all caps\": 1/1 (100.00%)\n\n👤 PROSPECT PERFORMANCE\n\"Jason Rosado\": 2/2 successes\n",
          "start_time": "2025-08-06T08:17:03.906",
          "end_time": "2025-08-06T08:17:55.31",
          "prospects": [
            {
              "linkedin_id": "bizcoachjason",
              "name": "Jason Rosado"
            }
          ]
        },
        {
          "id": "39d0ed18-aaec-405a-91de-8cf7a1d4ca9e",
          "action": "ai_company_search",
          "status": "failed",
          "message": "❌ Processing failed with 0% success rate\n📊 Results: 0/1 prospects processed successfully\n\n📋 Failure breakdown:\n  • Prospect is self employed thus no point scraping anything else: 1 (100%)",
          "start_time": "2025-08-05T17:57:17.705",
          "end_time": "2025-08-05T17:57:51.619",
          "prospects": [
            {
              "linkedin_id": "gloria-walker-phd-acc-6054a916",
              "name": "Gloria Walker"
            }
          ]
        },
        {
          "id": "3907e390-ced9-48e9-adb7-af769f451c91",
          "action": "ai_company_search",
          "status": "success",
          "message": "✅ Processing completed with 100% success rate\n📊 Results: 1/1 prospects processed successfully",
          "start_time": "2025-08-05T17:54:30.017",
          "end_time": "2025-08-05T17:54:45.242",
          "prospects": []
        },
        {
          "id": "ae78a69a-dc6e-4719-90ac-2993528df5e5",
          "action": "create_variables",
          "status": "success",
          "message": "📊 OVERALL SUMMARY\nTotal Records: 3 | Successes: 3 | Failures: 0 | Success Rate: 100.00%\n\n🎯 PROMPT PERFORMANCE\n\"icebreaker reccomendation\": 3/3 (100.00%)\n\n👤 PROSPECT PERFORMANCE\n\"Scott D. Nielsen, MSOM\": 3/3 successes\n",
          "start_time": "2025-08-05T17:18:11.736",
          "end_time": "2025-08-05T17:23:20.887",
          "prospects": []
        },
        {
          "id": "69e0414f-f9b9-4b4a-8f1f-8e38adfa58c2",
          "action": "ai_company_search",
          "status": "failed",
          "message": "❌ Processing failed with 0% success rate\n📊 Results: 0/1 prospects processed successfully\n\n📋 Failure breakdown:\n  • Prospect is self employed thus no point scraping anything else: 1 (100%)",
          "start_time": "2025-08-05T15:25:41.451",
          "end_time": "2025-08-05T15:25:46.202",
          "prospects": []
        },
        {
          "id": "4eca0bfb-f7fe-4d81-a81e-599af0621945",
          "action": "ai_company_search",
          "status": "success",
          "message": "✅ Processing completed with 50% success rate\n📊 Results: 3/6 prospects processed successfully\n\n📋 Failure breakdown:\n  • Prospect is self employed thus no point scraping anything else: 2 (33%)\n  • No company was found: 1 (17%)",
          "start_time": "2025-08-04T23:12:40.384",
          "end_time": "2025-08-04T23:14:19.982",
          "prospects": []
        },
        {
          "id": "e187a7df-0015-4c57-bee7-86f3741ac289",
          "action": "add_leads",
          "status": "success",
          "message": "Processing Summary\n────────────────────────────────────────\nProspects processed      :   0  (success 0, failed 0)\nCompanies processed      :   1  (success 1, failed 0)\nDuplicates skipped       : prospects 0, companies 0\nCompany URLs found (from prospects) : 0\nCompany found rate       : 0%\nOverall success rate     : 100%\nOverall status           : SUCCESS\n────────────────────────────────────────\nInput overview\n  People URLs provided   : 0\n  Company URLs provided  : 0\n  Prospect URLs matched  : 0\n  Company URLs matched   : 1\n\nFailed prospect scrapes\n  none\n\nFailed company scrapes\n  none\n\nFlags active\n  none\n\nPipeline messages\n  • Prospect updated successfully\n────────────────────────────────────────",
          "start_time": "2025-08-04T12:28:27.518",
          "end_time": "2025-08-04T12:28:36.347",
          "prospects": []
        },
        {
          "id": "80292362-f7bc-403b-b10b-fbac4743e33a",
          "action": "add_leads",
          "status": "success",
          "message": "Processing Summary\n────────────────────────────────────────\nProspects processed      :   0  (success 0, failed 0)\nCompanies processed      :   1  (success 1, failed 0)\nDuplicates skipped       : prospects 0, companies 0\nCompany URLs found (from prospects) : 0\nCompany found rate       : 0%\nOverall success rate     : 100%\nOverall status           : SUCCESS\n────────────────────────────────────────\nInput overview\n  People URLs provided   : 0\n  Company URLs provided  : 0\n  Prospect URLs matched  : 0\n  Company URLs matched   : 1\n\nFailed prospect scrapes\n  none\n\nFailed company scrapes\n  none\n\nFlags active\n  none\n\nPipeline messages\n  • Prospect updated successfully\n────────────────────────────────────────",
          "start_time": "2025-08-04T12:20:53.72",
          "end_time": "2025-08-04T12:25:20.276",
          "prospects": []
        },
        {
          "id": "ae0d9abe-9dce-4016-ad48-b8eaca130a87",
          "action": "deep_search",
          "status": "success",
          "message": "AI WEB SEARCH ENRICHMENT REPORT\n========================================\n\nTotal Enrichments: 1\nSuccess Rate: 100.00%\n\nPROMPT PERFORMANCE\n-------------------------\n✓ search information about career      1/1 successful (100.00%)",
          "start_time": "2025-08-03T22:08:30.20933",
          "end_time": "2025-08-04T00:09:07.848",
          "prospects": []
        },
        {
          "id": "2bc5c1b1-39bd-47fa-ba12-1a49b8131f02",
          "action": "deep_search",
          "status": "failed",
          "message": "AI WEB SEARCH ENRICHMENT REPORT\n========================================\n\nTotal Enrichments: 1\nSuccess Rate: 0.00%\n\nPROMPT PERFORMANCE\n-------------------------\n✗ search information about career      0/1 successful (0.00%)",
          "start_time": "2025-08-03T22:05:58.356657",
          "end_time": "2025-08-04T00:06:23.783",
          "prospects": []
        },
        {
          "id": "3bb35f60-a7ba-434e-b4a8-6cdad00b42e3",
          "action": "deep_search",
          "status": "success",
          "message": "AI WEB SEARCH ENRICHMENT REPORT\n========================================\n\nTotal Enrichments: 1\nSuccess Rate: 100.00%\n\nPROMPT PERFORMANCE\n-------------------------\n✓ search information about career      1/1 successful (100.00%)",
          "start_time": "2025-08-03T21:26:45.137591",
          "end_time": "2025-08-03T23:27:11.519",
          "prospects": []
        },
        {
          "id": "dc4e67f1-d67d-4616-9f66-100e3f14f83b",
          "action": "add_leads",
          "status": "success",
          "message": "Processing Summary\n────────────────────────────────────────\nProspects processed      :   0  (success 0, failed 0)\nCompanies processed      :   1  (success 1, failed 0)\nDuplicates skipped       : prospects 0, companies 0\nCompany URLs found (from prospects) : 0\nCompany found rate       : 0%\nOverall success rate     : 100%\nOverall status           : SUCCESS\n────────────────────────────────────────\nInput overview\n  People URLs provided   : 0\n  Company URLs provided  : 1\n  Prospect URLs matched  : 0\n  Company URLs matched   : 1\n\nFailed prospect scrapes\n  none\n\nFailed company scrapes\n  none\n\nFlags active\n  none\n\nPipeline messages\n  • Prospect updated successfully\n────────────────────────────────────────",
          "start_time": "2025-08-03T22:59:28.76",
          "end_time": "2025-08-03T23:09:53.915",
          "prospects": []
        },
        {
          "id": "e3695d02-9b22-4498-b655-9d078d619b33",
          "action": "add_leads",
          "status": "success",
          "message": "Processing Summary\n────────────────────────────────────────\nProspects processed      :   0  (success 0, failed 0)\nCompanies processed      :   1  (success 1, failed 0)\nDuplicates skipped       : prospects 0, companies 0\nCompany URLs found (from prospects) : 0\nCompany found rate       : 0%\nOverall success rate     : 100%\nOverall status           : SUCCESS\n────────────────────────────────────────\nInput overview\n  People URLs provided   : 0\n  Company URLs provided  : 1\n  Prospect URLs matched  : 0\n  Company URLs matched   : 1\n\nFailed prospect scrapes\n  none\n\nFailed company scrapes\n  none\n\nFlags active\n  none\n\nPipeline messages\n  • Prospect updated successfully\n────────────────────────────────────────",
          "start_time": "2025-08-03T22:44:35.527",
          "end_time": "2025-08-03T22:50:43.376",
          "prospects": []
        },
        {
          "id": "7e782089-b11e-4128-a60a-83f6668fc0fd",
          "action": "add_leads",
          "status": "success",
          "message": "Processing Summary\n────────────────────────────────────────\nProspects processed      :   0  (success 0, failed 0)\nCompanies processed      :   1  (success 1, failed 0)\nDuplicates skipped       : prospects 0, companies 0\nCompany URLs found (from prospects) : 0\nCompany found rate       : 0%\nOverall success rate     : 100%\nOverall status           : SUCCESS\n────────────────────────────────────────\nInput overview\n  People URLs provided   : 0\n  Company URLs provided  : 1\n  Prospect URLs matched  : 0\n  Company URLs matched   : 1\n\nFailed prospect scrapes\n  none\n\nFailed company scrapes\n  none\n\nFlags active\n  none\n\nPipeline messages\n  • Prospect updated successfully\n────────────────────────────────────────",
          "start_time": "2025-08-03T20:56:55.018",
          "end_time": "2025-08-03T20:56:57.116",
          "prospects": []
        },
        {
          "id": "70d5bfc2-6e80-4885-8229-c5fba0f3c7f4",
          "action": "add_leads",
          "status": "success",
          "message": "Processing Summary\n────────────────────────────────────────\nProspects processed      :   0  (success 0, failed 0)\nCompanies processed      :   1  (success 1, failed 0)\nDuplicates skipped       : prospects 0, companies 0\nCompany URLs found (from prospects) : 0\nCompany found rate       : 0%\nOverall success rate     : 100%\nOverall status           : SUCCESS\n────────────────────────────────────────\nInput overview\n  People URLs provided   : 0\n  Company URLs provided  : 1\n  Prospect URLs matched  : 0\n  Company URLs matched   : 1\n\nFailed prospect scrapes\n  none\n\nFailed company scrapes\n  none\n\nFlags active\n  none\n\nPipeline messages\n  • 16 queue records processed, 48 prompt links created\n────────────────────────────────────────",
          "start_time": "2025-08-03T20:56:47.079",
          "end_time": "2025-08-03T20:56:47.471",
          "prospects": []
        },
        {
          "id": "09b1d334-cf21-42ed-8af8-d85f94a88890",
          "action": "add_leads",
          "status": "success",
          "message": "Processing Summary\n────────────────────────────────────────\nProspects processed      :   0  (success 0, failed 0)\nCompanies processed      :   1  (success 1, failed 0)\nDuplicates skipped       : prospects 0, companies 0\nCompany URLs found (from prospects) : 0\nCompany found rate       : 0%\nOverall success rate     : 100%\nOverall status           : SUCCESS\n────────────────────────────────────────\nInput overview\n  People URLs provided   : 0\n  Company URLs provided  : 1\n  Prospect URLs matched  : 0\n  Company URLs matched   : 1\n\nFailed prospect scrapes\n  none\n\nFailed company scrapes\n  none\n\nFlags active\n  none\n\nPipeline messages\n  none\n────────────────────────────────────────",
          "start_time": "2025-08-03T20:52:54.969",
          "end_time": "2025-08-03T20:52:55.205",
          "prospects": []
        },
        {
          "id": "a7e30944-860d-416a-839a-82b931099295",
          "action": "deep_search",
          "status": "success",
          "message": "AI WEB SEARCH ENRICHMENT REPORT\n========================================\n\nTotal Enrichments: 3\nSuccess Rate: 100.00%\n\nPROMPT PERFORMANCE\n-------------------------\n✓ search information about career      3/3 successful (100.00%)",
          "start_time": "2025-08-01T19:24:16.460823",
          "end_time": "2025-08-01T21:24:16.584",
          "prospects": []
        },
        {
          "id": "5ce57e91-0def-441e-93c9-055ece07bc2a",
          "action": "deep_search",
          "status": "success",
          "message": "AI WEB SEARCH ENRICHMENT REPORT\n========================================\n\nTotal Enrichments: 8\nSuccess Rate: 0.00%\nSystem Status: OPERATIONAL\n\nPROMPT PERFORMANCE\n-------------------------\n✗ search company history\n  0/3 successful (0.00%)\n\n✗ search information about career\n  0/2 successful (0.00%)\n\n✗ search podcasts appearence\n  0/3 successful (0.00%)\n\nPROSPECT SUMMARY\n--------------------\n✗ Jason Rosado ⚡️: 0.00% success\n✗ Glen Stevens Jr: 0.00% success\n✗ Genia Silva: 0.00% success\n\nSUMMARY\n---------------\n• 3 prompts tested\n• 3 prospects processed",
          "start_time": "2025-07-31T15:40:13.230863",
          "end_time": "2025-07-31T17:57:31.227",
          "prospects": []
        },
        {
          "id": "82e1eda3-6241-422f-ad0b-1cac2bc119bf",
          "action": "add_leads",
          "status": "success",
          "message": "some message",
          "start_time": "2025-07-27T00:34:36.425",
          "end_time": "2025-07-27T12:24:08.855",
          "prospects": []
        },
        {
          "id": "9f93e984-a0ad-4346-a037-84ca4d0bffe8",
          "action": "create_variables",
          "status": "success",
          "message": "📊 OVERALL SUMMARY\nTotal Records: 1 | Successes: 1 | Failures: 0 | Success Rate: 100.00%\n\n🎯 PROMPT PERFORMANCE\n\"icebreaker reccomendation\": 1/1 (100.00%)\n\n👤 PROSPECT PERFORMANCE\n\"Jason Rosado ⚡️\": 1/1 successes\n",
          "start_time": "2025-07-25T20:08:05.329",
          "end_time": "2025-07-25T20:08:16.454",
          "prospects": []
        },
        {
          "id": "87fb5d3d-3259-4879-99bf-a32ee0cf6660",
          "action": "create_variables",
          "status": "success",
          "message": "📊 OVERALL SUMMARY\nTotal Records: 11 | Successes: 11 | Failures: 0 | Success Rate: 100.00%\n\n🎯 PROMPT PERFORMANCE\n\"icebreaker reccomendation\": 11/11 (100.00%)\n\n👤 PROSPECT PERFORMANCE\n\"Gisel Brito Silverberg\": 1/1 successes\n\"Genia Silva\": 1/1 successes\n\"Forrest Huguenin\": 1/1 successes\n\"Fatima Medjoubi\": 1/1 successes\n\"Everardo Recendiz\": 1/1 successes\n\"Erin MacCoy\": 1/1 successes\n\"Erika Gilchrist\": 1/1 successes\n\"Ana Macko\": 1/1 successes\n\"Carlos Deleon\": 1/1 successes\n\"Abbe Lang\": 1/1 successes\n\"Adam Traub\": 1/1 successes\n",
          "start_time": "2025-07-25T00:56:45.168",
          "end_time": "2025-07-25T01:00:09.536",
          "prospects": []
        },
        {
          "id": "e89f5ae3-e213-4cbe-8fca-3b552de956d3",
          "action": "create_variables",
          "status": "success",
          "message": "📊 OVERALL SUMMARY\nTotal Records: 6 | Successes: 6 | Failures: 0 | Success Rate: 100.00%\n\n🎯 PROMPT PERFORMANCE\n\"Ice Breaker Company Work\": 3/3 (100.00%)\n\"icebreaker reccomendation\": 3/3 (100.00%)\n\n👤 PROSPECT PERFORMANCE\n\"Janice LaVore Fletcher\": 6/6 successes\n",
          "start_time": "2025-07-24T23:56:03.778",
          "end_time": "2025-07-24T23:56:04.187",
          "prospects": []
        },
        {
          "id": "6697be6a-96d6-487f-8d26-6e3bb856b93d",
          "action": "add_leads",
          "status": "success",
          "message": "Processing Summary\n────────────────────────────────────────\nProspects processed      :  14  (success 14, failed 0)\nCompanies processed      :   2  (success 2, failed 0)\nDuplicates skipped       : prospects 2, companies 0\nCompany URLs found (from prospects) : 8\nCompany found rate       : 57%\nOverall success rate     : 100%\nOverall status           : SUCCESS\n────────────────────────────────────────\nInput overview\n  People URLs provided   : 17\n  Company URLs provided  : 2\n  Prospect URLs matched  : 16\n  Company URLs matched   : 10\n\nFailed prospect scrapes\n  none\n\nFailed company scrapes\n  none\n\nFlags active\n  • find_emails\n  • send_notification\n  • add_to_ds_queue\n\nPipeline messages\n  • All prospects added successfully\n  • email sent successfully\n  • 16 queue records processed, 48 prompt links created\n────────────────────────────────────────",
          "start_time": "2025-07-22T00:05:32.159",
          "end_time": "2025-07-22T00:05:32.782",
          "prospects": []
        },
        {
          "id": "b8f792b5-e736-46ba-9c15-6173d932d891",
          "action": "deep_search",
          "status": "success",
          "message": "AI WEB SEARCH ENRICHMENT REPORT\n========================================\n\nTotal Enrichments: 4\nSuccess Rate: 75.00%\nSystem Status: OPERATIONAL\n\nPROMPT PERFORMANCE\n-------------------------\n✓ search information about career\n  2/2 successful (100.00%)\n\n✓ search podcasts appearence\n  1/2 successful (50.00%)\n\nPROSPECT SUMMARY\n--------------------\n✓ Glen Stevens Jr: 50.00% success\n✓ Maximilian Messing: 100.00% success\n\nSUMMARY\n---------------\n• 2 prompts tested\n• 2 prospects processed",
          "start_time": "2025-07-13T19:33:26.881897",
          "end_time": "2025-07-13T21:38:50.118",
          "prospects": []
        },
        {
          "id": "93dbd97b-53f6-4a26-9472-ff713e32916c",
          "action": "deep_search",
          "status": "success",
          "message": "AI WEB SEARCH ENRICHMENT REPORT\n========================================\n\nTotal Enrichments: 4\nSuccess Rate: 100.00%\nSystem Status: OPERATIONAL\n\nPROMPT PERFORMANCE\n-------------------------\n✓ search information about career\n  4/4 successful (100.00%)\n\nSUMMARY\n---------------\n• 1 prompts tested\n• 1 prospects processed",
          "start_time": "2025-07-13T16:50:15.920433",
          "end_time": "2025-07-13T21:30:48.077",
          "prospects": []
        },
        {
          "id": "15cfe47f-67a5-4232-b33c-5e713172d859",
          "action": "add_leads",
          "status": "success",
          "message": "📊 Processing Report\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n👤 Prospects  ✅ 1 | ❌ 0\n🏢 Companies  ✅ 0 | ❌ 0\n🔄 Duplicates : 0\n⚠️  Errors     : 0\n\n🏢 Companies found  : 1\n📄 Companies scraped: 0\n\n🌐 Branch overview\n   • people    : requested   1 | received   1 | SUCCESS\n\n🌐 Input URLs\n   • people      : 1\n   • companies   : 0\n   • NOT processed ─ people      : 0\n                     companies   : 0\n\n📈 Overall success rate: 100%\n🚦 Overall status      : SUCCESS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "start_time": "2025-06-28T22:37:47.206",
          "end_time": "2025-06-28T22:39:01.677",
          "prospects": []
        },
        {
          "id": "2b8c02ca-0c50-4516-a2bc-6a22c4582b55",
          "action": "add_leads",
          "status": "failed",
          "message": "📊 Processing Report\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n👤 Prospects  ✅ 1 | ❌ 0\n🏢 Companies  ✅ 0 | ❌ 0\n🔄 Duplicates : 0\n⚠️  Errors     : 0\n\n🏢 Companies found  : 1\n📄 Companies scraped: 1\n\n🌐 Branch overview\n   • people    : requested   1 | received   1 | SUCCESS\n\n🌐 Input URLs\n   • people      : 1\n   • companies   : 0\n   • NOT processed ─ people      : 0\n                     companies   : 0\n\n📈 Overall success rate: 100%\n🚦 Overall status      : SUCCESS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "start_time": "2025-06-28T13:58:25.222",
          "end_time": "2025-06-28T13:58:25.667",
          "prospects": []
        },
        {
          "id": "b2a38cb7-cc22-4659-bd48-48af7567d9d4",
          "action": "add_leads",
          "status": "success",
          "message": "📊 Processing Report\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n👤 Prospects  ✅ 37 | ❌ 2\n🏢 Companies  ✅ 4 | ❌ 0\n🔄 Duplicates : 0\n⚠️  Errors     : 0\n\n🏢 Companies found  : 28\n📄 Companies scraped: 28\n\n🌐 Branch overview\n   • people    : requested  39 | received  39 | SUCCESS\n   • companies : requested   4 | received   4 | SUCCESS\n\n🌐 Input URLs\n   • people      : 39\n   • companies   : 4\n   • NOT processed ─ people      : 2\n                     companies   : 0\n\n📈 Overall success rate: 95%\n🚦 Overall status      : SUCCESS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "start_time": "2025-06-25T20:09:04.959",
          "end_time": "2025-06-25T20:10:44.938",
          "prospects": []
        }
      ],
      "failedOperations": [
        {
          "id": "15f3d028-1d33-4331-9591-203934f9a892",
          "action": "deep_search",
          "status": "failed",
          "message": "AI WEB SEARCH ENRICHMENT REPORT\n========================================\n\nTotal Enrichments: 1\nSuccessful: 0\nFailed: 1\nSuccess Rate: 0.00%\n\nPROMPT PERFORMANCE\n-------------------------\n✗ search company history: 0/1 (0.00%)",
          "start_time": "2025-08-18T18:44:18.185",
          "end_time": "2025-08-18T18:45:06.709",
          "prospects": [
            {
              "linkedin_id": "maximilianmessing",
              "name": "Maximilian Messing"
            }
          ],
          "retry_eligible": false
        },
        {
          "id": "f2bb0f2c-00c6-4d34-a4a8-9039bcbaf8ff",
          "action": "deep_search",
          "status": "failed",
          "message": "AI WEB SEARCH ENRICHMENT REPORT\n========================================\n\nTotal Enrichments: 2\nSuccess Rate: 0.00%\n\nPROMPT PERFORMANCE\n-------------------------\n✗ random data boxing world champion      0/1 successful (0.00%)\n✗ random data mars mission      0/1 successful (0.00%)",
          "start_time": "2025-08-06T06:35:40.054014",
          "end_time": "2025-08-06T08:35:55.667",
          "prospects": [],
          "retry_eligible": false
        },
        {
          "id": "39d0ed18-aaec-405a-91de-8cf7a1d4ca9e",
          "action": "ai_company_search",
          "status": "failed",
          "message": "❌ Processing failed with 0% success rate\n📊 Results: 0/1 prospects processed successfully\n\n📋 Failure breakdown:\n  • Prospect is self employed thus no point scraping anything else: 1 (100%)",
          "start_time": "2025-08-05T17:57:17.705",
          "end_time": "2025-08-05T17:57:51.619",
          "prospects": [
            {
              "linkedin_id": "gloria-walker-phd-acc-6054a916",
              "name": "Gloria Walker"
            }
          ],
          "retry_eligible": false
        },
        {
          "id": "69e0414f-f9b9-4b4a-8f1f-8e38adfa58c2",
          "action": "ai_company_search",
          "status": "failed",
          "message": "❌ Processing failed with 0% success rate\n📊 Results: 0/1 prospects processed successfully\n\n📋 Failure breakdown:\n  • Prospect is self employed thus no point scraping anything else: 1 (100%)",
          "start_time": "2025-08-05T15:25:41.451",
          "end_time": "2025-08-05T15:25:46.202",
          "prospects": [],
          "retry_eligible": false
        },
        {
          "id": "2bc5c1b1-39bd-47fa-ba12-1a49b8131f02",
          "action": "deep_search",
          "status": "failed",
          "message": "AI WEB SEARCH ENRICHMENT REPORT\n========================================\n\nTotal Enrichments: 1\nSuccess Rate: 0.00%\n\nPROMPT PERFORMANCE\n-------------------------\n✗ search information about career      0/1 successful (0.00%)",
          "start_time": "2025-08-03T22:05:58.356657",
          "end_time": "2025-08-04T00:06:23.783",
          "prospects": [],
          "retry_eligible": false
        },
        {
          "id": "2b8c02ca-0c50-4516-a2bc-6a22c4582b55",
          "action": "add_leads",
          "status": "failed",
          "message": "📊 Processing Report\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n👤 Prospects  ✅ 1 | ❌ 0\n🏢 Companies  ✅ 0 | ❌ 0\n🔄 Duplicates : 0\n⚠️  Errors     : 0\n\n🏢 Companies found  : 1\n📄 Companies scraped: 1\n\n🌐 Branch overview\n   • people    : requested   1 | received   1 | SUCCESS\n\n🌐 Input URLs\n   • people      : 1\n   • companies   : 0\n   • NOT processed ─ people      : 0\n                     companies   : 0\n\n📈 Overall success rate: 100%\n🚦 Overall status      : SUCCESS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "start_time": "2025-06-28T13:58:25.222",
          "end_time": "2025-06-28T13:58:25.667",
          "prospects": [],
          "retry_eligible": false
        }
      ]
    }
  },
  "queues": {
    "deepSearch": {
      "total": 10,
      "byPrompt": [
        {
          "prompt_id": "6b55c92a-6dd8-4372-a804-39b9f2bea411",
          "prompt_name": "search company history",
          "count": 10
        }
      ]
    }
  },
  "engagement": {
    "prompts": {
      "byVariables": [
        {
          "prompt_id": "c8ccb966-a570-4237-ab94-ed47a4dcf8d0",
          "prompt_name": "icebreaker reccomendation",
          "count": 15
        },
        {
          "prompt_id": "290eb395-0cfa-455d-9678-ceb446947668",
          "prompt_name": "Ice Breaker Company Work",
          "count": 1
        },
        {
          "prompt_id": "1135fc13-8399-4aff-a8a2-58173ad31359",
          "prompt_name": "icebreaker-career",
          "count": 1
        }
      ],
      "byEnrichment": [
        {
          "prompt_id": "4983790d-b61c-4859-bda5-074685c2a9ed",
          "prompt_name": "search podcasts appearence",
          "count": 1
        },
        {
          "prompt_id": "511b78cc-395b-48b7-857c-8422f424d450",
          "prompt_name": "search information about career",
          "count": 3
        },
        {
          "prompt_id": "6b55c92a-6dd8-4372-a804-39b9f2bea411",
          "prompt_name": "search company history",
          "count": 1
        }
      ],
      "top": [
        {
          "prompt_id": "c8ccb966-a570-4237-ab94-ed47a4dcf8d0",
          "prompt_name": "icebreaker reccomendation",
          "variables": 15,
          "enrichment": 0,
          "totalUsage": 15
        },
        {
          "prompt_id": "511b78cc-395b-48b7-857c-8422f424d450",
          "prompt_name": "search information about career",
          "variables": 0,
          "enrichment": 3,
          "totalUsage": 3
        },
        {
          "prompt_id": "290eb395-0cfa-455d-9678-ceb446947668",
          "prompt_name": "Ice Breaker Company Work",
          "variables": 1,
          "enrichment": 0,
          "totalUsage": 1
        },
        {
          "prompt_id": "1135fc13-8399-4aff-a8a2-58173ad31359",
          "prompt_name": "icebreaker-career",
          "variables": 1,
          "enrichment": 0,
          "totalUsage": 1
        },
        {
          "prompt_id": "4983790d-b61c-4859-bda5-074685c2a9ed",
          "prompt_name": "search podcasts appearence",
          "variables": 0,
          "enrichment": 1,
          "totalUsage": 1
        }
      ]
    }
  }
}

export default MOCK_DASHBOARD_DATA
