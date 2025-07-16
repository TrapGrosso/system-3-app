import * as React from "react"
import { XIcon, ChevronDownIcon, CheckIcon } from "lucide-react"
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

export function MultiSelectChipPicker({ 
  options, 
  value = [], 
  onValueChange, 
  placeholder = "Choose fields..." 
}) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue]
    onValueChange(newValue)
  }

  const handleRemoveChip = (optionValue) => {
    onValueChange(value.filter(v => v !== optionValue))
  }

  const getOptionLabel = (optionValue) => {
    return options.find(opt => opt.value === optionValue)?.label || optionValue
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-9 min-w-40 justify-between"
            role="combobox"
            aria-expanded={open}
          >
            {placeholder}
            <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Command>
            <CommandInput placeholder="Search fields..." />
            <CommandEmpty>No fields found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <CheckIcon
                      className={`mr-2 h-4 w-4 ${
                        value.includes(option.value) ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {/* Selected chips */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((optionValue) => (
            <Badge 
              key={optionValue} 
              variant="outline" 
              className="text-xs px-2 py-1"
            >
              {getOptionLabel(optionValue)}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                onClick={() => handleRemoveChip(optionValue)}
              >
                <XIcon className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}