import * as React from "react"
import { useState } from "react"
import { Brain } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

import { useDeepSearchQueue } from "@/contexts/DeepSearchQueueContext"
import { useAuth } from "@/contexts/AuthContext"
import PromptMultiSelect from "@/components/shared/dialog/PromptMultiSelect"

function DeepSearchQueueDialog({ 
  prospect_ids = [], 
  onSuccess,
  trigger,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [selectedPromptIds, setSelectedPromptIds] = useState([])
  
  // Get contexts
  const { user } = useAuth()
  const { addProspects, isAddingToQueue } = useDeepSearchQueue()
  
  // Determine if this is controlled or uncontrolled
  const isControlled = controlledOpen !== undefined
  const dialogOpen = isControlled ? controlledOpen : internalOpen
  const setDialogOpen = isControlled ? controlledOnOpenChange : setInternalOpen

  const handleSubmit = () => {
    if (!selectedPromptIds.length || !prospect_ids.length || !user?.id) return
    
    addProspects(prospect_ids, selectedPromptIds)
    setSelectedPromptIds([])
    onSuccess?.()
  }

  const handleOpenChange = (newOpen) => {
    if (setDialogOpen) {
      setDialogOpen(newOpen)
    }
    if (!newOpen) {
      // Reset state when closing
      setSelectedPromptIds([])
    }
  }

  const prospectCount = prospect_ids.length

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      
      <DialogContent className="flex flex-col gap-5 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Add to Deep Search Queue
          </DialogTitle>
          <DialogDescription>
            {prospectCount > 0 
              ? `Add ${prospectCount} prospect${prospectCount !== 1 ? 's' : ''} to the deep search queue with a selected prompt.`
              : 'Select a prompt to add prospects to the deep search queue.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <PromptMultiSelect
          type="deep_research"
            value={selectedPromptIds}
            onChange={setSelectedPromptIds}
            disabled={isAddingToQueue}
            label="Select prompts"
          />
        </div>

        <DialogFooter className="flex flex-col gap-3">
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button 
              variant="outline" 
              onClick={() => handleOpenChange(false)}
              disabled={isAddingToQueue}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!selectedPromptIds.length || !prospect_ids.length || isAddingToQueue}
            >
              {isAddingToQueue && <Spinner size="sm" className="mr-2" />}
              Add to Queue
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeepSearchQueueDialog
