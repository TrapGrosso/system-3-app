import * as React from "react"
import { useState } from "react"
import { Send } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

import { useGroups } from "@/contexts/GroupsContext"
import { Badge } from "../ui/badge"
import PromptMultiSelect from "@/components/shared/dialog/PromptMultiSelect"
import DialogWrapper from "@/components/shared/dialog/DialogWrapper"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"
import GroupSingleSelect from "@/components/shared/dialog/GroupSingleSelect"

// Multi-select options for lead processing
const MULTI_OPTIONS = [
  { value: "send_notification", label: "Send email notification when finished" },
  { value: "find_emails", label: "find emails" },
  { value: "ignore_prospect_company", label: "Ignore prospect's company" },
  { value: "ignore_all_companies", label: "Ignore all companies" },
  { value: "add_to_ds_queue", label: "Add prospects to deep search queue" },
  { value: "ignore_other_companies", label: "Ignore provided companies" },
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
  
  // Get groups context
  const {
    groups,
    isLoadingGroups,
    isErrorGroups,
    refetchGroups,
    getGroupById,
  } = useGroups()

  const handleSubmit = () => {
    const selectedGroup = getGroupById(selectedGroupId)
    const options = {
      add_to_group: !!selectedGroupId,
      ...(selectedGroupId && { group: selectedGroup }),
      flags: selectedOptions,
      ...(selectedOptions.includes('add_to_ds_queue') && {
        prompt_ids: selectedPromptIds
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
    }
  }

  const handleOptionToggle = (optionValue) => {
    setSelectedOptions(prev => 
      prev.includes(optionValue) 
        ? prev.filter(val => val !== optionValue)
        : [...prev, optionValue]
    )
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
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Processing options
          </Label>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
            {MULTI_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox
                  checked={selectedOptions.includes(option.value)}
                  onCheckedChange={() => handleOptionToggle(option.value)}
                  disabled={isPending}
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

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
            (selectedOptions.includes('add_to_ds_queue') && selectedPromptIds.length === 0)
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
