import * as React from "react"
import { useState, useEffect } from "react"
import { Edit3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import DialogWrapper from "@/components/shared/dialog/DialogWrapper"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"
import FormField from "@/components/shared/ui/FormField"
import DialogAdvancedSettingsCollapsible from "@/components/shared/dialog/DialogAdvancedSettingsCollapsible"

import { usePrompts } from "@/contexts/PromptContext"

// Model settings constants
const DEFAULT_MODEL_SETTINGS = {
  temperature: 0.7,
  top_p: 1,
  max_tokens: 1024,
  frequency_penalty: 0,
  presence_penalty: 0,
}

const MODEL_SETTINGS_FIELDS = [
  {
    key: "temperature",
    label: "Temperature",
    type: "text",
    helper: "Controls randomness: 0 = focused, 2 = creative",
    defaultValue: 0.7
  },
  {
    key: "top_p",
    label: "Top P",
    type: "text",
    helper: "Controls diversity via nucleus sampling",
    defaultValue: 1
  },
  {
    key: "max_tokens",
    label: "Max Tokens",
    type: "text",
    helper: "Maximum length of the response",
    defaultValue: 1024
  },
  {
    key: "frequency_penalty",
    label: "Frequency Penalty",
    type: "text",
    helper: "Reduces repetition of tokens",
    defaultValue: 0
  },
  {
    key: "presence_penalty",
    label: "Presence Penalty",
    type: "text",
    helper: "Encourages talking about new topics",
    defaultValue: 0
  }
]

function UpdatePromptDialog({ 
  open,
  onOpenChange,
  prompt,
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
    variable_display_name: "",
    model_settings: {}
  })

  // Get prompts context
  const {
    updatePrompt,
    isUpdatingPrompt,
    AGENT_TYPES,
  } = usePrompts()

  // Initialize form data when prompt changes
  useEffect(() => {
    if (prompt) {
      const metadata = prompt.additional_metadata || {}
      setFormData({
        agent_type: prompt.agent_type || "",
        name: prompt.name || "",
        description: prompt.description || "",
        prompt_text: prompt.prompt_text || "",
        tags: Array.isArray(prompt.tags) ? prompt.tags.join(", ") : "",
        variable_display_name: metadata.variable_name || "",
        model_settings: { ...DEFAULT_MODEL_SETTINGS, ...metadata }
      })
    }
  }, [prompt])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleModelSettingChange = (setting, value) => {
    setFormData(prev => ({
      ...prev,
      model_settings: {
        ...prev.model_settings,
        [setting]: value
      }
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.agent_type || !formData.name.trim() || !formData.prompt_text.trim() || !prompt) {
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

    // Build updated_additional_metadata
    const updated_additional_metadata = {
      ...formData.model_settings,
      ...(formData.agent_type === 'create_variable' && formData.variable_display_name.trim()
        ? { variable_name: formData.variable_display_name.trim() }
        : {}),
    }

    // Send all fields as updated_ prefixed (no diff checking)
    updatePrompt(prompt.id, {
      updated_prompt_name: formData.name.trim(),
      updated_prompt_description: formData.description.trim() || undefined,
      updated_prompt_text: formData.prompt_text.trim(),
      updated_agent_type: formData.agent_type,
      updated_tags: parsedTags.length > 0 ? parsedTags : undefined,
      updated_additional_metadata
    })
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  // Handle successful update
  useEffect(() => {
    if (!hasSubmitted) return // ignore initial render
    
    if (!isUpdatingPrompt) {
      handleClose()
      onSuccess?.()
      setHasSubmitted(false) // reset for next time
    }
  }, [hasSubmitted, isUpdatingPrompt, onSuccess, onOpenChange])

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
      icon={<Edit3 className="h-5 w-5" />}
      title="Edit Prompt"
      description="Update the prompt details and configuration."
      size="lg"
    >
      {trigger && <DialogWrapper.Trigger asChild>{trigger}</DialogWrapper.Trigger>}
      {children && <DialogWrapper.Trigger asChild>{children}</DialogWrapper.Trigger>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Agent Type Field */}
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
          disabled={isUpdatingPrompt}
        />

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
          disabled={isUpdatingPrompt}
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
          disabled={isUpdatingPrompt}
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
          disabled={isUpdatingPrompt}
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
            disabled={isUpdatingPrompt}
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
          disabled={isUpdatingPrompt}
        />

        {/* Advanced Settings - Collapsible */}
        <DialogAdvancedSettingsCollapsible
          settings={formData.model_settings}
          onChange={handleModelSettingChange}
          disabled={isUpdatingPrompt}
          fieldConfig={MODEL_SETTINGS_FIELDS}
          description="Configure advanced model parameters for fine-tuning AI behavior"
        />
      </form>

      <DialogWrapper.Footer className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button 
          variant="outline" 
          onClick={handleClose}
          disabled={isUpdatingPrompt}
        >
          Cancel
        </Button>
        <SpinnerButton 
          loading={isUpdatingPrompt}
          disabled={!isFormValid}
          onClick={handleSubmit}
        >
          Update Prompt
        </SpinnerButton>
      </DialogWrapper.Footer>
    </DialogWrapper>
  )
}

export default UpdatePromptDialog
