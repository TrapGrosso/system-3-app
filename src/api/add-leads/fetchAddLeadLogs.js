import { useQuery } from '@tanstack/react-query'

const fetchAddLeadLogs = async (user_id) => {
  const response = await fetch(`https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/fetchAddLeadLogs?user_id=${user_id}`, {
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
  
  // Extract only the data field from the response
  return result.data || []
}

export const useFetchAddLeadLogs = (userId) => {
  return useQuery({
    queryKey: ['addLeadLogs', userId],
    queryFn: () => fetchAddLeadLogs(userId),
    staleTime: 30000, // 30 seconds - logs are relatively fresh data
    cacheTime: 300000, // 5 minutes cache
    refetchInterval: 60000, // Refetch every minute to get latest logs
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}
