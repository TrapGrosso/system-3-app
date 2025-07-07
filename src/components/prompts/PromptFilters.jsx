import * as React from "react"
import { useState } from "react"
import { Search, Filter, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Checkbox } from "@/components/ui/checkbox"

import { useAllTags } from "@/hooks/use-filtered-prompts"
import { AGENT_TYPES } from "@/contexts/PromptContext"

function PromptFilters({
  prompts = [],
  searchTerm,
  onSearchChange,
  selectedTags,
  onTagsChange,
  selectedAgentType,
  onAgentTypeChange,
  className
}) {
  const [tagPopoverOpen, setTagPopoverOpen] = useState(false)
  const allTags = useAllTags(prompts)

  const handleTagToggle = (tag) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    onTagsChange(newTags)
  }

  const handleRemoveTag = (tagToRemove) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove))
  }

  const handleClearAllFilters = () => {
    onSearchChange("")
    onTagsChange([])
    onAgentTypeChange("")
  }

  const hasActiveFilters = searchTerm || selectedTags.length > 0 || selectedAgentType

  const formatAgentType = (type) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search prompts by name, description, or content..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Agent Type Filter */}
        <Select value={selectedAgentType} onValueChange={onAgentTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Agent type..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>All agent types</SelectItem>
            {AGENT_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {formatAgentType(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <Popover open={tagPopoverOpen} onOpenChange={setTagPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-between">
                <Filter className="h-4 w-4 mr-2" />
                Tags
                {selectedTags.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedTags.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="start">
              <Command>
                <CommandInput placeholder="Search tags..." />
                <CommandList>
                  <CommandEmpty>No tags found.</CommandEmpty>
                  <CommandGroup>
                    {allTags.map((tag) => (
                      <CommandItem
                        key={tag}
                        value={tag}
                        onSelect={() => handleTagToggle(tag)}
                        className="cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedTags.includes(tag)}
                          onChange={() => handleTagToggle(tag)}
                          className="mr-2"
                        />
                        {tag}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Active Filter Tags */}
      {(selectedTags.length > 0 || selectedAgentType) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {/* Agent Type Badge */}
          {selectedAgentType && (
            <Badge variant="secondary" className="gap-1">
              Agent: {formatAgentType(selectedAgentType)}
              <button
                onClick={() => onAgentTypeChange("")}
                className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {/* Tag Badges */}
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {hasActiveFilters && (
          <>
            Showing filtered results
            {searchTerm && (
              <span className="font-medium"> for "{searchTerm}"</span>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default PromptFilters
