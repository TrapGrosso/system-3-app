import React, { useMemo, useCallback, useContext } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from './AuthContext'
import { useGetUserSettings } from '@/api/user-settings-context/getUserSettings'
import { useUpdateUserSettings } from '@/api/user-settings-context/updateUserSettings'

const ALIAS_TO_COLUMN = {
  add_leads: 'add_leads_default_options',
  create_variables_with_ai: 'create_variables_with_ai_default_options',
  find_emails_clearout: 'find_emails_clearout_default_options',
  resolve_deep_search_queue: 'resolve_deep_search_queue_default_options',
  search_company_with_ai: 'search_company_with_ai_default_options',
  verify_emails_clearout: 'verify_emails_clearout_default_options',
}

const resolveFullKey = (key) => ALIAS_TO_COLUMN[key] ?? key

const UserSettingsContext = React.createContext(null)

export const UserSettingsProvider = ({ children }) => {
  const { user } = useAuth()
  const user_id = user?.id
  const queryClient = useQueryClient()

  const allSettingsQuery = useGetUserSettings(user_id, undefined)
  const allSettings = useMemo(() => allSettingsQuery.data || {}, [allSettingsQuery.data])

  const updateSettingsMutation = useUpdateUserSettings({
    onSuccess: (data) => {
      const message = data?.message || 'Settings updated successfully'
      toast.success(message)
      // Hydrate cache if full settings returned
      const next = data?.data?.settings
      if (next) {
        queryClient.setQueryData(['getUserSettings', user_id, undefined], next)
      }
      queryClient.invalidateQueries({ queryKey: ['getUserSettings', user_id] })
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to update settings')
    },
  })

  const getAllSettings = useCallback(() => {
    // cache-only accessor
    return queryClient.getQueryData(['getUserSettings', user_id, undefined]) || allSettings || {}
  }, [queryClient, user_id, allSettings])

  const getSetting = useCallback((key) => {
    if (!key) return undefined
    // Prefer single-setting cache if present
    const single = queryClient.getQueryData(['getUserSettings', user_id, key])
    if (typeof single !== 'undefined' && single !== null) return single
    // Fallback to all-settings cache
    const full = queryClient.getQueryData(['getUserSettings', user_id, undefined]) || allSettings || {}
    const fullKey = resolveFullKey(key)
    return full?.[fullKey]
  }, [queryClient, user_id, allSettings])

  const buildUpdatePayload = useCallback((friendlyUpdates = {}) => {
    const payload = { user_id }
    Object.entries(friendlyUpdates).forEach(([k, v]) => {
      const fullOrAlias = resolveFullKey(k)
      // Preserve original key type: prefer alias when supplied, else pass full column
      const isAlias = !!ALIAS_TO_COLUMN[k]
      const updateKey = isAlias ? `updated_${k}` : `updated_${fullOrAlias}`
      payload[updateKey] = v
    })
    return payload
  }, [user_id])

  const updateSettings = useCallback((friendlyUpdates) => {
    return updateSettingsMutation.mutateAsync(buildUpdatePayload(friendlyUpdates))
  }, [updateSettingsMutation, buildUpdatePayload])

  const invalidateUserSettings = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['getUserSettings', user_id] })
  }, [queryClient, user_id])

  const value = useMemo(() => ({
    // Data
    user_id,
    allSettings,
    isLoading: allSettingsQuery.isLoading,
    isFetching: allSettingsQuery.isFetching,
    isError: allSettingsQuery.isError,
    error: allSettingsQuery.error,
    refetch: allSettingsQuery.refetch,

    // Helpers
    getAllSettings,
    getSetting,
    invalidateUserSettings,

    // Mutations
    updateSettings,
    updateSettingsMutation,

    // Loading flags
    isUpdatingSettings: updateSettingsMutation.isPending,
  }), [
    user_id,
    allSettings,
    allSettingsQuery.isLoading,
    allSettingsQuery.isFetching,
    allSettingsQuery.isError,
    allSettingsQuery.error,
    allSettingsQuery.refetch,
    getAllSettings,
    getSetting,
    invalidateUserSettings,
    updateSettings,
    updateSettingsMutation
  ])

  return (
    <UserSettingsContext.Provider value={value}>
      {children}
    </UserSettingsContext.Provider>
  )
}

export const useUserSettings = () => {
  const ctx = React.useContext(UserSettingsContext)
  if (!ctx) throw new Error('useUserSettings must be used within a UserSettingsProvider')
  return ctx
}

// Convenience hooks
export const useAllUserSettings = () => {
  const { user_id } = useUserSettings()
  return useGetUserSettings(user_id, undefined)
}

export const useUserSetting = (settingKey) => {
  const { user_id } = useUserSettings()
  return useGetUserSettings(user_id, settingKey)
}
