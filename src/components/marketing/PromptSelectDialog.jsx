import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { ChevronsUpDown, X } from "lucide-react"

export function PromptSelectDialog({ 
  open, 
  onOpenChange, 
  prompts = [],
  isLoadingPrompts = false,
  isUpdating = false,
  selectedCount = 0,
  onConfirm,
  onCancel
}) {
  const [selectedPromptIds, setSelectedPromptIds] = React.useState([])
  const [popoverOpen, setPopoverOpen] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      setSelectedPromptIds([])
    }
  }, [open])

  const handleConfirm = () => {
    if (selectedPromptIds.length > 0 && onConfirm) {
      onConfirm(selectedPromptIds)
    }
  }

  const handleCancel = () => {
    setSelectedPromptIds([])
    if (onCancel) {
      onCancel()
    } else {
      onOpenChange(false)
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

  const getSelectionText = () => {
    if (selectedPromptIds.length === 0) return "Choose prompts..."
    if (selectedPromptIds.length === 1) return "1 prompt selected"
    return `${selectedPromptIds.length} prompts selected`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Change Prompt</DialogTitle>
          <DialogDescription>
            {selectedCount > 1 
              ? `Select new prompts for ${selectedCount} queue items`
              : "Select new prompts for this queue item"
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="prompt-select">Prompts</Label>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={popoverOpen}
                  className="w-full justify-between"
                  disabled={isLoadingPrompts || isUpdating}
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

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!selectedPromptIds.length || isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Prompt"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
