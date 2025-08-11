import { useQuery } from '@tanstack/react-query'

const getCampaignDetails = async (user_id, campaign_id) => {
  const response = await fetch(`https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/getCampaignDetails?user_id=${user_id}&campaign_id=${campaign_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch add lead logs')
  }

  const result = await response.json()
  
  return result || []
}

export const usegetCampaignDetails = (userId, campaign_id) => {
  return useQuery({
    queryKey: ['getCampaignDetails', userId, campaign_id],
    queryFn: () => getCampaignDetails(userId, campaign_id),
    staleTime: 30000, // 30 seconds 
    cacheTime: 300000, // 5 minutes cache
    refetchInterval: 60000, // Refetch every minute 
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}
