import * as React from "react"
import { useState, useEffect } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import DialogWrapper from "@/components/shared/dialog/DialogWrapper"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"
import FormField from "@/components/shared/ui/FormField"
import { usePrompts } from "@/contexts/PromptContext"

function CreatePromptDialog({ 
  open,
  onOpenChange,
  onSuccess,
  trigger,
  children
}) {
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    agent_type: "",
    name: "",
    description: "",
    prompt_text: "",
    tags: "",
    variable_display_name: ""
  })

  // Get prompts context
  const {
    createPrompt,
    isCreatingPrompt,
    AGENT_TYPES,
  } = usePrompts()

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.agent_type || !formData.name.trim() || !formData.prompt_text.trim()) {
      return
    }

    if (formData.agent_type === 'create_variable' && !formData.variable_display_name.trim()) {
      return
    }

    // Parse tags from comma-separated string
    const parsedTags = formData.tags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    // Mark that we've submitted to track success state
    setHasSubmitted(true)

    // Build additional_metadata
    const additional_metadata = formData.agent_type === 'create_variable' && formData.variable_display_name.trim()
      ? { variable_name: formData.variable_display_name.trim() }
      : undefined

    createPrompt({
      prompt_name: formData.name.trim(),
      prompt_description: formData.description.trim() || undefined,
      prompt_text: formData.prompt_text.trim(),
      agent_type: formData.agent_type,
      tags: parsedTags.length > 0 ? parsedTags : undefined,
      additional_metadata
    })
  }

  const handleClose = () => {
    onOpenChange(false)
    setFormData({
      agent_type: "",
      name: "",
      description: "",
      prompt_text: "",
      tags: "",
      variable_display_name: ""
    })
  }

  // Handle successful creation
  useEffect(() => {
    if (!hasSubmitted) return // ignore initial render
    
    if (!isCreatingPrompt) {
      handleClose()
      onSuccess?.()
      setHasSubmitted(false) // reset for next time
    }
  }, [hasSubmitted, isCreatingPrompt, onSuccess, onOpenChange])

  // Reset hasSubmitted when dialog closes
  useEffect(() => {
    if (!open) {
      setHasSubmitted(false)
    }
  }, [open])

  const isFormValid = formData.agent_type && 
                     formData.name.trim() && 
                     formData.prompt_text.trim() &&
                     (formData.agent_type !== 'create_variable' || formData.variable_display_name.trim())

  return (
    <DialogWrapper
      open={open}
      onOpenChange={onOpenChange}
      icon={<Plus className="h-5 w-5" />}
      title="Create New Prompt"
      description="Create a new AI prompt template for your agents."
      size="lg"
    >
      {trigger && <DialogWrapper.Trigger asChild>{trigger}</DialogWrapper.Trigger>}
      {children && <DialogWrapper.Trigger asChild>{children}</DialogWrapper.Trigger>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Agent Type Field - FIRST */}
        <FormField
          id="agent-type"
          label="Agent Type"
          required
          type="select"
          value={formData.agent_type}
          onChange={(v) => handleInputChange("agent_type", v)}
          placeholder="Select agent type..."
          options={AGENT_TYPES.map((type) => ({
            label: type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
            value: type,
          }))}
          helper="Agent type for specialized prompts"
          disabled={isCreatingPrompt}
        />

        {/* Conditional Fields - Show only when agent type is selected */}
        {formData.agent_type && (
          <>
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
              disabled={isCreatingPrompt}
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
              disabled={isCreatingPrompt}
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
              disabled={isCreatingPrompt}
            />

            {/* Variable Display Name Field - Only for create_variable type */}
            {formData.agent_type === 'create_variable' && (
              <FormField
                id="variable-display-name"
                label="Variable Display Name"
                required
                value={formData.variable_display_name}
                onChange={(v) => handleInputChange("variable_display_name", v)}
                placeholder="Enter variable display name..."
                maxLength={100}
                helper="The display name for this variable that will be shown to users"
                disabled={isCreatingPrompt}
              />
            )}

            {/* Tags Field */}
            <FormField
              id="prompt-tags"
              label="Tags"
              value={formData.tags}
              onChange={(v) => handleInputChange("tags", v)}
              placeholder="Enter tags separated by commas..."
              helper="Comma-separated tags to help organize and find your prompts"
              disabled={isCreatingPrompt}
            />

          </>
        )}
      </form>

      <DialogWrapper.Footer className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button 
          variant="outline" 
          onClick={handleClose}
          disabled={isCreatingPrompt}
        >
          Cancel
        </Button>
        <SpinnerButton 
          loading={isCreatingPrompt}
          disabled={!isFormValid}
          onClick={handleSubmit}
        >
          Create Prompt
        </SpinnerButton>
      </DialogWrapper.Footer>
    </DialogWrapper>
  )
}

export default CreatePromptDialog
