import * as React from "react"
import { useState, useEffect } from "react"
import { Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import DialogWrapper from "@/components/shared/dialog/DialogWrapper"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"
import FormField from "@/components/shared/ui/FormField"
import CheckboxMatrix from "@/components/shared/dialog/CheckboxMatrix"
import { SingleSelect } from "@/components/shared/filter/SingleSelect"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import { useDeepSearchQueue } from "@/contexts/DeepSearchQueueContext"
import { useUserSettings } from "@/contexts/UserSettingsContext"

// Precision options
const PRECISION_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "default", label: "Default" },
  { value: "high", label: "High" },
]

// Placeholder flags for future use
const FLAG_OPTIONS = [
  { value: 'reduce_search_tokens', label: 'Reduce search token usage' },
  { value: 'cache_linkedin_scrape', label: 'Cache linkedin scrape' }
]

function ResolveDeepSearchItem({
  open,
  onOpenChange,
  queueIds = [],
  onSuccess,
  trigger,
  children
}) {
  const [precision, setPrecision] = useState("default")
  const [maxSearches, setMaxSearches] = useState("3")
  const [maxScrapes, setMaxScrapes] = useState("3")
  const [selectedFlags, setSelectedFlags] = useState([])

  // Get deep search queue context
  const { resolveProspects, isResolvingQueue } = useDeepSearchQueue()
  const { getSetting, isLoading: isSettingsLoading } = useUserSettings()

  const handleSubmit = async () => {
    if (!queueIds.length) return

    const maxSearchesNum = Number(maxSearches) || 3
    const maxScrapesNum = Number(maxScrapes) || 3

    // Validate numeric inputs
    if (maxSearchesNum <= 0 || maxScrapesNum <= 0) return

    const options = {
      agent_precision: precision,
      max_searches: maxSearchesNum,
      max_scrapes: maxScrapesNum,
      flags: selectedFlags
    }

    try {
      await resolveProspects(queueIds, options)
      handleClose()
      onSuccess?.()
    } catch (error) {
      // Error handling is done in the context layer via toast
      console.error('Failed to resolve prospects:', error)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  // Reset state when dialog closes or set defaults when dialog opens
  useEffect(() => {
    if (open) {
      // Set defaults when dialog opens
      const d = getSetting("resolve_deep_search_queue") || {}
      setPrecision(d.agent_precision ?? "default")
      setMaxSearches(String(d.max_searches ?? 3))
      setMaxScrapes(String(d.max_scrapes ?? 3))
      setSelectedFlags(Array.isArray(d.flags) ? d.flags : [])
    }
  }, [open, getSetting])

  // Validation
  const maxSearchesNum = Number(maxSearches) || 0
  const maxScrapesNum = Number(maxScrapes) || 0
  const isFormValid = queueIds.length > 0 && 
                     maxSearchesNum > 0 && 
                     maxScrapesNum > 0 &&
                     Number.isInteger(maxSearchesNum) &&
                     Number.isInteger(maxScrapesNum)

  return (
    <DialogWrapper
      open={open}
      onOpenChange={onOpenChange}
      icon={<Settings className="h-5 w-5" />}
      title="Resolve Deep Search Items"
      description={`Configure resolution settings for ${queueIds.length} queue item${queueIds.length !== 1 ? 's' : ''}.`}
      size="md"
    >
      {trigger && <DialogWrapper.Trigger asChild>{trigger}</DialogWrapper.Trigger>}
      {children && <DialogWrapper.Trigger asChild>{children}</DialogWrapper.Trigger>}

      <DialogWrapper.Body className="space-y-6">
        {/* Summary */}
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {queueIds.length} item{queueIds.length !== 1 ? 's' : ''} to resolve
          </Badge>
          <Badge variant="secondary">
            Precision: {precision}
          </Badge>
        </div>

        <Separator />

        {/* Precision Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">
            Precision
          </label>
          <SingleSelect
            value={precision}
            onValueChange={setPrecision}
            options={PRECISION_OPTIONS}
            placeholder="Select precision"
            triggerClassName="h-9 min-w-[180px]"
          />
        </div>

        {/* Max Searches */}
        <FormField
          id="max-searches"
          label="Max searches"
          type="number"
          value={maxSearches}
          onChange={setMaxSearches}
          placeholder="3"
          helper="Maximum number of searches per item"
          disabled={isResolvingQueue}
          required
        />

        {/* Max Scrapes */}
        <FormField
          id="max-scrapes"
          label="Max scrapes"
          type="number"
          value={maxScrapes}
          onChange={setMaxScrapes}
          placeholder="3"
          helper="Maximum number of scrapes per item"
          disabled={isResolvingQueue}
          required
        />

        {/* Flags (placeholder for future) */}
        <CheckboxMatrix
          label="Flags (coming soon)"
          options={FLAG_OPTIONS}
          value={selectedFlags}
          onChange={setSelectedFlags}
          disabled={!isFormValid || isResolvingQueue}
        />
      </DialogWrapper.Body>

      <DialogWrapper.Footer className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          onClick={handleClose}
          disabled={isResolvingQueue}
        >
          Cancel
        </Button>
        <SpinnerButton
          loading={isResolvingQueue}
          onClick={handleSubmit}
          disabled={!isFormValid || isResolvingQueue || isSettingsLoading}
        >
          Resolve Items
        </SpinnerButton>
      </DialogWrapper.Footer>
    </DialogWrapper>
  )
}

export default ResolveDeepSearchItem
