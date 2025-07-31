import * as React from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import DialogWrapper from "@/components/shared/dialog/DialogWrapper"
import PromptMultiSelect from "@/components/shared/dialog/PromptMultiSelect"
import { useDeepSearchQueue } from "@/contexts/DeepSearchQueueContext"

export function PromptSelectDialog({ 
  open, 
  onOpenChange, 
  queueItemIds = [],
  selectedCount,
  isUpdating: externalIsUpdating = false
}) {
  const [selectedPromptIds, setSelectedPromptIds] = React.useState([])
  
  const { 
    queueItems,
    updateProspects,
    isUpdatingQueue
  } = useDeepSearchQueue()

  const isUpdating = externalIsUpdating || isUpdatingQueue

  React.useEffect(() => {
    if (open) {
      setSelectedPromptIds([])
    }
  }, [open])

  const handleConfirm = async () => {
    if (selectedPromptIds.length > 0 && queueItemIds.length > 0) {
      try {
        // Get prospect IDs from the selected queue items
        const prospectIds = queueItemIds.map(queueItemId => {
          const queueItem = queueItems.find(item => item.id === queueItemId)
          return queueItem?.prospect_id || queueItem?.prospect?.linkedin_id
        }).filter(Boolean)
        
        if (prospectIds.length > 0) {
          await updateProspects(prospectIds, selectedPromptIds)
          onOpenChange(false)
          setSelectedPromptIds([])
        }
      } catch (error) {
        toast.error("Failed to update prompt")
      }
    }
  }

  const handleCancel = () => {
    setSelectedPromptIds([])
    onOpenChange(false)
  }

  const actualSelectedCount = selectedCount || queueItemIds.length

  return (
    <DialogWrapper
      open={open}
      onOpenChange={onOpenChange}
      title="Change Prompt"
      description={
        actualSelectedCount > 1 
          ? `Select new prompts for ${actualSelectedCount} queue items`
          : "Select new prompts for this queue item"
      }
      size="md"
    >
      <DialogWrapper.Body>
        <PromptMultiSelect
          type="deep_research"
          value={selectedPromptIds}
          onChange={setSelectedPromptIds}
          disabled={isUpdating}
          label="Prompts"
        />
      </DialogWrapper.Body>

      <DialogWrapper.Footer>
        <Button 
          variant="outline" 
          onClick={handleCancel}
          disabled={isUpdating}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleConfirm}
          disabled={!selectedPromptIds.length || isUpdating || !queueItemIds.length}
        >
          {isUpdating ? "Updating..." : "Update Prompt"}
        </Button>
      </DialogWrapper.Footer>
    </DialogWrapper>
  )
}
