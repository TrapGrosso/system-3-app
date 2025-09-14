import * as React from "react"
import { forwardRef, useImperativeHandle, useEffect, useMemo, useRef, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { AlertTriangle, Info, OctagonAlert } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import DialogWrapper from "@/components/shared/dialog/DialogWrapper"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"

// Helper to fetch unseen warnings
const fetchUnseenWarnings = async () => {
  const params = new URLSearchParams({
    include_seen: "false"
  })

  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/getN8nWarnings?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch n8n warnings')
  }

  const result = await response.json()
  return result || []
}

// Helper to update warnings as seen
const updateN8nWarnings = async (payload) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/updateN8nWarnings`, {
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

// Helper to compute a signature for a list of warning IDs
const computeSignature = (ids) => {
  return JSON.stringify([...ids].sort())
}

// Helper to get stored signature
const getStoredSignature = (key) => {
  try {
    return localStorage.getItem(key)
  } catch (e) {
    return null
  }
}

// Helper to set stored signature
const setStoredSignature = (key, signature) => {
  try {
    localStorage.setItem(key, signature)
  } catch (e) {
    // Ignore storage errors
  }
}

const N8nWarningsDialog = forwardRef(({ 
  open: controlledOpen,
  onOpenChange,
  initialOpen = true,
  storageKey = "n8n-warnings:last-signature",
  ignoreSignature = false,
  onSuccess
}, ref) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen
  const [selected, setSelected] = useState(new Set())
  const hasOpenedThisBootRef = useRef(false)
  const lastSignatureRef = useRef(null)
  const queryClient = useQueryClient()
  
  // Fetch unseen warnings
  const { data: warnings = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['n8n-warnings', 'unseen'],
    queryFn: fetchUnseenWarnings,
    staleTime: 30000, // 30 seconds
    cacheTime: 300000, // 5 minutes
    refetchInterval: 60000, // Refetch every minute
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  // Mutation to mark warnings as seen
  const { mutate: markAsSeen, isPending: isMarkingAsSeen } = useMutation({
    mutationFn: updateN8nWarnings,
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['n8n-warnings', 'unseen'] })
      
      // Clear selection
      setSelected(new Set())
      
      // Show success message
      toast.success(`Marked ${data.data.updated_count} warning(s) as seen`)
    },
    onError: (error) => {
      console.error('Error marking warnings as seen:', error)
      toast.error('Failed to mark warnings as seen. Please try again.')
    },
  })

  // Compute signature of current warnings
  const currentSignature = useMemo(() => {
    return computeSignature(warnings.map(w => w.id))
  }, [warnings])

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    openOnce: () => {
      // Only open if we haven't opened this boot and there are warnings
      if (!hasOpenedThisBootRef.current && warnings.length > 0) {
        const storedSignature = getStoredSignature(storageKey)
        
        // Only open if signature is different from stored (unless ignoring signature)
        if (ignoreSignature || storedSignature !== currentSignature) {
          setOpen(true)
          hasOpenedThisBootRef.current = true
          lastSignatureRef.current = currentSignature
        }
      }
    },
    resetOpenOnce: () => {
      hasOpenedThisBootRef.current = false
    },
    suppressForSignature: (signature) => {
      const sig = signature || currentSignature
      setStoredSignature(storageKey, sig)
    }
  }))

  // Handle auto-open on mount if initialOpen is true and component is uncontrolled
  useEffect(() => {
    const isControlled = controlledOpen !== undefined
    if (!isControlled && initialOpen && warnings.length > 0) {
      const storedSignature = getStoredSignature(storageKey)
      
      // Only open if signature is different from stored (unless ignoring signature)
      if (ignoreSignature || storedSignature !== currentSignature) {
        setOpen(true)
        hasOpenedThisBootRef.current = true
        lastSignatureRef.current = currentSignature
      }
    }
  }, [initialOpen, warnings.length, currentSignature, storageKey, controlledOpen, ignoreSignature])

  // Handle selection
  const toggleSelectAll = () => {
    if (selected.size === warnings.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(warnings.map(w => w.id)))
    }
  }

  const toggleSelect = (id) => {
    const newSelected = new Set(selected)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelected(newSelected)
  }

  // Handle mark as seen
  const handleMarkAsSeen = () => {
    if (selected.size === 0) return
    
    markAsSeen({
      warning_ids: Array.from(selected).map(String)
    })
  }

  // Handle dialog close
  const handleClose = () => {
    setOpen(false)
    // Persist signature so we don't show the same warnings again
    setStoredSignature(storageKey, currentSignature)
  }

  // Render severity badge
  const renderSeverityBadge = (level) => {
    switch (level) {
      case 'fatal':
        return <Badge variant="destructive">FATAL</Badge>
      case 'warning':
        return <Badge className="bg-amber-500 text-white hover:bg-amber-500/90">WARNING</Badge>
      case 'info':
        return <Badge variant="secondary">INFO</Badge>
      default:
        return <Badge variant="secondary">{level.toUpperCase()}</Badge>
    }
  }

  // Render severity icon
  const renderSeverityIcon = (level) => {
    switch (level) {
      case 'fatal':
        return <OctagonAlert className="h-4 w-4 text-destructive" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <DialogWrapper
        open={open}
        onOpenChange={setOpen}
        title="Workflow Warnings"
        description="Checking for workflow warnings..."
        size="lg"
      >
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="rounded-lg border p-3">
              <div className="flex items-start gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="flex items-center justify-between rounded-md border p-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </DialogWrapper>
    )
  }

  // Error state
  if (isError) {
    return (
      <DialogWrapper
        open={open}
        onOpenChange={setOpen}
        title="Workflow Warnings"
        description="Failed to load workflow warnings"
        size="lg"
      >
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <p className="mt-2 text-sm text-destructive">Failed to load workflow warnings</p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </div>
        <div className="flex items-center justify-between rounded-md border p-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">0 selected</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogWrapper>
    )
  }

  // Empty state
  if (warnings.length === 0) {
    return (
      <DialogWrapper
        open={open}
        onOpenChange={setOpen}
        title="Workflow Warnings"
        description="No workflow warnings to display"
        size="lg"
      >
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Info className="h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">No workflow warnings to display</p>
        </div>
        <div className="flex items-center justify-between rounded-md border p-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">0 selected</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogWrapper>
    )
  }

  return (
    <DialogWrapper
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          handleClose()
        } else {
          setOpen(newOpen)
        }
      }}
      title="Workflow Warnings"
      description="The following n8n executions reported warnings. Review and mark as seen."
      size="lg"
    >
      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {warnings.map((warning) => (
          <Card 
            key={warning.id} 
            className={`
              group flex items-start gap-3 rounded-lg border p-3 shadow-sm transition-all
              hover:shadow-md hover:bg-accent/40
              ${selected.has(warning.id) ? 'ring-1 ring-primary/50' : ''}
            `}
          >
            <Checkbox
              checked={selected.has(warning.id)}
              onCheckedChange={() => toggleSelect(warning.id)}
              className="mt-0.5"
            />
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                {renderSeverityBadge(warning.level)}
                <span className="font-medium truncate">{warning.workflow_name}</span>
                <span className="text-muted-foreground text-sm truncate">• {warning.node_name}</span>
              </div>
              <p className="text-sm">{warning.error_message}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{new Date(warning.failed_at).toLocaleString()}</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              {renderSeverityIcon(warning.level)}
            </div>
          </Card>
        ))}
      </div>
      
      <Separator className="my-3" />
      
      <div className="flex items-center justify-between rounded-md border p-2">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selected.size === warnings.length}
            onCheckedChange={toggleSelectAll}
          />
          <span className="text-sm text-muted-foreground">
            {selected.size} of {warnings.length} selected
          </span>
        </div>
        <div className="flex gap-2">
          <SpinnerButton
            onClick={handleMarkAsSeen}
            loading={isMarkingAsSeen}
            disabled={selected.size === 0 || isMarkingAsSeen}
          >
            Mark Selected as Seen
          </SpinnerButton>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </div>
      </div>
    </DialogWrapper>
  )
})

N8nWarningsDialog.displayName = "N8nWarningsDialog"

export default N8nWarningsDialog
