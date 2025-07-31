import * as React from "react"
import { useState, useEffect } from "react"
import { Edit3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import DialogWrapper from "@/components/shared/dialog/DialogWrapper"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"
import FormField from "@/components/shared/ui/FormField"

import { useCompanies } from "@/contexts/CompaniesContext"

// Default values to ensure controlled inputs
const DEFAULT_COMPANY_VALUES = {
  name: "",
  website: "",
  industry: "",
  size: "",
  location: "",
}

function UpdateCompanyDialog({ 
  open,
  onOpenChange,
  company,
  onSuccess,
  trigger,
  children
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState(DEFAULT_COMPANY_VALUES)

  // Get companies context
  const { updateCompany, isUpdatingCompany } = useCompanies()

  // Initialize form data when company changes
  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        website: company.website || "",
        industry: company.industry || "",
        size: company.size || "",
        location: company.location || "",
      })
    }
  }, [company])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !company) {
      return
    }

    // Build diff payload - only include changed fields
    const updates = {}
    
    if (formData.name.trim() !== (company.name || "")) {
      updates.updated_name = formData.name.trim()
    }
    
    if (formData.website.trim() !== (company.website || "")) {
      updates.updated_website = formData.website.trim() || undefined
    }
    
    if (formData.industry.trim() !== (company.industry || "")) {
      updates.updated_industry = formData.industry.trim() || undefined
    }
    
    if (formData.size.trim() !== (company.size || "")) {
      updates.updated_size = formData.size.trim() || undefined
    }
    
    if (formData.location.trim() !== (company.location || "")) {
      updates.updated_location = formData.location.trim() || undefined
    }

    // If no changes detected, just close the dialog
    if (Object.keys(updates).length === 0) {
      handleClose()
      return
    }

    try {
      setIsSubmitting(true)
      await updateCompany(company.linkedin_id, updates)
      handleClose()
      onSuccess?.()
    } catch (error) {
      // Error handling is done in the context layer via toast
      console.error('Failed to update company:', error)
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

  const isFormValid = formData.name.trim().length > 0
  const isLoading = isSubmitting || isUpdatingCompany

  return (
    <DialogWrapper
      open={open}
      onOpenChange={onOpenChange}
      icon={<Edit3 className="h-5 w-5" />}
      title="Edit Company"
      description="Update the company details and information."
      size="lg"
    >
      {trigger && <DialogWrapper.Trigger asChild>{trigger}</DialogWrapper.Trigger>}
      {children && <DialogWrapper.Trigger asChild>{children}</DialogWrapper.Trigger>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company Name Field */}
        <FormField
          id="company-name"
          label="Company Name"
          required
          value={formData.name}
          onChange={(v) => handleInputChange("name", v)}
          placeholder="Enter company name..."
          maxLength={200}
          helper="The official name of the company"
          disabled={isLoading}
        />

        {/* Website Field */}
        <FormField
          id="company-website"
          label="Website"
          value={formData.website}
          onChange={(v) => handleInputChange("website", v)}
          placeholder="https://example.com"
          helper="Company website URL (optional)"
          disabled={isLoading}
        />

        {/* Industry Field */}
        <FormField
          id="company-industry"
          label="Industry"
          value={formData.industry}
          onChange={(v) => handleInputChange("industry", v)}
          placeholder="Enter industry..."
          maxLength={100}
          helper="The industry or sector the company operates in"
          disabled={isLoading}
        />

        {/* Company Size Field */}
        <FormField
          id="company-size"
          label="Company Size"
          value={formData.size}
          onChange={(v) => handleInputChange("size", v)}
          placeholder="e.g., 1-10, 50-200, 1000+"
          maxLength={50}
          helper="Number of employees (optional)"
          disabled={isLoading}
        />

        {/* Location Field */}
        <FormField
          id="company-location"
          label="Location"
          value={formData.location}
          onChange={(v) => handleInputChange("location", v)}
          placeholder="City, State, Country"
          maxLength={200}
          helper="Company headquarters or main location"
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
          Update Company
        </SpinnerButton>
      </DialogWrapper.Footer>
    </DialogWrapper>
  )
}

export default UpdateCompanyDialog
