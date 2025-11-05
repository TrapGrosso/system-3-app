import React, { createContext, useContext, useState, useCallback } from 'react'

const DialogsContext = createContext(null)

export function DialogsProvider({ children }) {
  const [activeDialog, setActiveDialog] = useState(null)

  const open = useCallback((type, payload = {}, options = {}) => {
    return new Promise((resolve) => {
      setActiveDialog({
        type,
        payload,
        options,
        resolve
      })
    })
  }, [])

  const close = useCallback((result = null) => {
    if (activeDialog?.resolve) {
      activeDialog.resolve(result)
    }
    setActiveDialog(null)
  }, [activeDialog])

  const confirm = useCallback(({
    title = 'Confirm Action',
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    size = 'sm',
    icon,
    isLoading = false
  }) => {
    return open('confirm', {
      title,
      description,
      confirmLabel,
      cancelLabel,
      size,
      icon,
      isLoading
    })
  }, [open])

  // Convenience helpers for commonly used dialogs
  const openHandleGroups = useCallback(({ user_id, prospect_ids = [], tab = 'add' }) => {
    return open('handleGroups', { user_id, prospect_ids, tab })
  }, [open])

  const openProspectNotes = useCallback(({ prospect }) => {
    return open('prospectNotes', { prospect })
  }, [open])

  const openProspectTasks = useCallback(({ prospect }) => {
    return open('prospectTasks', { prospect })
  }, [open])

  const openProspectVariables = useCallback(({ prospect }) => {
    return open('prospectVariables', { prospect })
  }, [open])


  const openDeepSearchQueue = useCallback(({ prospect_ids }) => {
    return open('deepSearchQueue', { prospect_ids })
  }, [open])

  const openProspectEnrichments = useCallback(({ user_id, prospectIds }) => {
    return open('prospectEnrichments', { user_id, prospectIds })
  }, [open])

  const openFindProspectEmails = useCallback(({ prospect_ids }) => {
    return open('findProspectEmails', { prospect_ids })
  }, [open])

  const openVerifyProspectEmails = useCallback(({ prospect_ids }) => {
    return open('verifyProspectEmails', { prospect_ids })
  }, [open])

  const openRemoveFromGroup = useCallback(({ prospect }) => {
    return open('removeFromGroup', { prospect })
  }, [open])

  const openUpdateCompany = useCallback(({ company }) => {
    return open('updateCompany', { company })
  }, [open])

  const openUpdateProspect = useCallback(({ prospect }) => {
    return open('updateProspect', { prospect })
  }, [open])

  const openUpdateTask = useCallback(({ taskId, task }) => {
    return open('updateTask', { taskId, task })
  }, [open])

  const openCreatePrompt = useCallback(() => {
    return open('createPrompt', {})
  }, [open])

  const openUpdatePrompt = useCallback(({ prompt }) => {
    return open('updatePrompt', { prompt })
  }, [open])

  const openChangeCompany = useCallback(({ prospectId }) => {
    return open('changeCompany', { prospectId })
  }, [open])

  const openSubmitLeads = useCallback(({ urls = [], isPending = false }) => {
    return open('submitLeads', { urls, isPending })
  }, [open])

  const openPromptSelect = useCallback(({ queueItemIds = [], selectedCount, isUpdating = false }) => {
    return open('promptSelect', { queueItemIds, selectedCount, isUpdating })
  }, [open])

  const openResolveDeepSearchItem = useCallback(({ queueIds = [] }) => {
    return open('resolveDeepSearchItem', { queueIds })
  }, [open])

  const openN8nWarnings = useCallback(({ ignoreSignature = false } = {}) => {
    return open('n8nWarnings', { ignoreSignature })
  }, [open])

  const openPromptPreview = useCallback(({ prompt }) => {
    return open('promptPreview', { prompt })
  }, [open])

  const value = {
    activeDialog,
    open,
    close,
    confirm,
    // Convenience helpers
    openHandleGroups,
    openProspectNotes,
    openProspectTasks,
    openProspectVariables,
    openDeepSearchQueue,
    openProspectEnrichments,
    openFindProspectEmails,
    openVerifyProspectEmails,
    openRemoveFromGroup,
    openUpdateCompany,
    openUpdateProspect,
    openUpdateTask,
    openCreatePrompt,
    openUpdatePrompt,
    openChangeCompany,
    openSubmitLeads,
    openPromptSelect,
    openResolveDeepSearchItem,
    openN8nWarnings,
    openPromptPreview
  }

  return (
    <DialogsContext.Provider value={value}>
      {children}
      <DialogRenderer />
    </DialogsContext.Provider>
  )
}

export function useDialogs() {
  const context = useContext(DialogsContext)
  if (!context) {
    throw new Error('useDialogs must be used within a DialogsProvider')
  }
  return context
}

// Dialog renderer component
function DialogRenderer() {
  const { activeDialog, close } = useDialogs()
  const [registry, setRegistry] = React.useState(null)

  React.useEffect(() => {
    let mounted = true
    import('./dialogsRegistry').then(m => {
      if (mounted) setRegistry(m.default)
    })
    return () => { mounted = false }
  }, [])

  if (!activeDialog || !registry) return null

  const { type, payload, resolve } = activeDialog

  const dialogConfig = registry[type]
  if (!dialogConfig) {
    console.error(`Dialog type "${type}" not found in registry`)
    return null
  }

  const { component: Component, mapProps } = dialogConfig

  const handleOpenChange = (open) => {
    if (!open) {
      // Dialog is closing - resolve with null if not already resolved
      close(null)
    }
  }

  const mappedProps = mapProps(payload, resolve)

  return (
    <Component
      {...mappedProps}
      open={true}
      onOpenChange={handleOpenChange}
    />
  )
}
