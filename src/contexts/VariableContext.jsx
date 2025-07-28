import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useGetVariables } from "@/api/variable-context/getVariables"
import { useCreateVariable } from "@/api/variable-context/createVariable"
import { useUpdateVariable } from "@/api/variable-context/updateVariable"
import { useDeleteVariables } from "@/api/variable-context/deleteVariables"
import { useAuth } from "./AuthContext"

const VariableContext = React.createContext(null)

export const VariableProvider = ({ children }) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const user_id = user?.id

  // Create variable mutation
  const createVariableMutation = useCreateVariable({
    onSuccess: (data) => {
      const message = data.message || 'Variable created successfully'
      toast.success(message)
      // Invalidate all variables queries
      queryClient.invalidateQueries(['variables', user_id])
      // If variable was created for a specific prospect, invalidate that query too
      if (data.data?.variable?.prospect_id) {
        queryClient.invalidateQueries(['variables', user_id, data.data.variable.prospect_id])
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create variable")
    },
  })

  // Update variable mutation
  const updateVariableMutation = useUpdateVariable({
    onSuccess: (data) => {
      const message = data.message || 'Variable updated successfully'
      toast.success(message)
      // Invalidate all variables queries
      queryClient.invalidateQueries(['variables', user_id])
      // If the variable has a prospect_id, invalidate that specific prospect's variables
      if (data.data?.variable?.prospect_id) {
        queryClient.invalidateQueries(['variables', user_id, data.data.variable.prospect_id])
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update variable")
    },
  })

  // Delete variables mutation
  const deleteVariablesMutation = useDeleteVariables({
    onSuccess: (data) => {
      const message = data.message || 'Variable(s) deleted successfully'
      toast.success(message)
      // Invalidate all variables queries
      queryClient.invalidateQueries(['variables', user_id])
      // Invalidate all prospect variables queries since we don't know which prospects were affected
      queryClient.invalidateQueries(['variables', user_id])
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete variable(s)")
    },
  })

  // Helper functions
  const getProspectVariables = React.useCallback(
    (prospect_id) => {
      return queryClient.getQueryData(['variables', user_id, prospect_id]) || []
    },
    [queryClient, user_id]
  )

  const invalidateProspectVariables = React.useCallback(
    (prospect_id) => {
      return queryClient.invalidateQueries(['variables', user_id, prospect_id])
    },
    [queryClient, user_id]
  )

  const invalidateAllVariables = React.useCallback(
    () => {
      queryClient.invalidateQueries(['variables', user_id])
    },
    [queryClient, user_id]
  )

  const addVariableToProspect = React.useCallback(
    (prospect_id, variable_name, variable_value, tags = null) => {
      return createVariableMutation.mutate({
        user_id,
        prospect_id,
        variable_name,
        variable_value,
        tags
      })
    },
    [createVariableMutation, user_id]
  )

  const updateVariableDetails = React.useCallback(
    (variable_id, updates) => {
      return updateVariableMutation.mutate({
        user_id,
        variable_id,
        ...updates
      })
    },
    [updateVariableMutation, user_id]
  )

  const deleteVariables = React.useCallback(
    (variable_ids) => {
      return deleteVariablesMutation.mutate({
        user_id,
        variable_ids: Array.isArray(variable_ids) ? variable_ids : [variable_ids]
      })
    },
    [deleteVariablesMutation, user_id]
  )

  const value = React.useMemo(
    () => ({
      // User ID
      user_id,

      // Mutations
      createVariable: createVariableMutation,
      updateVariable: updateVariableMutation,
      deleteVariable: deleteVariablesMutation,

      // Helper functions
      getProspectVariables,
      invalidateProspectVariables,
      invalidateAllVariables,
      addVariableToProspect,
      updateVariableDetails,
      deleteVariables,

      // Loading states
      isCreatingVariable: createVariableMutation.isPending,
      isUpdatingVariable: updateVariableMutation.isPending,
      isDeletingVariable: deleteVariablesMutation.isPending,
    }),
    [
      user_id,
      createVariableMutation,
      updateVariableMutation,
      deleteVariablesMutation,
      getProspectVariables,
      invalidateProspectVariables,
      invalidateAllVariables,
      addVariableToProspect,
      updateVariableDetails,
      deleteVariables,
    ]
  )

  return (
    <VariableContext.Provider value={value}>
      {children}
    </VariableContext.Provider>
  )
}

export const useVariables = () => {
  const context = React.useContext(VariableContext)
  if (!context) {
    throw new Error("useVariables must be used within a VariableProvider")
  }
  return context
}

// Hook for getting prospect-specific variables with caching
export const useProspectVariables = (prospect_id) => {
  const { user_id } = useVariables()
  return useGetVariables({ userId: user_id, prospect_id })
}

// Hook for getting all user variables
export const useAllVariables = () => {
  const { user_id } = useVariables()
  return useGetVariables({ userId: user_id })
}
