import * as React from "react"
import { useState, useEffect } from "react"
import { Plus, Edit3 } from "lucide-react"

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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"

import { usePrompts } from "@/contexts/PromptContext"

function PromptFormDialog({ 
  mode = "create", // "create" or "edit"
  prompt = null, // prompt object for edit mode
  onSuccess,
  trigger,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    prompt_text: "",
    agent_type: "",
    tags: ""
  })

  // Get prompts context
  const {
    createPrompt,
    updatePrompt,
    isCreatingPrompt,
    isUpdatingPrompt,
    AGENT_TYPES,
  } = usePrompts()

  // Determine if this is controlled or uncontrolled
  const isControlled = controlledOpen !== undefined
  const dialogOpen = isControlled ? controlledOpen : internalOpen
  const setDialogOpen = isControlled ? controlledOnOpenChange : setInternalOpen

  // Initialize form data when prompt changes (edit mode)
  useEffect(() => {
    if (mode === "edit" && prompt) {
      setFormData({
        name: prompt.name || "",
        description: prompt.description || "",
        prompt_text: prompt.prompt_text || "",
        agent_type: prompt.agent_type || "",
        tags: Array.isArray(prompt.tags) ? prompt.tags.join(", ") : ""
      })
    } else if (mode === "create") {
      setFormData({
        name: "",
        description: "",
        prompt_text: "",
        agent_type: "",
        tags: ""
      })
    }
  }, [mode, prompt])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.prompt_text.trim()) {
      return
    }

    // Parse tags from comma-separated string
    const parsedTags = formData.tags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    // Mark that we've submitted to track success state
    setHasSubmitted(true)

    if (mode === "create") {
      createPrompt({
        prompt_name: formData.name.trim(),
        prompt_description: formData.description.trim() || undefined,
        prompt_text: formData.prompt_text.trim(),
        agent_type: formData.agent_type || undefined,
        tags: parsedTags.length > 0 ? parsedTags : undefined
      })
    } else if (mode === "edit" && prompt) {
      const updates = {}
      
      if (formData.name.trim() !== prompt.name) {
        updates.updated_prompt_name = formData.name.trim()
      }
      if (formData.description.trim() !== (prompt.description || "")) {
        updates.updated_prompt_description = formData.description.trim() || undefined
      }
      if (formData.prompt_text.trim() !== prompt.prompt_text) {
        updates.updated_prompt_text = formData.prompt_text.trim()
      }
      if (formData.agent_type !== (prompt.agent_type || "")) {
        updates.updated_agent_type = formData.agent_type || undefined
      }
      
      // Compare tags arrays
      const currentTags = Array.isArray(prompt.tags) ? prompt.tags : []
      const newTags = parsedTags
      const tagsChanged = JSON.stringify(currentTags.sort()) !== JSON.stringify(newTags.sort())
      if (tagsChanged) {
        updates.updated_tags = newTags.length > 0 ? newTags : undefined
      }

      // Only update if there are changes
      if (Object.keys(updates).length > 0) {
        updatePrompt(prompt.id, updates)
      } else {
        // No changes, just close without marking as submitted
        setHasSubmitted(false)
        handleOpenChange(false)
      }
    }
  }

  const handleOpenChange = (newOpen) => {
    if (setDialogOpen) {
      setDialogOpen(newOpen)
    }
    if (!newOpen) {
      // Reset form when closing
      if (mode === "create") {
        setFormData({
          name: "",
          description: "",
          prompt_text: "",
          agent_type: "",
          tags: ""
        })
      }
    }
  }

  // Handle successful creation/update
  useEffect(() => {
    if (!hasSubmitted) return // ignore initial render
    
    const finished = mode === "create" ? !isCreatingPrompt : !isUpdatingPrompt
    if (finished) {
      handleOpenChange(false)
      onSuccess?.()
      setHasSubmitted(false) // reset for next time
    }
  }, [hasSubmitted, isCreatingPrompt, isUpdatingPrompt, mode, onSuccess])

  // Reset hasSubmitted when dialog closes
  useEffect(() => {
    if (!dialogOpen) {
      setHasSubmitted(false)
    }
  }, [dialogOpen])

  const isSubmitting = mode === "create" ? isCreatingPrompt : isUpdatingPrompt
  const isFormValid = formData.name.trim() && formData.prompt_text.trim()

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "create" ? (
              <>
                <Plus className="h-5 w-5" />
                Create New Prompt
              </>
            ) : (
              <>
                <Edit3 className="h-5 w-5" />
                Edit Prompt
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "Create a new AI prompt template for your campaigns."
              : "Update the prompt details and configuration."
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="prompt-name" className="text-sm font-medium">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="prompt-name"
              placeholder="Enter prompt name..."
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={isSubmitting}
              maxLength={100}
              required
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>A descriptive name for your prompt</span>
              <span>{formData.name.length}/100</span>
            </div>
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="prompt-description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="prompt-description"
              placeholder="Enter prompt description..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              disabled={isSubmitting}
              rows={2}
              className="resize-none"
            />
            <span className="text-xs text-muted-foreground">
              Optional description to help identify this prompt
            </span>
          </div>

          {/* Prompt Text Field */}
          <div className="space-y-2">
            <Label htmlFor="prompt-text" className="text-sm font-medium">
              Prompt Text <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="prompt-text"
              placeholder="Enter your prompt text here..."
              value={formData.prompt_text}
              onChange={(e) => handleInputChange("prompt_text", e.target.value)}
              disabled={isSubmitting}
              rows={6}
              className="resize-none font-mono text-sm"
              required
            />
            <span className="text-xs text-muted-foreground">
              The actual prompt text that will be used by the AI
            </span>
          </div>

          {/* Agent Type Field */}
          <div className="space-y-2">
            <Label htmlFor="agent-type" className="text-sm font-medium">
              Agent Type
            </Label>
            <Select
              value={formData.agent_type}
              onValueChange={(value) => handleInputChange("agent_type", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="agent-type">
                <SelectValue placeholder="Select agent type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>No specific type</SelectItem>
                {AGENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">
              Optional agent type for specialized prompts
            </span>
          </div>

          {/* Tags Field */}
          <div className="space-y-2">
            <Label htmlFor="prompt-tags" className="text-sm font-medium">
              Tags
            </Label>
            <Input
              id="prompt-tags"
              placeholder="Enter tags separated by commas..."
              value={formData.tags}
              onChange={(e) => handleInputChange("tags", e.target.value)}
              disabled={isSubmitting}
            />
            <span className="text-xs text-muted-foreground">
              Comma-separated tags to help organize and find your prompts
            </span>
          </div>
        </form>

        <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button 
            variant="outline" 
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting && <Spinner size="sm" className="mr-2" />}
            {mode === "create" ? "Create Prompt" : "Update Prompt"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PromptFormDialog
