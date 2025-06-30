import { useQuery } from '@tanstack/react-query'

const fetchProspects = async (user_id) => {
  const response = await fetch(`https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/getAllProspects?user_id=${user_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch prospects')
  }

  const result = await response.json()
  
  // Extract only the data field from the response
  return result.data || []
}

export const useFetchProspects = (userId) => {
  return useQuery({
    queryKey: ['prospects', userId],
    queryFn: () => fetchProspects(userId),
    staleTime: 60000, // 60 seconds - prospects data is relatively stable
    cacheTime: 300000, // 5 minutes cache
    refetchInterval: 120000, // Refetch every 2 minutes to get latest prospects
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

/**
 * EXAMPLE PAYLOAD
 * 
 * 
  {
    "success": true,
    "data": [
      {
        "linkedin_id": "elizaveta-sheshko",
        "first_name": "Lizaveta",
        "last_name": "Sheshka",
        "headline": "IT Innovations Manager | FTECH",
        "title": "IT Innovation Manager",
        "status": "new",
        "location": "Poland",
        "email": null,
        "company_name": null,
        "has_bd_scrape": true,
        "has_deep_search": false,
        "note_count": 0,
        "task_count": 0,
        "groups": [],
        "campaigns": []
      },
      {
        "linkedin_id": "adamjtraub",
        "first_name": "Adam",
        "last_name": "Traub",
        "headline": "Franchise Business Coach",
        "title": "Franchise Business Coach",
        "status": "new",
        "location": "Carlsbad, California, United States",
        "email": null,
        "company_name": null,
        "has_bd_scrape": true,
        "has_deep_search": false,
        "note_count": 0,
        "task_count": 0,
        "groups": [],
        "campaigns": []
      },
      {
        "linkedin_id": "lifespider",
        "first_name": "Birgitta",
        "last_name": "Granstrom",
        "headline": "Do you belong to The Weird Ones? If you've ever felt out of place, misunderstood, or…",
        "title": "",
        "status": "new",
        "location": "Salem, Oregon, United States",
        "email": null,
        "company_name": null,
        "has_bd_scrape": true,
        "has_deep_search": false,
        "note_count": 0,
        "task_count": 0,
        "groups": [],
        "campaigns": []
      }
    ],
    "timestamp": "2025-06-30T11:07:09.530Z"
  }
 */