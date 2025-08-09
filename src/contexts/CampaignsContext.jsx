import * as React from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from './AuthContext'
import { useFetchCampaigns } from '@/api/campaign-context/fetchCampaigns'
import { useAddProspectToCampaign } from '@/api/campaign-context/addProspectsToCampaign'
// TODO: Uncomment and wire up when implemented
// import { useRemoveProspectsFromCampaign } from '@/api/campaign-context/removeProspectsFromCampaign'
// import { useUpdateCampaign } from '@/api/campaign-context/updateCampaign'
// import { useDeleteCampaign } from '@/api/campaign-context/deleteCampaign'
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

  const updateCampaignMutation = useMutation({
    mutationFn: async () => {
      throw new Error('useUpdateCampaign not implemented')
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['campaigns', user_id])
    },
    onError: (error) => {
      toast.error(error?.message || 'Update campaign not implemented')
    },
  })

  const deleteCampaignMutation = useMutation({
    mutationFn: async () => {
      throw new Error('useDeleteCampaign not implemented')
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['campaigns', user_id])
    },
    onError: (error) => {
      toast.error(error?.message || 'Delete campaign not implemented')
    },
  })

  const createCampaignMutation = useMutation({
    mutationFn: async () => {
      throw new Error('useCreateCampaign not implemented')
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['campaigns', user_id])
    },
    onError: (error) => {
      toast.error(error?.message || 'Create campaign not implemented')
    },
  })

  // Wrapper helper functions — always use mutateAsync
  const addProspectsToCampaign = React.useCallback(
    (campaign_id, prospect_ids) => {
      return addProspectsToCampaignMutation.mutateAsync({
        user_id,
        campaign_id,
        prospect_ids: Array.isArray(prospect_ids) ? prospect_ids : [prospect_ids],
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

  const updateCampaign = React.useCallback(
    (campaign_id, updates) => {
      return updateCampaignMutation.mutateAsync({
        user_id,
        campaign_id,
        ...updates,
      })
    },
    [updateCampaignMutation, user_id]
  )

  const deleteCampaign = React.useCallback(
    (campaign_id) => {
      return deleteCampaignMutation.mutateAsync({
        user_id,
        campaign_id,
      })
    },
    [deleteCampaignMutation, user_id]
  )

  const createCampaign = React.useCallback(
    (payload) => {
      return createCampaignMutation.mutateAsync({
        user_id,
        ...payload,
      })
    },
    [createCampaignMutation, user_id]
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
      updateCampaignMutation,
      deleteCampaignMutation,
      createCampaignMutation,

      // Wrapper functions (all use mutateAsync)
      addProspectsToCampaign,
      removeProspectsFromCampaign,
      updateCampaign,
      deleteCampaign,
      createCampaign,

      // Helpers
      refetchCampaigns,
      invalidateCampaigns,
      getCampaignById,

      // Loading states
      isAddingToCampaign: addProspectsToCampaignMutation.isPending,
      isRemovingFromCampaign: removeProspectsFromCampaignMutation.isPending,
      isUpdatingCampaign: updateCampaignMutation.isPending,
      isDeletingCampaign: deleteCampaignMutation.isPending,
      isCreatingCampaign: createCampaignMutation.isPending,
    }),
    [
      campaigns,
      isLoadingCampaigns,
      isErrorCampaigns,
      user_id,
      addProspectsToCampaignMutation,
      removeProspectsFromCampaignMutation,
      updateCampaignMutation,
      deleteCampaignMutation,
      createCampaignMutation,
      addProspectsToCampaign,
      removeProspectsFromCampaign,
      updateCampaign,
      deleteCampaign,
      createCampaign,
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
