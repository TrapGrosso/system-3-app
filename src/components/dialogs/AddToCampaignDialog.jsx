import * as React from "react"

import DialogWrapper from "@/components/shared/dialog/DialogWrapper"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"
import CampaignSingleSelect from "@/components/shared/dialog/CampaignSingleSelect"
import { useCampaigns } from "@/contexts/CampaignsContext"

/**
 * AddToCampaignDialog
 *
 * Props:
 * - prospect_ids: string[] (required) - list of prospect identifiers to add
 * - onSuccess?: (data) => void - called with API response on success
 * - trigger?: React.ReactNode - optional trigger element
 * - children?: React.ReactNode - alternative trigger (if provided, used as trigger)
 * - open?: boolean - controlled open state
 * - onOpenChange?: (open: boolean) => void - controlled state change handler
 */
function AddToCampaignDialog({
  prospect_ids = [],
  onSuccess,
  trigger,
  children,
  open,
  onOpenChange,
}) {
  const [selectedCampaignId, setSelectedCampaignId] = React.useState("")

  const {
    addProspectsToCampaign,
    campaigns = [],
    isAddingToCampaign,
  } = useCampaigns()

  const handleSubmit = async () => {
    if (!selectedCampaignId || prospect_ids.length === 0) return

    try {
      const data = await addProspectsToCampaign(selectedCampaignId, prospect_ids)
      // Reset selection and close
      setSelectedCampaignId("")
      onOpenChange?.(false)
      onSuccess?.(data)
    } catch (error) {
      // Errors are handled by the context via toast
    }
  }

  const handleOpenChange = (newOpen) => {
    onOpenChange?.(newOpen)
    if (!newOpen) {
      // Reset internal state on close
      setSelectedCampaignId("")
    }
  }

  const canSubmit =
    !!selectedCampaignId &&
    !isAddingToCampaign &&
    campaigns.length > 0 &&
    prospect_ids.length > 0

  const leadsCount = prospect_ids.length
  const description =
    leadsCount > 0
      ? `Add ${leadsCount} lead${leadsCount !== 1 ? "s" : ""} to a campaign.`
      : "Select a campaign to add leads."

  return (
    <DialogWrapper
      open={open}
      onOpenChange={handleOpenChange}
      title="Add to Campaign"
      description={description}
      size="md"
    >
      {(trigger || children) && (
        <DialogWrapper.Trigger asChild>
          {trigger || children}
        </DialogWrapper.Trigger>
      )}

      <DialogWrapper.Body>
        <CampaignSingleSelect
          value={selectedCampaignId}
          onChange={setSelectedCampaignId}
        />
      </DialogWrapper.Body>

      <DialogWrapper.Footer>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <SpinnerButton
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isAddingToCampaign}
          >
            Cancel
          </SpinnerButton>
          <SpinnerButton
            onClick={handleSubmit}
            disabled={!canSubmit}
            loading={isAddingToCampaign}
          >
            Add to Campaign
          </SpinnerButton>
        </div>
      </DialogWrapper.Footer>
    </DialogWrapper>
  )
}

export default AddToCampaignDialog
