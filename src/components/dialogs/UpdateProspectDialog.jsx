import * as React from "react"
import { useState, useEffect, useContext } from "react"
import { useQueryClient } from '@tanstack/react-query'
import { Edit3 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import DialogWrapper from "@/components/shared/dialog/DialogWrapper"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"
import FormField from "@/components/shared/ui/FormField"
import { StatusSelect } from "@/components/ui/StatusSelect"

import { useAuth } from "@/contexts/AuthContext"
import { useUpdateProspect } from "@/api/prospects/patch/update"

// Default values to ensure controlled inputs
const DEFAULT_PROSPECT_VALUES = {
  first_name: "",
  last_name: "",
  title: "",
  location: "",
  status_id: null,
}

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

  // Get user ID from AuthContext
  const { user } = useAuth()
  const userId = user?.id

  // Setup query client and mutation
  const queryClient = useQueryClient()
  const { mutateAsync, isPending } = useUpdateProspect({
    onSuccess: async (data) => {
      toast.success(data?.message || "Prospect updated successfully")
      await queryClient.invalidateQueries({ queryKey: ["prospects", userId] })
      onSuccess?.()
      onOpenChange(false)
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update prospect")
      console.error('Failed to update prospect:', error)
    }
  })

  // Initialize form data when prospect changes
  useEffect(() => {
    if (prospect) {
      setFormData({
        first_name: prospect.first_name || "",
        last_name: prospect.last_name || "",
        title: prospect.title || "",
        location: prospect.location || "",
        status_id: prospect.status?.id || null,
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
    
    if (!formData.first_name.trim() || !formData.last_name.trim() || !prospect || !userId) {
      return
    }

    // Build updated_fields payload - only include changed fields
    const updated_fields = {}
    
    if (formData.first_name.trim() !== (prospect.first_name || "")) {
      updated_fields.first_name = formData.first_name.trim()
    }
    
    if (formData.last_name.trim() !== (prospect.last_name || "")) {
      updated_fields.last_name = formData.last_name.trim()
    }
    
    if (formData.title.trim() !== (prospect.title || "")) {
      updated_fields.title = formData.title.trim() || null
    }
    
    if (formData.location.trim() !== (prospect.location || "")) {
      updated_fields.location = formData.location.trim() || null
    }
    
    if (formData.status_id !== (prospect.status?.id || null)) {
      updated_fields.status_id = formData.status_id || null
    }

    // If no changes detected, just close the dialog
    if (Object.keys(updated_fields).length === 0) {
      handleClose()
      return
    }

    try {
      setIsSubmitting(true)
      await mutateAsync({
        user_id: userId,
        prospect_ids: [prospect.linkedin_id],
        updated_fields
      })
      // onSuccess callback will handle closing and invalidating queries
    } catch (error) {
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

  const isFormValid = formData.first_name.trim().length > 0 && formData.last_name.trim().length > 0 && userId
  const isLoading = isSubmitting || isPending

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
        <div className="space-y-2">
          <label htmlFor="prospect-status" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Status
          </label>
          <StatusSelect
            selectedId={formData.status_id}
            currentStatus={prospect?.status}
            onChange={(statusObj) => handleInputChange("status_id", statusObj?.id ?? null)}
            placeholder="Select status"
            disabled={isLoading}
          />
          <p className="text-sm text-muted-foreground">
            The current status of the prospect
          </p>
        </div>
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
