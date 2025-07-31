import * as React from "react"
import { useState, useEffect } from "react"
import { Edit3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import DialogWrapper from "@/components/shared/dialog/DialogWrapper"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"
import FormField from "@/components/shared/ui/FormField"

import { useProspects } from "@/contexts/ProspectsContext"

// Default values to ensure controlled inputs
const DEFAULT_PROSPECT_VALUES = {
  first_name: "",
  last_name: "",
  title: "",
  location: "",
  status: "",
}

// Status options for the select field
const PROSPECT_STATUSES = [
  { label: "New", value: "new" },
  { label: "Queued", value: "queued" },
  { label: "Researching", value: "researching" },
  { label: "Ready", value: "ready" },
  { label: "Archived", value: "archived" },
]

function UpdateProspectDialog({ 
  open,
  onOpenChange,
  prospect,
  onSuccess,
  trigger,
  children
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState(DEFAULT_PROSPECT_VALUES)

  // Get prospects context
  const { updateProspect, isUpdatingProspect } = useProspects()

  // Initialize form data when prospect changes
  useEffect(() => {
    if (prospect) {
      setFormData({
        first_name: prospect.first_name || "",
        last_name: prospect.last_name || "",
        title: prospect.title || "",
        location: prospect.location || "",
        status: prospect.status || "",
      })
    }
  }, [prospect])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.first_name.trim() || !formData.last_name.trim() || !prospect) {
      return
    }

    // Build diff payload - only include changed fields
    const updates = {}
    
    if (formData.first_name.trim() !== (prospect.first_name || "")) {
      updates.updated_first_name = formData.first_name.trim()
    }
    
    if (formData.last_name.trim() !== (prospect.last_name || "")) {
      updates.updated_last_name = formData.last_name.trim()
    }
    
    if (formData.title.trim() !== (prospect.title || "")) {
      updates.updated_title = formData.title.trim() || undefined
    }
    
    if (formData.location.trim() !== (prospect.location || "")) {
      updates.updated_location = formData.location.trim() || undefined
    }
    
    if (formData.status !== (prospect.status || "")) {
      updates.updated_status = formData.status || undefined
    }

    // If no changes detected, just close the dialog
    if (Object.keys(updates).length === 0) {
      handleClose()
      return
    }

    try {
      setIsSubmitting(true)
      await updateProspect(prospect.linkedin_id, updates)
      handleClose()
      onSuccess?.()
    } catch (error) {
      // Error handling is done in the context layer via toast
      console.error('Failed to update prospect:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setIsSubmitting(false)
    }
  }, [open])

  const isFormValid = formData.first_name.trim().length > 0 && formData.last_name.trim().length > 0
  const isLoading = isSubmitting || isUpdatingProspect

  return (
    <DialogWrapper
      open={open}
      onOpenChange={onOpenChange}
      icon={<Edit3 className="h-5 w-5" />}
      title="Edit Prospect"
      description="Update the prospect details and information."
      size="lg"
    >
      {trigger && <DialogWrapper.Trigger asChild>{trigger}</DialogWrapper.Trigger>}
      {children && <DialogWrapper.Trigger asChild>{children}</DialogWrapper.Trigger>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name Field */}
        <FormField
          id="prospect-first-name"
          label="First Name"
          required
          value={formData.first_name}
          onChange={(v) => handleInputChange("first_name", v)}
          placeholder="Enter first name..."
          maxLength={100}
          helper="The prospect's first name"
          disabled={isLoading}
        />

        {/* Last Name Field */}
        <FormField
          id="prospect-last-name"
          label="Last Name"
          required
          value={formData.last_name}
          onChange={(v) => handleInputChange("last_name", v)}
          placeholder="Enter last name..."
          maxLength={100}
          helper="The prospect's last name"
          disabled={isLoading}
        />

        {/* Title Field */}
        <FormField
          id="prospect-title"
          label="Title"
          value={formData.title}
          onChange={(v) => handleInputChange("title", v)}
          placeholder="Enter job title..."
          maxLength={200}
          helper="The prospect's job title or position"
          disabled={isLoading}
        />

        {/* Location Field */}
        <FormField
          id="prospect-location"
          label="Location"
          value={formData.location}
          onChange={(v) => handleInputChange("location", v)}
          placeholder="City, State, Country"
          maxLength={200}
          helper="The prospect's location"
          disabled={isLoading}
        />

        {/* Status Field */}
        <FormField
          id="prospect-status"
          label="Status"
          type="select"
          value={formData.status}
          onChange={(v) => handleInputChange("status", v)}
          placeholder="Select status..."
          options={PROSPECT_STATUSES}
          helper="The current status of the prospect"
          disabled={isLoading}
        />
      </form>

      <DialogWrapper.Footer className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button 
          variant="outline" 
          onClick={handleClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <SpinnerButton 
          loading={isLoading}
          disabled={!isFormValid}
          onClick={handleSubmit}
        >
          Update Prospect
        </SpinnerButton>
      </DialogWrapper.Footer>
    </DialogWrapper>
  )
}

export default UpdateProspectDialog
