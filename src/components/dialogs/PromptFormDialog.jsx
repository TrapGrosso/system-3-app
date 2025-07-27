import * as React from "react"
import { useState, useEffect } from "react"
import { Plus, Edit3, ChevronDown, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
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
  const [advancedOpen, setAdvancedOpen] = useState(false)
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
    createPrompt,
    updatePrompt,
    isCreatingPrompt,
    isUpdatingPrompt,
    AGENT_TYPES,
    DEFAULT_MODEL_SETTINGS,
  } = usePrompts()

  // Initialize form data when prompt changes (edit mode)
  useEffect(() => {
    if (mode === "edit" && prompt) {
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
    } else if (mode === "create") {
      setFormData({
        agent_type: "",
        name: "",
        description: "",
        prompt_text: "",
        tags: "",
        variable_display_name: "",
        model_settings: { ...DEFAULT_MODEL_SETTINGS }
      })
    }
  }, [mode, prompt, DEFAULT_MODEL_SETTINGS])

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

    if (mode === "create") {
      createPrompt({
        prompt_name: formData.name.trim(),
        prompt_description: formData.description.trim() || undefined,
        prompt_text: formData.prompt_text.trim(),
        agent_type: formData.agent_type,
        tags: parsedTags.length > 0 ? parsedTags : undefined,
        variable_display_name: formData.variable_display_name.trim() || undefined,
        model_settings: formData.model_settings
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
        updates.updated_agent_type = formData.agent_type
      }
      
      // Compare tags arrays
      const currentTags = Array.isArray(prompt.tags) ? prompt.tags : []
      const newTags = parsedTags
      const tagsChanged = JSON.stringify(currentTags.sort()) !== JSON.stringify(newTags.sort())
      if (tagsChanged) {
        updates.updated_tags = newTags.length > 0 ? newTags : undefined
      }

      // Check additional_metadata changes
      const currentMetadata = prompt.additional_metadata || {}
      const currentVariableName = currentMetadata.variable_name || ""
      const newVariableName = formData.variable_display_name.trim()
      
      if (newVariableName !== currentVariableName) {
        updates.variable_display_name = newVariableName
      }

      // Check model settings changes
      const modelSettingsChanged = Object.keys(DEFAULT_MODEL_SETTINGS).some(key => 
        formData.model_settings[key] !== currentMetadata[key]
      )
      if (modelSettingsChanged) {
        updates.model_settings = formData.model_settings
      }

      // Only update if there are changes
      if (Object.keys(updates).length > 0) {
        updatePrompt(prompt.id, updates)
      } else {
        // No changes, just close without marking as submitted
        setHasSubmitted(false)
        onOpenChange(false)
      }
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    if (mode === "create") {
      setFormData({
        agent_type: "",
        name: "",
        description: "",
        prompt_text: "",
        tags: "",
        variable_display_name: "",
        model_settings: { ...DEFAULT_MODEL_SETTINGS }
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
  const isFormValid = formData.agent_type && 
                     formData.name.trim() && 
                     formData.prompt_text.trim() &&
                     (formData.agent_type !== 'create_variable' || formData.variable_display_name.trim())

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
            disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                disabled={isSubmitting}
              />

              {/* Advanced Settings - Collapsible */}
              <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center justify-between w-full p-0 h-auto font-medium text-left"
                    type="button"
                  >
                    <span>Advanced Settings</span>
                    {advancedOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4 p-4 border rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure advanced model parameters for fine-tuning AI behavior
                  </p>
                  
                  {/* Temperature */}
                  <FormField
                    id="temperature"
                    label="Temperature"
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={formData.model_settings.temperature}
                    onChange={(v) => handleModelSettingChange("temperature", parseFloat(v) || 0.7)}
                    helper="Controls randomness: 0 = focused, 2 = creative"
                    disabled={isSubmitting}
                  />

                  {/* Top P */}
                  <FormField
                    id="top_p"
                    label="Top P"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.model_settings.top_p}
                    onChange={(v) => handleModelSettingChange("top_p", parseFloat(v) || 1)}
                    helper="Controls diversity via nucleus sampling"
                    disabled={isSubmitting}
                  />

                  {/* Max Tokens */}
                  <FormField
                    id="max_tokens"
                    label="Max Tokens"
                    type="number"
                    min="1"
                    max="4000"
                    value={formData.model_settings.max_tokens}
                    onChange={(v) => handleModelSettingChange("max_tokens", parseInt(v) || 1024)}
                    helper="Maximum length of the response"
                    disabled={isSubmitting}
                  />

                  {/* Frequency Penalty */}
                  <FormField
                    id="frequency_penalty"
                    label="Frequency Penalty"
                    type="number"
                    min="-2"
                    max="2"
                    step="0.1"
                    value={formData.model_settings.frequency_penalty}
                    onChange={(v) => handleModelSettingChange("frequency_penalty", parseFloat(v) || 0)}
                    helper="Reduces repetition of tokens"
                    disabled={isSubmitting}
                  />

                  {/* Presence Penalty */}
                  <FormField
                    id="presence_penalty"
                    label="Presence Penalty"
                    type="number"
                    min="-2"
                    max="2"
                    step="0.1"
                    value={formData.model_settings.presence_penalty}
                    onChange={(v) => handleModelSettingChange("presence_penalty", parseFloat(v) || 0)}
                    helper="Encourages talking about new topics"
                    disabled={isSubmitting}
                  />
                </CollapsibleContent>
              </Collapsible>
            </>
          )}
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
