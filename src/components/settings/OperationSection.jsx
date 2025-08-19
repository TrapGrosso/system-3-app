import React from "react"
import OperationSettingsForm from "./OperationSettingsForm"
import { getSchemaDefaults } from "@/utils/operationSettingsSchema"
import { useOperationDefaults } from "@/contexts/OperationDefaultsContext"

/**
 * Wrapper for displaying and saving settings for one operation.
 */
export default function OperationSection({ operation }) {
  const {
    mapByOperation,
    getDefaults,
    updateOperationDefaults,
    isUpdating
  } = useOperationDefaults()

  const serverRecord = mapByOperation[operation]
  const initialValues = serverRecord
    ? { ...getSchemaDefaults(operation), ...serverRecord.default_settings }
    : getSchemaDefaults(operation)

  const handleSave = async (vals) => {
    await updateOperationDefaults(operation, vals)
  }

  const handleReset = (defaults) => {
    // reset form values, just pass defaults back into component
    // Done at OperationSettingsForm level
  }

  return (
    <OperationSettingsForm
      operation={operation}
      initialValues={initialValues}
      onSave={handleSave}
      onReset={handleReset}
      isSaving={isUpdating}
      updatedAt={serverRecord?.updated_at}
    />
  )
}
