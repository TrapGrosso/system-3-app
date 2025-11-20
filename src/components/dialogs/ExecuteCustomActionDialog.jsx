import * as React from "react"
import { useState } from "react"
import { Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import DialogWrapper from "@/components/shared/dialog/DialogWrapper"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"
import { DynamicSettingsForm } from "@/components/ui/dynamic-settings-form"
import { useAuth } from "@/contexts/AuthContext"
import { useExecuteCustomAction } from "@/api/custom-actions/post/execute"
import { toast } from "sonner"

/**
 * Dialog for executing custom actions on prospects with optional configuration
 * 
 * @param {Object} props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onOpenChange - Callback when dialog open state changes
 * @param {Object} props.action - Custom action object with id, name, description, warning_message, options
 * @param {string} props.mode - Execution mode: 'single' or 'bulk'
 * @param {string[]} props.prospectIds - Array of prospect LinkedIn IDs to process
 * @param {Function} [props.onSuccess] - Optional callback when execution succeeds
 */
function ExecuteCustomActionDialog({
  open,
  onOpenChange,
  action,
  mode,
  prospectIds = [],
  onSuccess,
}) {
  const { user } = useAuth()
  const userId = user?.id

  // Normalize action.options to a DynamicSettingsForm schema
  const normalizedSchema = React.useMemo(() => {
    if (!action?.options) return null
    
    // If options is already a schema with sections, use it
    if (action.options.sections && Array.isArray(action.options.sections)) {
      return action.options
    }
    
    // Otherwise return null (no options form)
    return null
  }, [action?.options])

  const [schema, setSchema] = useState(normalizedSchema)
  const [values, setValues] = useState({})

  // Reset schema and values when action changes
  React.useEffect(() => {
    setSchema(normalizedSchema)
    setValues({})
  }, [normalizedSchema, action?.id])

  const { mutate, isPending } = useExecuteCustomAction({
    onSuccess: (res) => {
      toast.success(res?.message || 'Custom action executed successfully')
      onSuccess?.(res)
      onOpenChange(false)
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to execute custom action')
      // Keep dialog open so user can retry
    },
  })

  // Compute description text with priority: warning_message > description > fallback
  const computedDescription = React.useMemo(() => {
    const count = prospectIds?.length ?? 0
    const baseFallback = count
      ? `This will process ${count} prospect${count === 1 ? '' : 's'}.`
      : 'This will process selected prospects.'

    return (
      action?.warning_message?.trim() ||
      action?.description?.trim() ||
      baseFallback
    )
  }, [action, prospectIds])

  const handleConfirm = () => {
    if (!userId) {
      toast.error('User is not authenticated')
      return
    }
    
    if (!prospectIds || prospectIds.length === 0) {
      toast.error('No prospects selected')
      return
    }

    const payload = {
      user_id: userId,
      prospectIds,
      options: values || {},
    }

    mutate({ action_id: action.id, payload })
  }

  const hasOptions = schema && schema.sections && schema.sections.length > 0

  return (
    <DialogWrapper
      open={open}
      onOpenChange={onOpenChange}
      icon={<Play className="h-5 w-5" />}
      title={`Execute "${action?.name ?? 'Custom Action'}"`}
      description={computedDescription}
      size="lg"
    >
      {hasOptions && (
        <DialogWrapper.Body>
          <DynamicSettingsForm
            schema={schema}
            onSchemaChange={setSchema}
            onValuesChange={setValues}
            showSubmit={false}
            trackDirty={false}
            title="Options"
            description={null}
            isLoading={false}
            isSaving={isPending}
          />
        </DialogWrapper.Body>
      )}

      <DialogWrapper.Footer className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isPending}
        >
          Cancel
        </Button>
        <SpinnerButton
          loading={isPending}
          onClick={handleConfirm}
          disabled={isPending || !userId}
        >
          Execute
        </SpinnerButton>
      </DialogWrapper.Footer>
    </DialogWrapper>
  )
}

export default ExecuteCustomActionDialog
