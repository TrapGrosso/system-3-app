import * as React from "react"
import { useState } from "react"
import { Brain } from "lucide-react"

import { Button } from "@/components/ui/button"
import DialogWrapper from "@/components/shared/dialog/DialogWrapper"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"

import { useDeepSearchQueue } from "@/contexts/DeepSearchQueueContext"
import { useAuth } from "@/contexts/AuthContext"
import PromptMultiSelect from "@/components/shared/dialog/PromptMultiSelect"

function DeepSearchQueueDialog({ 
  prospect_ids = [], 
  onSuccess,
  open, // Now directly controlled
  onOpenChange // Now directly controlled
}) {
  const [selectedPromptIds, setSelectedPromptIds] = useState([])
  
  // Get contexts
  const { user } = useAuth()
  const { addProspects, isAddingToQueue } = useDeepSearchQueue()
  
  const handleSubmit = async () => {
    if (!selectedPromptIds.length || !prospect_ids.length || !user?.id) return
    
    await addProspects(prospect_ids, selectedPromptIds)
    setSelectedPromptIds([])
    onSuccess?.()
  }

  const handleOpenChange = (newOpen) => {
    onOpenChange(newOpen)
    if (!newOpen) {
      // Reset state when closing
      setSelectedPromptIds([])
    }
  }

  const prospectCount = prospect_ids.length

  return (
    <DialogWrapper
      open={open}
      onOpenChange={handleOpenChange}
      icon={<Brain className="h-5 w-5" />}
      title="Add to Deep Search Queue"
      description={
        prospectCount > 0 
          ? `Add ${prospectCount} prospect${prospectCount !== 1 ? 's' : ''} to the deep search queue with a selected prompt.`
          : 'Select a prompt to add prospects to the deep search queue.'
      }
      size="md" // Default size, can be adjusted
    >
      <DialogWrapper.Body className="space-y-4">
        <PromptMultiSelect
          type="deep_research"
          value={selectedPromptIds}
          onChange={setSelectedPromptIds}
          disabled={isAddingToQueue}
          label="Select prompts"
        />
      </DialogWrapper.Body>

      <DialogWrapper.Footer>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button 
            variant="outline" 
            onClick={() => handleOpenChange(false)}
            disabled={isAddingToQueue}
          >
            Cancel
          </Button>
          <SpinnerButton 
            onClick={handleSubmit} 
            loading={isAddingToQueue}
            disabled={!selectedPromptIds.length || !prospect_ids.length}
          >
            Add to Queue
          </SpinnerButton>
        </div>
      </DialogWrapper.Footer>
    </DialogWrapper>
  )
}

export default DeepSearchQueueDialog
