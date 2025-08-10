import * as React from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from './AuthContext'
import { useFetchCampaigns } from '@/api/campaign-context/fetchCampaigns'
import { useAddProspectToCampaign } from '@/api/campaign-context/addProspectsToCampaign'
// TODO: Uncomment and wire up when implemented
// import { useRemoveProspectsFromCampaign } from '@/api/campaign-context/removeProspectsFromCampaign'
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

  // Placeholders — replace with real hooks when available. All expose mutateAsync.
  const removeProspectsFromCampaignMutation = useMutation({
    mutationFn: async () => {
      throw new Error('useRemoveProspectsFromCampaign not implemented')
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['campaigns', user_id])
    },
    onError: (error) => {
      toast.error(error?.message || 'Remove prospects from campaign not implemented')
    },
  })




  // Wrapper helper functions — always use mutateAsync

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

      // Wrapper functions (all use mutateAsync)
      removeProspectsFromCampaign,

      // Helpers
      refetchCampaigns,
      invalidateCampaigns,
      getCampaignById,

      // Loading states
      isAddingToCampaign: addProspectsToCampaignMutation.isPending,
      isRemovingFromCampaign: removeProspectsFromCampaignMutation.isPending,
    }),
    [
      campaigns,
      isLoadingCampaigns,
      isErrorCampaigns,
      user_id,
      addProspectsToCampaignMutation,
      removeProspectsFromCampaignMutation,
      removeProspectsFromCampaign,
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

export default CampaignsContext
