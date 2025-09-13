import React from "react"
import OperationSettingsForm from "@/components/settings/OperationSettingsForm"
import { getSchemaDefaults } from "@/components/settings/operationSettingsSchema"
import { useUserSettings } from "@/contexts/UserSettingsContext"

const ALIAS = "find_emails_clearout"

export default function FindEmailsClearoutSettings() {
  const {
    getSetting,
    updateSettings,
    isUpdatingSettings,
    isLoading,
    allSettings,
  } = useUserSettings()

  const serverJSON = getSetting(ALIAS) || {}
  const initialValues = {
    ...getSchemaDefaults(ALIAS),
    ...serverJSON,
  }

  const handleSave = async (vals) => {
    await updateSettings({ [ALIAS]: vals })
  }

  return (
    <OperationSettingsForm
      operation={ALIAS}
      initialValues={initialValues}
      isLoadingDefaults={isLoading}
      onSave={handleSave}
      isSaving={isUpdatingSettings}
      updatedAt={allSettings?.updated_at}
    />
  )
}
