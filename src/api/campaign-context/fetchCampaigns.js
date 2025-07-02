import { useQuery } from '@tanstack/react-query'

const fetchCampaigns = async (userId) => {
  // For now, we'll return an empty array since the campaigns endpoint
  // doesn't appear to be implemented yet. This can be updated later.
  // 
  // Expected API call would be:
  // const response = await fetch(`https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/getCampaigns?user_id=${userId}`, {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  //     'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
  //   },
  // })
  
  // Return mock data for now
  return []
}

export const useFetchCampaigns = (userId) => {
  return useQuery({
    queryKey: ['campaigns', userId],
    queryFn: () => fetchCampaigns(userId),
    staleTime: 300000, // 5 minutes - campaigns are relatively stable
    cacheTime: 600000, // 10 minutes cache
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}
