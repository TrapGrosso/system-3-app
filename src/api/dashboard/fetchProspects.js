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
