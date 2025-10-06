import * as React from "react"
import { useState } from "react"
import { Search, Check, ChevronsUpDown, X } from "lucide-react"

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
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"

import { useAllPrompts } from "@/contexts/PromptContext"
import { useDialogs } from "@/contexts/DialogsContext"

function PromptMultiSelect({ 
  value = [], 
  onChange, 
  type = 'all',
  disabled = false,
  label = "Select prompts",
  triggerClassName
}) {
  const [popoverOpen, setPopoverOpen] = useState(false)
  
  const { 
    data: prompts = [], 
    isLoading: isLoadingPrompts, 
    isError: isErrorPrompts, 
    refetch: refetchPrompts 
  } = useAllPrompts(type)
  
  const dialogs = useDialogs()

  const handlePromptToggle = (promptId) => {
    const newValue = value.includes(promptId) 
      ? value.filter(id => id !== promptId)
      : [...value, promptId]
    onChange?.(newValue)
  }

  const handleClearSelection = () => {
    onChange?.([])
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

  const selectedPrompts = prompts.filter(prompt => value.includes(prompt.id))

  const getSelectionText = () => {
    if (value.length === 0) return "Choose prompts..."
    if (value.length === 1) return "1 prompt selected"
    return `${value.length} prompts selected`
  }

  if (isLoadingPrompts) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (isErrorPrompts) {
    return (
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
    )
  }

  if (prompts.length === 0) {
    return (
      <div className="text-center py-4">
        <Search className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground mb-2">No prompts found</p>
        <SpinnerButton 
          variant="outline" 
          size="sm" 
          onClick={() => dialogs.openCreatePrompt()}
        >
          Create your first prompt
        </SpinnerButton>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {label}
        </Label>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={popoverOpen}
              className={`w-full sm:w-[260px] justify-between ${triggerClassName}`}
              disabled={disabled}
            >
              {getSelectionText()}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent sizeMode="fit" className="p-0 max-h-72 overflow-y-auto" align="start">
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
                          checked={value.includes(prompt.id)}
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
              {value.length > 0 && (
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
  )
}

export default PromptMultiSelect
