import * as React from "react"
import { useState } from "react"
import { Search, Brain, Check, ChevronsUpDown, X } from "lucide-react"

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

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
  const [selectedPromptIds, setSelectedPromptIds] = useState([])
  const [popoverOpen, setPopoverOpen] = useState(false)
  
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
      setPopoverOpen(false)
    }
  }

  const handlePromptToggle = (promptId) => {
    setSelectedPromptIds(prev => 
      prev.includes(promptId) 
        ? prev.filter(id => id !== promptId)
        : [...prev, promptId]
    )
  }

  const handleClearSelection = () => {
    setSelectedPromptIds([])
  }

  const getAgentTypeVariant = (agentType) => {
    switch (agentType?.toLowerCase()) {
      case 'deep_research':
        return 'default'
      default:
        return 'secondary'
    }
  }

  const truncateString = (string, end = 40) => {
    if (string.split('').length < end) return string
    return string.split('').splice(0, end).concat(['...'])
  }

  const selectedPrompts = prompts.filter(prompt => selectedPromptIds.includes(prompt.id))
  const prospectCount = prospect_ids.length

  const getSelectionText = () => {
    if (selectedPromptIds.length === 0) return "Choose prompts..."
    if (selectedPromptIds.length === 1) return "1 prompt selected"
    return `${selectedPromptIds.length} prompts selected`
  }

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
                <Label className="text-sm font-medium">
                  Select prompts
                </Label>
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={popoverOpen}
                      className="w-full justify-between"
                    >
                      {getSelectionText()}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search prompts..." />
                      <CommandList>
                        <CommandEmpty>No prompts found.</CommandEmpty>
                        <CommandGroup>
                          {prompts.map((prompt) => (
                            <CommandItem
                              key={prompt.id}
                              onSelect={() => handlePromptToggle(prompt.id)}
                            >
                              <div className="flex items-center space-x-2 flex-1">
                                <Checkbox 
                                  checked={selectedPromptIds.includes(prompt.id)}
                                  onChange={() => handlePromptToggle(prompt.id)}
                                />
                                <div className="flex flex-col flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium truncate">
                                      {truncateString(prompt.name, 30)}
                                    </span>
                                    {prompt.agent_type && (
                                      <Badge 
                                        variant={getAgentTypeVariant(prompt.agent_type)} 
                                        className="text-xs"
                                      >
                                        {prompt.agent_type}
                                      </Badge>
                                    )}
                                  </div>
                                  {prompt.description && (
                                    <span className="text-xs text-muted-foreground truncate">
                                      {truncateString(prompt.description, 40)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                      {selectedPromptIds.length > 0 && (
                        <>
                          <Separator />
                          <div className="p-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleClearSelection}
                              className="w-full"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Clear selection
                            </Button>
                          </div>
                        </>
                      )}
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {selectedPrompts.length > 0 && (
                <div className="space-y-3 mt-5">
                  <Label className="text-sm font-medium">Selected prompts preview:</Label>
                  <div className="space-y-3">
                    {selectedPrompts.map((prompt, index) => (
                      <div key={prompt.id} className="text-xs text-muted-foreground space-y-2 p-3 rounded-md border">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{prompt.name}</span>
                          {prompt.agent_type && (
                            <Badge 
                              variant={getAgentTypeVariant(prompt.agent_type)} 
                              className="text-xs"
                            >
                              {prompt.agent_type}
                            </Badge>
                          )}
                        </div>
                        {prompt.description && (
                          <p>{prompt.description}</p>
                        )}
                        {prompt.tags && prompt.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {prompt.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              disabled={!selectedPromptIds.length || !prospect_ids.length || isAddingToQueue || prompts.length === 0}
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
