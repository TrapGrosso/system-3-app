import * as React from "react"
import { useState, useMemo } from "react"
import { Wand2, ArrowRight, ArrowLeft, Check } from "lucide-react"
import { useMutation } from '@tanstack/react-query'
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { DataTable } from "@/components/shared/table/DataTable"
import PromptMultiSelect from "@/components/shared/dialog/PromptMultiSelect"
import { useGetProspectEnrichments } from "@/api/variable-dialog/getProspectEnrichments"

// Utility to flatten enrichments data
const flattenEnrichments = (data) => {
  if (!data) return []
  
  return data.flatMap(prospect => [
    ...(prospect.prospectEnrichments || []).map(enrichment => ({
      ...enrichment,
      prospect_id: prospect.prospect_id,
      prospect_name: `${prospect.first_name} ${prospect.last_name}`,
      scope: 'prospect',
      type: enrichment.type || 'profile'
    })),
    ...(prospect.companyEnrichments || []).map(enrichment => ({
      ...enrichment,
      prospect_id: prospect.prospect_id,
      prospect_name: `${prospect.first_name} ${prospect.last_name}`,
      scope: 'company',
      type: enrichment.type || 'company_profile'
    }))
  ])
}

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
  const [selectedRowIds, setSelectedRowIds] = useState({})
  const [selectedPromptIds, setSelectedPromptIds] = useState([])
  const [promptFilterInput, setPromptFilterInput] = useState('')
  const [showPromptFilter, setShowPromptFilter] = useState(false)

  // Fetch enrichments data
  const { 
    data: enrichmentsData, 
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

  // Flatten enrichments for table
  const flattenedEnrichments = useMemo(() => 
    flattenEnrichments(enrichmentsData), 
    [enrichmentsData]
  )

  // Selected enrichments
  const selectedEnrichments = useMemo(() => 
    flattenedEnrichments.filter(enrichment => selectedRowIds[enrichment.id]),
    [flattenedEnrichments, selectedRowIds]
  )

  // Group selected enrichments by prospect
  const selectedByProspect = useMemo(() => {
    const grouped = new Map()
    selectedEnrichments.forEach(enrichment => {
      if (!grouped.has(enrichment.prospect_id)) {
        grouped.set(enrichment.prospect_id, [])
      }
      grouped.get(enrichment.prospect_id).push(enrichment.id)
    })
    return grouped
  }, [selectedEnrichments])

  // Table columns
  const columns = useMemo(() => [
    {
      accessorKey: 'scope',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant={row.original.scope === 'prospect' ? 'default' : 'secondary'}>
          {row.original.scope}
        </Badge>
      )
    },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: ({ row }) => row.original.source || '—'
    },
    {
      accessorKey: 'prompt',
      header: 'Prompt',
      cell: ({ row }) => row.original.prompt?.name || '—'
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => new Date(row.original.created_at).toLocaleString()
    },
    {
      accessorKey: 'prospect_name',
      header: 'Prospect',
      cell: ({ row }) => (
        <span className="truncate max-w-32" title={row.original.prospect_name}>
          {row.original.prospect_name}
        </span>
      )
    }
  ], [])

  // Bulk actions for table
  const bulkActions = [
    { label: 'Select All', value: 'all' },
    { label: 'Select Prospect-type', value: 'prospect' },
    { label: 'Select Company-type', value: 'company' },
    { label: 'Select by Prompt...', value: 'prompt' },
    'separator',
    { label: 'Clear Selection', value: 'clear', variant: 'destructive' }
  ]

  // Handle bulk actions
  const handleBulkAction = (action, selectedIds) => {
    switch (action) {
      case 'all':
        const allIds = {}
        flattenedEnrichments.forEach(e => { allIds[e.id] = true })
        setSelectedRowIds(allIds)
        break
      case 'prospect':
        const prospectIds = {}
        flattenedEnrichments.filter(e => e.scope === 'prospect').forEach(e => { prospectIds[e.id] = true })
        setSelectedRowIds(prev => ({ ...prev, ...prospectIds }))
        break
      case 'company':
        const companyIds = {}
        flattenedEnrichments.filter(e => e.scope === 'company').forEach(e => { companyIds[e.id] = true })
        setSelectedRowIds(prev => ({ ...prev, ...companyIds }))
        break
      case 'prompt':
        setShowPromptFilter(true)
        break
      case 'clear':
        setSelectedRowIds({})
        break
    }
  }

  // Handle prompt filter apply
  const handleApplyPromptFilter = () => {
    if (promptFilterInput.trim()) {
      const promptIds = {}
      flattenedEnrichments
        .filter(e => 
          e.prompt?.name?.toLowerCase().includes(promptFilterInput.toLowerCase()) &&
          e.type !== 'create_variable'
        )
        .forEach(e => { promptIds[e.id] = true })
      setSelectedRowIds(prev => ({ ...prev, ...promptIds }))
      setPromptFilterInput('')
      setShowPromptFilter(false)
    }
  }

  // Handle close dialog
  const handleClose = () => {
    setStep('select')
    setSelectedRowIds({})
    setSelectedPromptIds([])
    setPromptFilterInput('')
    setShowPromptFilter(false)
    onOpenChange?.(false)
  }

  // Handle submit
  const handleSubmit = () => {
    const payload = prospectIds.map(prospect_id => ({
      prospect_id,
      enrichment_ids: selectedByProspect.get(prospect_id) || [],
      prompt_ids: selectedPromptIds
    }))

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

  const selectedCount = Object.keys(selectedRowIds).length
  const selectedProspectCount = selectedByProspect.size

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Create Variables from Enrichments
          </DialogTitle>
          <DialogDescription>
            {step === 'select' && 'Select enrichments to create variables from'}
            {step === 'prompt' && 'Choose a prompt to process the selected enrichments'}
            {step === 'confirm' && 'Review your selection and confirm variable creation'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
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
              {showPromptFilter && (
                <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
                  <Label htmlFor="prompt-filter">Filter by prompt name:</Label>
                  <Input
                    id="prompt-filter"
                    value={promptFilterInput}
                    onChange={(e) => setPromptFilterInput(e.target.value)}
                    placeholder="Enter prompt name..."
                    className="w-64"
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyPromptFilter()}
                  />
                  <Button 
                    onClick={handleApplyPromptFilter}
                    disabled={!promptFilterInput.trim()}
                  >
                    Apply Filter
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPromptFilter(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
              
              <div className="flex-1 overflow-auto">
                <DataTable
                  columns={columns}
                  data={flattenedEnrichments}
                  rowId={(row) => row.id}
                  enableSelection={true}
                  bulkActions={bulkActions}
                  onBulkAction={handleBulkAction}
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
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Summary</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Enrichments</p>
                    <p className="font-medium">{selectedCount} selected</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Prospects</p>
                    <p className="font-medium">{selectedProspectCount} affected</p>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Selected Prompt</p>
                  <Badge>{selectedPromptIds.length > 0 ? 'Prompt selected' : 'No prompt selected'}</Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
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
              <Button 
                onClick={handleSubmit}
                disabled={postMutation.isPending}
              >
                {postMutation.isPending && <Spinner size="sm" className="mr-2" />}
                <Check className="h-4 w-4 mr-2" />
                Create Variables
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ProspectEnrichmentsDialog
