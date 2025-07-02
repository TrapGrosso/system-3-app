import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useFetchGroups } from "@/api/groups-context/fetchGroups"
import { useAddToGroup } from "@/api/groups-context/addToGroup"
import { useCreateGroup } from "@/api/groups-context/createGroup"
import { useDeleteGroup } from "@/api/groups-context/deleteGroup"
import { useRemoveFromGroup } from "@/api/groups-context/removeFromGroup"
import { useRemoveFromAllGroups } from "@/api/groups-context/removeFromAllGroups"
import { useAuth } from "./AuthContext"

const GroupsContext = React.createContext(null)

export const GroupsProvider = ({ children }) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const user_id = user?.id

  // Fetch groups
  const {
    data: groups = [],
    isLoading: isLoadingGroups,
    isError: isErrorGroups,
    refetch: refetchGroups,
  } = useFetchGroups(user_id)

  // Create group mutation
  const createGroupMutation = useCreateGroup({
    onSuccess: (data) => {
      const message = data.message || 'Group created successfully'
      toast.success(message)
      queryClient.invalidateQueries(['fetchGroups', user_id])
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create group")
    },
  })

  // Delete group mutation
  const deleteGroupMutation = useDeleteGroup({
    onSuccess: (data) => {
      const message = data.message || 'Group deleted successfully'
      toast.success(message)
      queryClient.invalidateQueries(['fetchGroups', user_id])
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete group")
    },
  })

  // Add to group mutation
  const addToGroupMutation = useAddToGroup({
    onSuccess: (data) => {
      const message = data.message || 'Successfully added leads to group'
      toast.success(message)
      queryClient.invalidateQueries(['fetchGroups', user_id])
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add leads to group")
    },
  })

  // Remove from group mutation
  const removeFromGroupMutation = useRemoveFromGroup({
    onSuccess: (data) => {
      const message = data.message || 'Successfully removed leads from group'
      toast.success(message)
      queryClient.invalidateQueries(['fetchGroups', user_id])
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove leads from group")
    },
  })

  // Remove from all groups mutation
  const removeFromAllGroupsMutation = useRemoveFromAllGroups({
    onSuccess: (data) => {
      const message = data.message || 'Successfully removed lead from all groups'
      toast.success(message)
      queryClient.invalidateQueries(['fetchGroups', user_id])
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove lead from all groups")
    },
  })

  // Helper functions
  const getGroupById = React.useCallback(
    (id) => groups.find((g) => g.id === id),
    [groups]
  )

  const invalidateGroups = React.useCallback(
    () => queryClient.invalidateQueries(['fetchGroups', user_id]),
    [queryClient, user_id]
  )

  const value = React.useMemo(
    () => ({
      // Data
      groups,
      isLoadingGroups,
      isErrorGroups,
      user_id,

      // Mutations
      createGroup: createGroupMutation,
      deleteGroup: deleteGroupMutation,
      addToGroup: addToGroupMutation,
      removeFromGroup: removeFromGroupMutation,
      removeFromAllGroups: removeFromAllGroupsMutation,

      // Helpers
      refetchGroups,
      invalidateGroups,
      getGroupById,
    }),
    [
      groups,
      isLoadingGroups,
      isErrorGroups,
      user_id,
      createGroupMutation,
      deleteGroupMutation,
      addToGroupMutation,
      removeFromGroupMutation,
      removeFromAllGroupsMutation,
      refetchGroups,
      invalidateGroups,
      getGroupById,
    ]
  )

  return (
    <GroupsContext.Provider value={value}>
      {children}
    </GroupsContext.Provider>
  )
}

export const useGroups = () => {
  const context = React.useContext(GroupsContext)
  if (!context) {
    throw new Error("useGroups must be used within a GroupsProvider")
  }
  return context
}
