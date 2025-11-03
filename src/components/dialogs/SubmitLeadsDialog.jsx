import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

import { useGroups } from "@/contexts/GroupsContext"
import { useUserSettings } from "@/contexts/UserSettingsContext"
import { Badge } from "../ui/badge"
import PromptMultiSelect from "@/components/shared/dialog/PromptMultiSelect"
import DialogWrapper from "@/components/shared/dialog/DialogWrapper"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"
import GroupSingleSelect from "@/components/shared/dialog/GroupSingleSelect"
import CheckboxMatrix from "@/components/shared/dialog/CheckboxMatrix"
import { StatusSelect } from "@/components/ui/StatusSelect"

// Multi-select options for lead processing
const MULTI_OPTIONS = [
  { value: "send_notification", label: "Send email notification when finished" },
  { value: "find_emails", label: "find emails" },
  { value: "ignore_all_companies", label: "Ignore all companies" },
  { value: "add_to_ds_queue", label: "Add prospects to deep search queue" },
  { value: "ignore_other_companies", label: "Ignore linkedin company urls provided" },
  { value: "output_prospect_with_companies", label: "Output only prospects with their company" },
  { value: "search_companies_with_ai", label: "Search prospects's companies with AI if company wasn't found" },
  { value: "update_status", label: "Update status on completion" },
]

function SubmitLeadsDialog({ 
  open,
  onOpenChange,
  urls = [],
  onConfirm,
  isPending = false,
  trigger,
  children
}) {
  const [selectedGroupId, setSelectedGroupId] = useState("")
  const [selectedOptions, setSelectedOptions] = useState([])
  const [selectedPromptIds, setSelectedPromptIds] = useState([])
  const [selectedStatusId, setSelectedStatusId] = useState(null)
  const didInitRef = useRef(false)

  // Get groups context
  const { getGroupById } = useGroups()

  // Get operation defaults for "add_leads"
  const { getSetting, isLoading: isSettingsLoading } = useUserSettings()
  const defaults = getSetting("add_leads")
  const isLoadingDefaults = isSettingsLoading && !defaults

  useEffect(() => {
    if (open && !didInitRef.current && !isLoadingDefaults && defaults) {
      setSelectedOptions(defaults.flags || [])
      setSelectedPromptIds(defaults.prompt_ids || [])
      if (defaults.add_to_group && defaults.group?.id) {
        setSelectedGroupId(defaults.group.id)
      } else {
        setSelectedGroupId("")
      }
      // Preload status_id if update_status flag is enabled
      if (defaults.flags?.includes("update_status") && defaults.status_id) {
        setSelectedStatusId(defaults.status_id)
      } else {
        setSelectedStatusId(null)
      }
      didInitRef.current = true
    }
  }, [open, defaults, isLoadingDefaults])

  const handleSubmit = () => {
    const selectedGroup = getGroupById(selectedGroupId)
    const options = {
      add_to_group: !!selectedGroupId,
      ...(selectedGroupId && { group: selectedGroup }),
      flags: selectedOptions,
      ...(selectedOptions.includes('add_to_ds_queue') && {
        prompt_ids: selectedPromptIds
      }),
      ...(selectedOptions.includes('update_status') && selectedStatusId && {
        status_id: selectedStatusId
      })
    }
    
    onConfirm({ urls, options })
  }

  const handleOpenChange = (newOpen) => {
    if (onOpenChange) {
      onOpenChange(newOpen)
    }
    if (!newOpen) {
      // Reset state when closing
      setSelectedGroupId("")
      setSelectedOptions([])
      setSelectedPromptIds([])
      setSelectedStatusId(null)
      didInitRef.current = false // Reset ref for next open
    }
  }


  const selectedGroup = getGroupById(selectedGroupId)
  const urlCount = urls.length

  return (
    <DialogWrapper
      open={open}
      onOpenChange={handleOpenChange}
      icon={<Send className="h-5 w-5" />}
      title="Submit Leads"
      description={`Configure submission options for ${urlCount} lead${urlCount !== 1 ? 's' : ''}.`}
      size="lg"
    >
      {trigger && <DialogWrapper.Trigger asChild>{trigger}</DialogWrapper.Trigger>}
      {children && <DialogWrapper.Trigger asChild>{children}</DialogWrapper.Trigger>}

      <DialogWrapper.Body className="space-y-6">
        {/* Group Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Add to group (optional)
          </Label>
          <GroupSingleSelect
            value={selectedGroupId}
            onChange={setSelectedGroupId}
            onCreateFirstGroupClick={() => { /* TODO: open create-group flow */ }}
          />
          {selectedGroup && (
            <p className="text-xs text-muted-foreground">
              {selectedGroup.description}
            </p>
          )}
        </div>

        <Separator />

        {/* Processing Options */}
        <CheckboxMatrix
          label="Processing options"
          options={MULTI_OPTIONS}
          value={selectedOptions}
          onChange={setSelectedOptions}
          disabled={isPending}
        />

        {/* Update Status Selection */}
        {selectedOptions.includes('update_status') && (
          <>
            <Separator />
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Status to set on completion
              </Label>
              <StatusSelect
                selectedId={selectedStatusId}
                onChange={(status) => setSelectedStatusId(status?.id ?? null)}
                placeholder="Select status to set on completion"
                disabled={isPending}
              />
            </div>
          </>
        )}

        {/* Deep Search Queue Prompts */}
        {selectedOptions.includes('add_to_ds_queue') && (
          <>
            <Separator />
            <PromptMultiSelect
              type="deep_research"
              value={selectedPromptIds}
              onChange={setSelectedPromptIds}
              disabled={isPending}
              label="Select prompts for deep search queue"
            />
          </>
        )}

        <Separator />

        {/* Summary */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {urlCount} URL{urlCount !== 1 ? 's' : ''} ready to submit
            </Badge>
            {selectedOptions.length > 0 && (
              <Badge variant="secondary">
                {selectedOptions.length} option{selectedOptions.length !== 1 ? 's' : ''} selected
              </Badge>
            )}
          </div>
          {selectedGroupId && (
            <p className="text-xs text-muted-foreground">
              Will be added to group: <span className="font-medium">{selectedGroup?.name}</span>
            </p>
          )}
        </div>
      </DialogWrapper.Body>

      <DialogWrapper.Footer className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          onClick={() => handleOpenChange(false)}
          disabled={isPending}
        >
          Cancel
        </Button>
        <SpinnerButton
          loading={isPending}
          onClick={handleSubmit}
          disabled={
            urlCount === 0 ||
            isPending ||
            (selectedOptions.includes('add_to_ds_queue') && selectedPromptIds.length === 0) ||
            (selectedOptions.includes('update_status') && !selectedStatusId)
          }
        >
          <Send className="h-4 w-4 mr-2" />
          Submit Leads
        </SpinnerButton>
      </DialogWrapper.Footer>
    </DialogWrapper>
  )
}

export default SubmitLeadsDialog
