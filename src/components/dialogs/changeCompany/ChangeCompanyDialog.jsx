import * as React from "react"
import { useState } from "react"
import { Building2, Plus, X, Check, Database, ExternalLink } from "lucide-react"
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import DialogWrapper from "@/components/shared/dialog/DialogWrapper"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"
import CompaniesFilterBar from "@/components/people&companies/CompaniesFilterBar"

import { useAuth } from "@/contexts/AuthContext"
import { useProspects } from "@/contexts/ProspectsContext"
import { useCompanies } from "@/contexts/CompaniesContext"
import ChangeCompanyTable from "./ChangeCompanyTable"
import ChangeCompanySubmitSection from "./ChangeCompanySubmitSection"

// AddLeads API function (embedded in dialog)
const addLeads = async (payload) => {
  const response = await fetch('https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/addLeads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error)
  }

  return response.json()
}

function ChangeCompanyDialog({ 
  open,
  onOpenChange,
  prospectId,
  trigger,
  children
}) {
  // Local state
  const [step, setStep] = useState(null) // null | 'choose' | 'manual'
  const [selectedId, setSelectedId] = useState('')
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [manualUrl, setManualUrl] = useState('')
  
  // Hooks - all contexts and mutations in dialog
  const { user } = useAuth()
  const { updateProspectCompany } = useProspects()
  
  // Companies context - use as single source of truth
  const { 
    data, 
    total, 
    isFetching, 
    query, 
    setQuery,
    resetFilters 
  } = useCompanies()

  // AddLeads mutation
  const addLeadsMutation = useMutation({
    mutationFn: addLeads,
    onSuccess: (data) => {
      console.log('Company submitted successfully:', data)
      toast.success(data.message || 'Company submitted successfully')
      handleReset()
      onOpenChange(false)
    },
    onError: (error) => {
      console.error('Error submitting company:', error)
      toast.error(error.message || 'Failed to submit company')
    },
  })

  // Derived loading state
  const isSubmitting = addLeadsMutation.isPending || updateProspectCompany.isUpdatingProspect

  // Query change handler
  const handleQueryChange = React.useCallback((partial) => {
    setQuery(prev => ({ ...prev, ...partial }))
  }, [setQuery])

  // Row click handler for table
  const handleRowClick = React.useCallback((linkedinId, companyData) => {
    setSelectedId(linkedinId)
    setSelectedCompany(companyData)
  }, [])

  // Reset all local state
  const handleReset = () => {
    setStep(null)
    setSelectedId('')
    setSelectedCompany(null)
    setManualUrl('')
    resetFilters()
  }

  // Handle dialog close
  const handleOpenChange = (newOpen) => {
    if (!newOpen && !isSubmitting) {
      handleReset()
    }
    onOpenChange(newOpen)
  }

  // Handle submit
  const handleSubmit = async () => {
    if (step === 'choose' && selectedId) {
      // Update prospect with selected company
      updateProspectCompany(prospectId, selectedId)
    } else if (step === 'manual' && manualUrl.trim()) {
      // Submit new company URL
      addLeadsMutation.mutate({
        user_id: user?.id,
        leads: [{ url: manualUrl.trim() }],
        options: {
          add_to_prospect: true,
          prospect_id: prospectId,
          source: 'change_company_dialog'
        }
      })
    }
  }

  // Check if submit is valid
  const isSubmitValid = (step === 'choose' && selectedId) || (step === 'manual' && manualUrl.trim() && manualUrl.includes('linkedin.com'))

  // Handle clear selection
  const handleClearSelection = () => {
    setSelectedId('')
    setSelectedCompany(null)
  }

  return (
    <DialogWrapper
      open={open}
      onOpenChange={handleOpenChange}
      icon={<Building2 className="h-5 w-5" />}
      title="Add / Change Company"
      description={`${step ? 'Configure' : 'Choose how to add'} a company for this prospect.`}
      size="xl"
    >
      {trigger && <DialogWrapper.Trigger asChild>{trigger}</DialogWrapper.Trigger>}
      {children && <DialogWrapper.Trigger asChild>{children}</DialogWrapper.Trigger>}

      <DialogWrapper.Body className="space-y-6">
        {/* Step 1: Choose action (null state) */}
        {step === null && (
          <div className="flex flex-col items-center justify-center min-h-[350px] gap-4">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">How would you like to add a company?</h3>
              <p className="text-sm text-muted-foreground">
                Choose an existing company from your database or add a new one
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <Button
                onClick={() => setStep('choose')}
                className="flex-1 h-16 flex-col gap-2"
                variant="outline"
              >
                <Database className="h-5 w-5" />
                <span>Choose from database</span>
              </Button>
              
              <Button
                onClick={() => setStep('manual')}
                className="flex-1 h-16 flex-col gap-2"
                variant="outline"
              >
                <Plus className="h-5 w-5" />
                <span>Add new LinkedIn URL</span>
              </Button>
            </div>
          </div>
        )}

        {/* Step 2a: Choose from database */}
        {step === 'choose' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <CompaniesFilterBar
              query={query}
              onApplyFilters={(filters) => setQuery(prev => ({ ...prev, ...filters, page: 1 }))}
              onResetFilters={resetFilters}
              loading={isFetching}
            />

            {/* Companies Table */}
            <ChangeCompanyTable
              data={data}
              total={total}
              query={query}
              onQueryChange={handleQueryChange}
              loading={isFetching}
              selectedId={selectedId}
              onRowClick={handleRowClick}
            />

            {/* Selection Summary */}
            {selectedCompany && (
              <div className="flex items-center justify-between p-3 bg-accent/50 rounded-md border">
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">{selectedCompany.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedCompany.industry} • {selectedCompany.location}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 2b: Manual URL input */}
        {step === 'manual' && (
          <ChangeCompanySubmitSection
            value={manualUrl}
            onChange={setManualUrl}
          />
        )}
      </DialogWrapper.Body>

      <DialogWrapper.Footer className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {/* Back button (when in choose/manual step) */}
        {step && (
          <Button
            variant="outline"
            onClick={() => {
              handleReset()
            }}
            disabled={isSubmitting}
          >
            ← Back
          </Button>
        )}
        
        {/* Cancel button */}
        <Button
          variant="outline"
          onClick={() => handleOpenChange(false)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        
        {/* Submit button (only show when in choose/manual step) */}
        {step && (
          <SpinnerButton
            onClick={handleSubmit}
            disabled={!isSubmitValid || isSubmitting}
            loading={isSubmitting}
          >
            {step === 'choose' && <Check className="h-4 w-4 mr-2" />}
            {step === 'manual' && <Plus className="h-4 w-4 mr-2" />}
            {step === 'choose' ? 'Set Company' : 'Add Company'}
          </SpinnerButton>
        )}
      </DialogWrapper.Footer>
    </DialogWrapper>
  )
}

export default ChangeCompanyDialog
