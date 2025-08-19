import React from "react"
import OperationSettingsForm from "./OperationSettingsForm"
import { getSchemaDefaults } from "@/components/settings/operationSettingsSchema.js"
import { useOperationDefaults } from "@/contexts/OperationDefaultsContext"

/**
 * Wrapper for displaying and saving settings for one operation.
 */
export default function OperationSection({ operation }) {
  const {
    mapByOperation,
    getDefaults,
    updateOperationDefaults,
    isUpdating,
    isLoading
  } = useOperationDefaults()

  const serverRecord = mapByOperation[operation]
  const initialValues = serverRecord
    ? { ...getSchemaDefaults(operation), ...serverRecord.default_settings }
    : getSchemaDefaults(operation)

  const handleSave = async (vals) => {
    await updateOperationDefaults(operation, vals)
  }

  return (
    <OperationSettingsForm
      operation={operation}
      initialValues={initialValues}
      isLoadingDefaults={isLoading}
      onSave={handleSave}
      isSaving={isUpdating}
      updatedAt={serverRecord?.updated_at}
    />
  )
}
