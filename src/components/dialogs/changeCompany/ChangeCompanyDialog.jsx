import * as React from "react"
import { useState } from "react"
import { Building2, Plus, X, Check, Database, ExternalLink, Wand2 } from "lucide-react"
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
import ChangeCompanyAiSearchSection from "./ChangeCompanyAiSearchSection"
import { useAddLeads } from "@/api/add-leads/addLeads"
import { useAiCompanySearch } from "@/api/change-company-dialog/aiCompanySearch"
import { useUserSettings } from "@/contexts/UserSettingsContext"

function ChangeCompanyDialog({ 
  open,
  onOpenChange,
  prospectId,
  trigger,
  children,
  onSuccess
}) {
  // Local state
  const [step, setStep] = useState(null) // null | 'choose' | 'manual' | 'ai'
  const [selectedId, setSelectedId] = useState('')
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [manualUrl, setManualUrl] = useState('')
  const [precision, setPrecision] = useState('default')
  const [selectedFlags, setSelectedFlags] = useState([])
  
  // Fetch AI search defaults
  const { getSetting, isLoading: isSettingsLoading } = useUserSettings()
  const aiSearchDefaults = getSetting("search_company_with_ai")
  const isLoadingAiSearchDefaults = isSettingsLoading && !aiSearchDefaults

  // Hooks - all contexts and mutations in dialog
  const { user } = useAuth()
  const { updateProspectCompany, isUpdatingProspect } = useProspects()
  
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
  const addLeadsMutation = useAddLeads({
    onSuccess: (data) => {
      toast.success(data.message || 'Company submitted successfully')
      handleReset()
      onOpenChange(false)
      if (onSuccess) onSuccess()
    },
    onError: (error) => {
      console.error('Error submitting company:', error)
      toast.error(error.message || 'Failed to submit company')
    },
  })

  // AI Company Search mutation
  const aiSearchMutation = useAiCompanySearch({
    onSuccess: (data) => {
      toast.success(data.message || 'AI search started successfully')
      handleReset()
      onOpenChange(false)
      if (onSuccess) onSuccess()
    },
    onError: (error) => {
      console.error('Error starting AI search:', error)
      toast.error(error.message || 'Failed to start AI search')
    },
  })

  // Derived loading state
  const isSubmitting = addLeadsMutation.isPending || isUpdatingProspect || aiSearchMutation.isPending

  // Query change handler
  const handleQueryChange = React.useCallback((partial) => {
    setQuery(partial)
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
    setPrecision('default')
    setSelectedFlags([])
    resetFilters()
    aiInitRef.current = false // Reset AI defaults initialization flag
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
      await updateProspectCompany(prospectId, selectedId)
      if (onSuccess) onSuccess()
      handleReset()
    } else if (step === 'manual' && manualUrl.trim()) {
      // Submit new company URL
      addLeadsMutation.mutate({
        user_id: user?.id,
        leads: [manualUrl.trim()],
        options: {
          add_to_prospect: true,
          prospect_id: prospectId,
          flags: []
        }
      })
    } else if (step === 'ai') {
      // Start AI company search
      aiSearchMutation.mutate({
        user_id: user?.id,
        prospect_ids: [prospectId],
        options: {
          agent_precision: precision,
          flags: selectedFlags
        }
      })
    }
  }

  // Check if submit is valid
  const isSubmitValid = (step === 'choose' && selectedId) || (step === 'manual' && manualUrl.trim() && manualUrl.includes('linkedin.com')) || (step === 'ai')

  // Ref to prevent re-initializing AI search defaults on re-render
  const aiInitRef = React.useRef(false)

  // Initialize AI search defaults when step is 'ai' and not yet initialized
  React.useEffect(() => {
    if (step === 'ai' && !aiInitRef.current && aiSearchDefaults) {
      setPrecision(aiSearchDefaults.agent_precision ?? 'default')
      setSelectedFlags(Array.isArray(aiSearchDefaults.flags) ? aiSearchDefaults.flags : [])
      aiInitRef.current = true
    }
  }, [step, aiSearchDefaults])

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
            
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
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

              <Button
                onClick={() => setStep('ai')}
                className="flex-1 h-16 flex-col gap-2"
                variant="outline"
              >
                <Wand2 className="h-5 w-5" />
                <span>Search with AI</span>
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
              onApplyFilters={(filters) => setQuery({ ...filters, page: 1 })}
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

        {/* Step 2c: AI Search */}
        {step === 'ai' && (
          <ChangeCompanyAiSearchSection
            precision={precision}
            setPrecision={setPrecision}
            flags={selectedFlags}
            setFlags={setSelectedFlags}
            disabled={aiSearchMutation.isPending}
            isLoadingDefaults={isLoadingAiSearchDefaults}
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
          {step === 'ai' && <Wand2 className="h-4 w-4 mr-2" />}
          {step === 'choose' ? 'Set Company' : step === 'manual' ? 'Add Company' : 'Search with AI'}
        </SpinnerButton>
        )}
      </DialogWrapper.Footer>
    </DialogWrapper>
  )
}

export default ChangeCompanyDialog
