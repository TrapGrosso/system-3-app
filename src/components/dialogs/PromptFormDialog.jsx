import * as React from "react"
import { useState, useEffect } from "react"
import { Plus, Edit3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import DialogWrapper from "@/components/shared/dialog/DialogWrapper"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"
import FormField from "@/components/shared/ui/FormField"

import { usePrompts } from "@/contexts/PromptContext"

function PromptFormDialog({ 
  mode = "create", // "create" or "edit"
  prompt = null, // prompt object for edit mode
  onSuccess,
  trigger,
  children,
  open,
  onOpenChange
}) {
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

  const handleClose = () => {
    onOpenChange(false)
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

  // Handle successful creation/update
  useEffect(() => {
    if (!hasSubmitted) return // ignore initial render
    
    const finished = mode === "create" ? !isCreatingPrompt : !isUpdatingPrompt
    if (finished) {
      handleClose()
      onSuccess?.()
      setHasSubmitted(false) // reset for next time
    }
  }, [hasSubmitted, isCreatingPrompt, isUpdatingPrompt, mode, onSuccess, onOpenChange])

  // Reset hasSubmitted when dialog closes
  useEffect(() => {
    if (!open) {
      setHasSubmitted(false)
    }
  }, [open])

  const isSubmitting = mode === "create" ? isCreatingPrompt : isUpdatingPrompt
  const isFormValid = formData.name.trim() && formData.prompt_text.trim()

  return (
    <DialogWrapper
      open={open}
      onOpenChange={onOpenChange}
      icon={mode === "create" ? <Plus className="h-5 w-5" /> : <Edit3 className="h-5 w-5" />}
      title={mode === "create" ? "Create New Prompt" : "Edit Prompt"}
      description={mode === "create" 
        ? "Create a new AI prompt template for your campaigns."
        : "Update the prompt details and configuration."
      }
      size="lg"
    >
      {trigger && <DialogWrapper.Trigger asChild>{trigger}</DialogWrapper.Trigger>}
      {children && <DialogWrapper.Trigger asChild>{children}</DialogWrapper.Trigger>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <FormField
            id="prompt-name"
            label="Name"
            required
            value={formData.name}
            onChange={(v) => handleInputChange("name", v)}
            placeholder="Enter prompt name..."
            maxLength={100}
            helper="A descriptive name for your prompt"
            disabled={isSubmitting}
          />

          {/* Description Field */}
          <FormField
            id="prompt-description"
            label="Description"
            type="textarea"
            rows={2}
            value={formData.description}
            onChange={(v) => handleInputChange("description", v)}
            placeholder="Enter prompt description..."
            helper="Optional description to help identify this prompt"
            disabled={isSubmitting}
          />

          {/* Prompt Text Field */}
          <FormField
            id="prompt-text"
            label="Prompt Text"
            required
            type="textarea"
            rows={6}
            value={formData.prompt_text}
            onChange={(v) => handleInputChange("prompt_text", v)}
            placeholder="Enter your prompt text here..."
            className="font-mono text-sm"
            helper="The actual prompt text that will be used by the AI"
            disabled={isSubmitting}
          />

          {/* Agent Type Field */}
          <FormField
            id="agent-type"
            label="Agent Type"
            type="select"
            value={formData.agent_type}
            onChange={(v) => handleInputChange("agent_type", v)}
            placeholder="Select agent type..."
            options={AGENT_TYPES.map((type) => ({
              label: type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
              value: type,
            }))}
            helper="Agent type for specialized prompts"
            disabled={isSubmitting}
          />

          {/* Tags Field */}
          <FormField
            id="prompt-tags"
            label="Tags"
            value={formData.tags}
            onChange={(v) => handleInputChange("tags", v)}
            placeholder="Enter tags separated by commas..."
            helper="Comma-separated tags to help organize and find your prompts"
            disabled={isSubmitting}
          />
        </form>

      <DialogWrapper.Footer className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button 
          variant="outline" 
          onClick={handleClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <SpinnerButton 
          loading={isSubmitting}
          disabled={!isFormValid}
          onClick={handleSubmit}
        >
          {mode === "create" ? "Create Prompt" : "Update Prompt"}
        </SpinnerButton>
      </DialogWrapper.Footer>
    </DialogWrapper>
  )
}

export default PromptFormDialog
