import * as React from "react"
import { useState } from "react"
import { Search, Brain } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Label } from "@/components/ui/label"

import { useDeepSearchQueue } from "@/contexts/DeepSearchQueueContext"
import { useAllPrompts } from "@/contexts/PromptContext"
import { useAuth } from "@/contexts/AuthContext"

function DeepSearchQueueDialog({ 
  prospect_ids = [], 
  onSuccess,
  trigger,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [selectedPromptId, setSelectedPromptId] = useState("")
  
  // Get contexts
  const { user } = useAuth()
  const { addProspects, isAddingToQueue } = useDeepSearchQueue()
  const { 
    data: prompts = [], 
    isLoading: isLoadingPrompts, 
    isError: isErrorPrompts, 
    refetch: refetchPrompts 
  } = useAllPrompts()
  
  // Determine if this is controlled or uncontrolled
  const isControlled = controlledOpen !== undefined
  const dialogOpen = isControlled ? controlledOpen : internalOpen
  const setDialogOpen = isControlled ? controlledOnOpenChange : setInternalOpen

  const handleSubmit = () => {
    if (!selectedPromptId || !prospect_ids.length || !user?.id) return
    
    addProspects(prospect_ids, selectedPromptId)
    onSuccess?.()
  }

  const handleOpenChange = (newOpen) => {
    if (setDialogOpen) {
      setDialogOpen(newOpen)
    }
    if (!newOpen) {
      // Reset state when closing
      setSelectedPromptId("")
    }
  }

  const getAgentTypeVariant = (agentType) => {
    switch (agentType?.toLowerCase()) {
      case 'deep_research':
        return 'default'
      default:
        return 'secondary'
    }
  }

  const selectedPrompt = prompts.find(prompt => prompt.id === selectedPromptId)
  const prospectCount = prospect_ids.length

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      
      <DialogContent className="sm:max-w-lg">
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
          {isLoadingPrompts ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : isErrorPrompts ? (
            <div className="space-y-2">
              <p className="text-sm text-destructive">Failed to load prompts</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refetchPrompts()}
              >
                Retry
              </Button>
            </div>
          ) : prompts.length === 0 ? (
            <div className="text-center py-4">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-2">No prompts found</p>
              <p className="text-xs text-muted-foreground">
                Create prompts in the Prompts section to get started
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="prompt-select" className="text-sm font-medium">
                  Select prompt
                </Label>
                <Select value={selectedPromptId} onValueChange={setSelectedPromptId}>
                  <SelectTrigger id="prompt-select">
                    <SelectValue placeholder="Choose a prompt..." />
                  </SelectTrigger>
                  <SelectContent>
                    {prompts.map((prompt) => (
                      <SelectItem key={prompt.id} value={prompt.id}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex flex-col items-start">
                            <span className="truncate font-medium">{prompt.name}</span>
                            {prompt.description && (
                              <span className="text-xs text-muted-foreground truncate">
                                {prompt.description}
                              </span>
                            )}
                          </div>
                          {prompt.agent_type && (
                            <Badge 
                              variant={getAgentTypeVariant(prompt.agent_type)} 
                              className="ml-2 text-xs"
                            >
                              {prompt.agent_type}
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedPrompt && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    {selectedPrompt.description && (
                      <p>{selectedPrompt.description}</p>
                    )}
                    {selectedPrompt.tags && selectedPrompt.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {selectedPrompt.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
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
              disabled={!selectedPromptId || !prospect_ids.length || isAddingToQueue || prompts.length === 0}
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
