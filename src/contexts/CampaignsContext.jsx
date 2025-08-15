import * as React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from './AuthContext'
import { useFetchCampaigns } from '@/api/campaign-context/fetchCampaigns'
import { useAddProspectToCampaign } from '@/api/campaign-context/addProspectsToCampaign'
import { useRemoveProspectFromCampaign } from '@/api/campaign-context/removeProspectsFromCampaign'
import { useSyncIstantlyCampaigns, useSyncIstantlyProspectCampaigns } from '@/api/campaign-context/syncIstantlyWithDb'
import { useGetProspectCampaigns } from '@/api/campaign-context/getProspectCampaigns'
// import { useCreateCampaign } from '@/api/campaign-context/createCampaign'

const CampaignsContext = React.createContext(null)

export const CampaignsProvider = ({ children }) => {
  const { user } = useAuth()
  const user_id = user?.id
  const queryClient = useQueryClient()

  // Fetch campaigns list
  const {
    data: campaigns = [],
    isLoading: isLoadingCampaigns,
    isError: isErrorCampaigns,
    refetch: refetchCampaigns,
  } = useFetchCampaigns(user_id)

  // Add prospects to campaign
  const addProspectsToCampaignMutation = useAddProspectToCampaign({
    onSuccess: (data) => {
      const message = data?.message || 'Prospect(s) added to campaign'
      toast.success(message)
      queryClient.invalidateQueries(['campaigns', user_id])
      // Optionally keep prospects views in sync if they depend on campaign filters
      queryClient.invalidateQueries({ queryKey: ['prospects', user_id] })
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to add prospect(s) to campaign')
    },
  })

  // Remove prospects from campaign
  const removeProspectsFromCampaignMutation = useRemoveProspectFromCampaign({
    onSuccess: (data) => {
      const message = data?.message || 'Prospect(s) removed from campaign'
      toast.success(message)
      // Invalidate campaigns and all prospects queries for this user
      queryClient.invalidateQueries(['campaigns', user_id])
      queryClient.invalidateQueries(['prospects', user_id])
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to remove prospect(s) from campaign')
    },
  })

  // Sync Instantly campaigns -> DB
  const syncInstantlyCampaignsMutation = useSyncIstantlyCampaigns({
    onSuccess: (data) => {
      const message = data?.message || 'Campaigns synced successfully'
      toast.success(message)
      queryClient.invalidateQueries(['campaigns', user_id])
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to sync campaigns')
    },
  })

  // Sync Instantly leads per campaign -> campaign_prospect
  const syncInstantlyProspectCampaignsMutation = useSyncIstantlyProspectCampaigns({
    onSuccess: (data) => {
      const message = data?.message || 'Campaign prospects synced successfully'
      toast.success(message)
      queryClient.invalidateQueries(['campaigns', user_id])
      // Invalidate all prospects queries (partial match to include filters/pagination)
      queryClient.invalidateQueries(['prospects', user_id])
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to sync campaign prospects')
    },
  })




  // Wrapper helper functions — always use mutateAsync

  const addProspectsToCampaign = React.useCallback(
    (campaign_id, prospect_ids, options = { include_only_verified: true, include_risky_emails: false }) => {
      return addProspectsToCampaignMutation.mutateAsync({
        user_id,
        campaign_id,
        prospect_ids: Array.isArray(prospect_ids) ? prospect_ids : [prospect_ids],
        options
      })
    },
    [addProspectsToCampaignMutation, user_id]
  )

  const removeProspectsFromCampaign = React.useCallback(
    (campaign_id, prospect_ids) => {
      return removeProspectsFromCampaignMutation.mutateAsync({
        user_id,
        campaign_id,
        prospect_ids: Array.isArray(prospect_ids) ? prospect_ids : [prospect_ids],
      })
    },
    [removeProspectsFromCampaignMutation, user_id]
  )

  const syncCampaigns = React.useCallback(
    () => {
      return syncInstantlyCampaignsMutation.mutateAsync({ userId: user_id })
    },
    [syncInstantlyCampaignsMutation, user_id]
  )

  const syncProspects = React.useCallback(
    () => {
      return syncInstantlyProspectCampaignsMutation.mutateAsync({ userId: user_id })
    },
    [syncInstantlyProspectCampaignsMutation, user_id]
  )

  const syncAll = React.useCallback(
    async () => {
      // Sequential to ensure campaigns are up-to-date before syncing leads
      await syncCampaigns()
      await syncProspects()
    },
    [syncCampaigns, syncProspects]
  )




  // Utilities
  const getCampaignById = React.useCallback(
    (id) => campaigns.find((c) => c.id === id),
    [campaigns]
  )

  const invalidateCampaigns = React.useCallback(
    () => queryClient.invalidateQueries(['campaigns', user_id]),
    [queryClient, user_id]
  )

  const value = React.useMemo(
    () => ({
      // Data
      campaigns,
      isLoadingCampaigns,
      isErrorCampaigns,
      user_id,

      // Raw mutations (objects)
      addProspectsToCampaignMutation,
      removeProspectsFromCampaignMutation,
      syncInstantlyCampaignsMutation,
      syncInstantlyProspectCampaignsMutation,

      // Wrapper functions (all use mutateAsync)
      addProspectsToCampaign,
      removeProspectsFromCampaign,
      syncCampaigns,
      syncProspects,
      syncAll,

      // Helpers
      refetchCampaigns,
      invalidateCampaigns,
      getCampaignById,

      // Loading states
      isAddingToCampaign: addProspectsToCampaignMutation.isPending,
      isRemovingFromCampaign: removeProspectsFromCampaignMutation.isPending,
      isSyncingCampaigns: syncInstantlyCampaignsMutation.isPending,
      isSyncingProspects: syncInstantlyProspectCampaignsMutation.isPending,
      isSyncingAll: syncInstantlyCampaignsMutation.isPending || syncInstantlyProspectCampaignsMutation.isPending,
    }),
    [
      campaigns,
      isLoadingCampaigns,
      isErrorCampaigns,
      user_id,
      addProspectsToCampaignMutation,
      removeProspectsFromCampaignMutation,
      syncInstantlyCampaignsMutation,
      syncInstantlyProspectCampaignsMutation,
      addProspectsToCampaign,
      removeProspectsFromCampaign,
      syncCampaigns,
      syncProspects,
      syncAll,
      refetchCampaigns,
      invalidateCampaigns,
      getCampaignById,
    ]
  )

  return (
    <CampaignsContext.Provider value={value}>
      {children}
    </CampaignsContext.Provider>
  )
}

export const useCampaigns = () => {
  const context = React.useContext(CampaignsContext)
  if (!context) {
    throw new Error('useCampaigns must be used within a CampaignsProvider')
  }
  return context
}

// Optional convenience hook to fetch all campaigns using the API hook directly
export const useAllCampaigns = () => {
  const { user_id } = useCampaigns()
  return useFetchCampaigns(user_id)
}

// Optional convenience hook to fetch campaigns for a specific prospect using the API hook directly
export const useProspectCampaigns = (prospect_id) => {
  const { user_id } = useCampaigns()
  return useGetProspectCampaigns(user_id, prospect_id)
}

export default CampaignsContext
