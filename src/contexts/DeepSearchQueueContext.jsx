import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useGetDeepSearchQueueItems } from "@/api/deepSearchQueue-context/getDeepSearchQueueItems"
import { useAddToDeepSearchQueue } from "@/api/deepSearchQueue-context/addToDeepSearchQueue"
import { useUpdateDeepSearchQueueItems } from "@/api/deepSearchQueue-context/updateDeepSearchQueueItems"
import { useDeleteDeepSearchQueueItems } from "@/api/deepSearchQueue-context/deleteDeepSearchQueueItems"
import { useAuth } from "./AuthContext"

const DeepSearchQueueContext = React.createContext(null)

export const DeepSearchQueueProvider = ({ children }) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const user_id = user?.id

  // Fetch queue items
  const {
    data: queueItems = [],
    isLoading: isLoadingQueue,
    isError: isErrorQueue,
    refetch: refetchQueue,
  } = useGetDeepSearchQueueItems(user_id)

  // Add to queue mutation
  const addToQueueMutation = useAddToDeepSearchQueue({
    onSuccess: (data) => {
      const message = data.message || 'Successfully added to deep search queue'
      toast.success(message)
      queryClient.invalidateQueries(['getDeepSearchQueueItems', user_id])
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add to deep search queue")
    },
  })

  // Update queue mutation
  const updateQueueMutation = useUpdateDeepSearchQueueItems({
    onSuccess: (data) => {
      const message = data.message || 'Queue items updated successfully'
      toast.success(message)
      queryClient.invalidateQueries(['getDeepSearchQueueItems', user_id])
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update queue items")
    },
  })

  // Delete queue mutation
  const deleteQueueMutation = useDeleteDeepSearchQueueItems({
    onSuccess: (data) => {
      const message = data.message || 'Queue item(s) deleted successfully'
      toast.success(message)
      queryClient.invalidateQueries(['getDeepSearchQueueItems', user_id])
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete queue item(s)")
    },
  })

  // Core mutation wrappers
  const addProspects = React.useCallback(
    (prospect_ids, prompt_id) => {
      return addToQueueMutation.mutate({
        user_id,
        prospect_ids: Array.isArray(prospect_ids) ? prospect_ids : [prospect_ids],
        prompt_id
      })
    },
    [addToQueueMutation, user_id]
  )

  const updateProspects = React.useCallback(
    (prospect_ids, updated_prompt_id) => {
      return updateQueueMutation.mutate({
        user_id,
        prospect_ids: Array.isArray(prospect_ids) ? prospect_ids : [prospect_ids],
        updated_prompt_id
      })
    },
    [updateQueueMutation, user_id]
  )

  const deleteProspects = React.useCallback(
    (prospect_prompt_ids) => {
      return deleteQueueMutation.mutate({
        user_id,
        prospect_prompt_ids: Array.isArray(prospect_prompt_ids) ? prospect_prompt_ids : [prospect_prompt_ids]
      })
    },
    [deleteQueueMutation, user_id]
  )

  // Resolve functions (stubs for now)
  const resolveProspects = React.useCallback(
    (prospect_prompt_ids) => {
      const count = Array.isArray(prospect_prompt_ids) ? prospect_prompt_ids.length : 1
      toast.info(`Resolve ${count} item(s) - not yet implemented`)
    },
    []
  )

  const resolveAll = React.useCallback(
    () => {
      toast.info("Resolve entire queue - not yet implemented")
    },
    []
  )

  const value = React.useMemo(
    () => ({
      // Data
      queueItems,
      isLoadingQueue,
      isErrorQueue,
      user_id,

      // Core mutations
      addProspects,
      updateProspects,
      deleteProspects,
      refetchQueue,
      resolveProspects,
      resolveAll,

      // Loading states
      isAddingToQueue: addToQueueMutation.isPending,
      isUpdatingQueue: updateQueueMutation.isPending,
      isDeletingQueue: deleteQueueMutation.isPending,
    }),
    [
      queueItems,
      isLoadingQueue,
      isErrorQueue,
      user_id,
      addProspects,
      updateProspects,
      deleteProspects,
      refetchQueue,
      resolveProspects,
      resolveAll,
      addToQueueMutation.isPending,
      updateQueueMutation.isPending,
      deleteQueueMutation.isPending,
    ]
  )

  return (
    <DeepSearchQueueContext.Provider value={value}>
      {children}
    </DeepSearchQueueContext.Provider>
  )
}

export const useDeepSearchQueue = () => {
  const context = React.useContext(DeepSearchQueueContext)
  if (!context) {
    throw new Error("useDeepSearchQueue must be used within a DeepSearchQueueProvider")
  }
  return context
}
