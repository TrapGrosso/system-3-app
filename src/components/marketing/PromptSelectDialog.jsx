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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { usePrompts } from "@/contexts/PromptContext"

export function PromptSelectDialog({ 
  open, 
  onOpenChange, 
  onConfirm, 
  isLoading = false,
  selectedCount = 0,
  currentPromptId = null 
}) {
  const { prompts, isLoadingPrompts } = usePrompts()
  const [selectedPromptId, setSelectedPromptId] = React.useState(currentPromptId)

  React.useEffect(() => {
    if (open) {
      setSelectedPromptId(currentPromptId)
    }
  }, [open, currentPromptId])

  const handleConfirm = () => {
    if (selectedPromptId && onConfirm) {
      onConfirm(selectedPromptId)
    }
  }

  const handleCancel = () => {
    setSelectedPromptId(currentPromptId)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Prompt</DialogTitle>
          <DialogDescription>
            {selectedCount > 1 
              ? `Select a new prompt for ${selectedCount} queue items`
              : "Select a new prompt for this queue item"
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="prompt-select">Prompt</Label>
            <Select
              value={selectedPromptId || ""}
              onValueChange={setSelectedPromptId}
              disabled={isLoadingPrompts || isLoading}
            >
              <SelectTrigger id="prompt-select">
                <SelectValue placeholder="Select a prompt..." />
              </SelectTrigger>
              <SelectContent>
                {prompts?.map((prompt) => (
                  <SelectItem key={prompt.id} value={prompt.id}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{prompt.name}</span>
                      {prompt.description && (
                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {prompt.description}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!selectedPromptId || isLoading || selectedPromptId === currentPromptId}
          >
            {isLoading ? "Updating..." : "Update Prompt"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
