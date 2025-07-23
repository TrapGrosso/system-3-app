import * as React from "react"
import { useState, useMemo } from "react"
import { Wand2, ArrowRight, ArrowLeft, Check } from "lucide-react"
import { useMutation } from '@tanstack/react-query'
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"

import DialogWrapper from "@/components/shared/dialog/DialogWrapper"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import { DataTable } from "@/components/shared/table/DataTable"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"
import PromptMultiSelect from "@/components/shared/dialog/PromptMultiSelect"
import { EnrichmentFilters } from "./EnrichmentFilters"
import { ConfirmationSummary } from "./ConfirmationSummary"
import { useGetProspectEnrichments } from "@/api/variable-dialog/getProspectEnrichments"

// API call to post variables
const postVariablesFromEnrichments = async (payload) => {
  const response = await fetch('https://n8n.coolify.fabiodevelopsthings.com/webhook/bbc9705e-9da1-43b6-992d-e05ab6e38644', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(`Failed to create variables: ${response.statusText}`)
  }

  return response.json()
}

function ProspectEnrichmentsDialog({
  user_id,
  prospectIds = [],
  open,
  onOpenChange,
  onSuccess,
  trigger,
  children
}) {
  const [step, setStep] = useState('select')
  const [selectedPromptIds, setSelectedPromptIds] = useState([])
  const [filters, setFilters] = useState({
    promptIds: [],
    entityKinds: [],
    sources: []
  })

  // Fetch enrichments data - now already flattened
  const { 
    data: enrichmentsData = [], 
    isLoading: isLoadingEnrichments, 
    isError: isErrorEnrichments,
    error: enrichmentsError
  } = useGetProspectEnrichments(user_id, prospectIds)

  // Mutation for posting variables
  const postMutation = useMutation({
    mutationFn: postVariablesFromEnrichments,
    onSuccess: (data) => {
      toast.success("Variables creation started successfully!")
      onSuccess?.(data)
      handleClose()
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create variables")
    }
  })

  // Filter enrichments based on current filters
  const filteredEnrichments = useMemo(() => {
    return enrichmentsData.filter(enrichment => {
      // Filter by prompt IDs
      if (filters.promptIds.length > 0) {
        if (!enrichment.prompt?.id || !filters.promptIds.includes(enrichment.prompt.id)) {
          return false
        }
      }

      // Filter by entity kinds
      if (filters.entityKinds.length > 0) {
        if (!filters.entityKinds.includes(enrichment.entity_kind)) {
          return false
        }
      }

      // Filter by sources
      if (filters.sources.length > 0) {
        if (!filters.sources.includes(enrichment.source)) {
          return false
        }
      }

      return true
    })
  }, [enrichmentsData, filters])

  // Selected enrichments are always all filtered enrichments
  const selectedEnrichments = filteredEnrichments

  // Group selected enrichments by prospect
  const selectedByProspect = useMemo(() => {
    const grouped = new Map()
    selectedEnrichments.forEach(enrichment => {
      if (!grouped.has(enrichment.prospect_id)) {
        grouped.set(enrichment.prospect_id, { company_id: null, enrichment_ids: [] })
      }
      
      const prospectData = grouped.get(enrichment.prospect_id)
      prospectData.enrichment_ids.push(enrichment.id)
      
      // Prioritize company_id from company enrichments
      if (enrichment.company_id && (!prospectData.company_id || enrichment.entity_kind === 'company')) {
        prospectData.company_id = enrichment.company_id
      }
    })
    return grouped
  }, [selectedEnrichments])

  // Table columns - updated for new API structure
  const columns = useMemo(() => [
    {
      accessorKey: 'entity_kind',
      header: 'Type',
      enableSorting: false,
      cell: ({ row }) => (
        <Badge variant={row.original.entity_kind === 'prospect' ? 'default' : 'secondary'}>
          {row.original.entity_kind}
        </Badge>
      )
    },
    {
      accessorKey: 'source',
      header: 'Source',
      enableSorting: false,
      cell: ({ row }) => row.original.source || '—'
    },
    {
      accessorKey: 'prompt',
      header: 'Prompt',
      enableSorting: false,
      cell: ({ row }) => row.original.prompt?.name || '—'
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      enableSorting: false,
      cell: ({ row }) => new Date(row.original.created_at).toLocaleString()
    },
    {
      accessorKey: 'prospect_name',
      header: 'Prospect',
      enableSorting: false,
      cell: ({ row }) => (
        <span className="truncate max-w-32" title={row.original.prospect_name}>
          {row.original.prospect_name}
        </span>
      )
    }
  ], [])

  // Handle close dialog
  const handleClose = () => {
    setStep('select')
    setSelectedPromptIds([])
    setFilters({ promptIds: [], entityKinds: [], sources: [] })
    onOpenChange?.(false)
  }

  // Handle submit
  const handleSubmit = () => {
    const payload = [...selectedByProspect.entries()].map(
      ([prospect_id, data]) => ({
        prospect_id,
        company_id: data.company_id,
        enrichment_ids: data.enrichment_ids,
        prompt_ids: selectedPromptIds
      })
    )

    postMutation.mutate(payload)
  }

  // Handle prompt selection (enforce single selection)
  const handlePromptChange = (newPromptIds) => {
    if (newPromptIds.length > 1) {
      setSelectedPromptIds([newPromptIds[newPromptIds.length - 1]])
    } else {
      setSelectedPromptIds(newPromptIds)
    }
  }

  const selectedCount = selectedEnrichments.length
  const selectedProspectCount = selectedByProspect.size

  return (
    <DialogWrapper 
      open={open} 
      onOpenChange={handleClose}
      icon={<Wand2 className="h-5 w-5" />}
      title="Create Variables from Enrichments"
      description={
        step === 'select' ? 'Filter and select enrichments to create variables from' :
        step === 'prompt' ? 'Choose a prompt to process the selected enrichments' :
        'Review your selection and confirm variable creation'
      }
      size="xl"
    >
      {trigger && <DialogWrapper.Trigger asChild>{trigger}</DialogWrapper.Trigger>}
      {children && <DialogWrapper.Trigger asChild>{children}</DialogWrapper.Trigger>}
      
      <DialogWrapper.Body>
          {/* Loading State */}
          {isLoadingEnrichments && (
            <div className="flex items-center justify-center h-64">
              <Spinner size="lg" />
            </div>
          )}

          {/* Error State */}
          {isErrorEnrichments && (
            <div className="text-center py-8">
              <p className="text-destructive mb-4">
                Failed to load enrichments: {enrichmentsError?.message}
              </p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          )}

          {/* Select Step */}
          {step === 'select' && !isLoadingEnrichments && !isErrorEnrichments && (
            <div className="space-y-4 h-full flex flex-col">
              <EnrichmentFilters
                filters={filters}
                onChange={setFilters}
                enrichmentsData={enrichmentsData}
              />
              
              <div className="flex-1 overflow-auto">
                <DataTable
                  columns={columns}
                  data={filteredEnrichments}
                  rowId={(row) => row.id}
                  enableSelection={false}
                  manualSorting={false}
                  emptyMessage="No enrichments found for the selected prospects"
                />
              </div>
            </div>
          )}

          {/* Prompt Step */}
          {step === 'prompt' && (
            <div className="space-y-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Selected enrichments:</p>
                <div className="flex gap-2">
                  <Badge variant="outline">{selectedCount} enrichments</Badge>
                  <Badge variant="outline">{selectedProspectCount} prospects</Badge>
                </div>
              </div>

              <Separator />

              <PromptMultiSelect
                value={selectedPromptIds}
                onChange={handlePromptChange}
                type="create_variable"
                label="Select prompt for variable creation (select only one)"
              />
            </div>
          )}

          {/* Confirm Step */}
          {step === 'confirm' && (
            <ConfirmationSummary 
              selectedEnrichments={selectedEnrichments}
              selectedProspectCount={selectedProspectCount}
              selectedPromptIds={selectedPromptIds}
              selectedByProspect={selectedByProspect}
            />
          )}
      </DialogWrapper.Body>

      <DialogWrapper.Footer className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {step === 'select' && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={() => setStep('prompt')}
                disabled={selectedCount === 0}
              >
                Next <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </>
          )}

          {step === 'prompt' && (
            <>
              <Button variant="outline" onClick={() => setStep('select')}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button 
                onClick={() => setStep('confirm')}
                disabled={selectedPromptIds.length !== 1}
              >
                Continue <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </>
          )}

          {step === 'confirm' && (
            <>
              <Button variant="outline" onClick={() => setStep('prompt')}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <SpinnerButton
                onClick={handleSubmit}
                loading={postMutation.isPending}
              >
                <Check className="h-4 w-4 mr-2" />
                Create Variables
              </SpinnerButton>
            </>
          )}
      </DialogWrapper.Footer>
    </DialogWrapper>
  )
}

export default ProspectEnrichmentsDialog
