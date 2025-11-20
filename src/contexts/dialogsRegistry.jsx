import { Trash2 } from 'lucide-react'

// Import all dialog components
import {
  SubmitLeadsDialog,
  HandleGroupsDialog,
  ProspectEnrichmentsDialog,
  DeepSearchQueueDialog,
  DeleteDialog,
  ProspectNotesDialog,
  ProspectTasksDialog,
  ProspectVariablesDialog,
  UpdateCompanyDialog,
  UpdateProspectDialog,
  PromptSelectDialog,
  ResolveDeepSearchItem,
  UpdateTaskDialog,
  CreatePromptDialog,
  FindProspectEmailsDialog,
  RemoveFromGroupDialog,
  TaskFormDialog,
  UpdatePromptDialog,
  VerifyProspectEmailsDialog,
  ChangeCompanyDialog,
  N8nWarningsDialog,
  ExecuteCustomActionDialog
} from '@/components/dialogs'

import { PromptPreviewDialog } from '@/components/prompts'

const dialogsRegistry = {
  // Submit Leads Dialog
  submitLeads: {
    component: SubmitLeadsDialog,
    mapProps: ({ urls = [], isPending = false }, resolve) => ({
      urls,
      isPending,
      onConfirm: (result) => resolve(result)
    })
  },

  // Handle Groups Dialog
  handleGroups: {
    component: HandleGroupsDialog,
    mapProps: ({ user_id, prospect_ids = [], tab = 'add' }, resolve) => ({
      user_id,
      prospect_ids,
      tab,
      onSuccess: (data) => resolve(data)
    })
  },

  // Prospect Enrichments Dialog
  prospectEnrichments: {
    component: ProspectEnrichmentsDialog,
    mapProps: ({ user_id, prospectIds = [] }, resolve) => ({
      user_id,
      prospectIds,
      onSuccess: (data) => resolve(data)
    })
  },

  // Deep Search Queue Dialog
  deepSearchQueue: {
    component: DeepSearchQueueDialog,
    mapProps: ({ prospect_ids = [] }, resolve) => ({
      prospect_ids,
      onSuccess: () => resolve(true)
    })
  },

  // Confirm Dialog (uses DeleteDialog)
  confirm: {
    component: DeleteDialog,
    mapProps: ({ title, description, confirmLabel = 'Confirm', cancelLabel = 'Cancel', size = 'sm', isLoading = false, icon = <Trash2 className="h-5 w-5" /> }, resolve) => ({
      title,
      description,
      confirmLabel,
      cancelLabel,
      size,
      isLoading,
      icon,
      onConfirm: () => resolve(true)
    })
  },

  // Prospect Notes Dialog
  prospectNotes: {
    component: ProspectNotesDialog,
    mapProps: ({ prospect }, resolve) => ({
      prospect_id: prospect.linkedin_id,
      prospect_name: `${prospect.first_name} ${prospect.last_name}`.trim(),
      onSuccess: () => resolve(true)
    })
  },

  // Prospect Tasks Dialog
  prospectTasks: {
    component: ProspectTasksDialog,
    mapProps: ({ prospect }, resolve) => ({
      prospect_id: prospect.linkedin_id,
      prospect_name: `${prospect.first_name} ${prospect.last_name}`.trim(),
      onSuccess: () => resolve(true)
    })
  },

  // Prospect Variables Dialog
  prospectVariables: {
    component: ProspectVariablesDialog,
    mapProps: ({ prospect }, resolve) => ({
      prospect_id: prospect.linkedin_id,
      prospect_name: `${prospect.first_name} ${prospect.last_name}`.trim(),
      onSuccess: () => resolve(true)
    })
  },

  // Update Company Dialog
  updateCompany: {
    component: UpdateCompanyDialog,
    mapProps: ({ company }, resolve) => ({
      company,
      onSuccess: () => resolve(true)
    })
  },

  // Update Prospect Dialog
  updateProspect: {
    component: UpdateProspectDialog,
    mapProps: ({ prospect }, resolve) => ({
      prospect,
      onSuccess: () => resolve(true)
    })
  },

  // Prompt Select Dialog
  promptSelect: {
    component: PromptSelectDialog,
    mapProps: ({ queueItemIds = [], selectedCount, isUpdating = false }, resolve) => ({
      queueItemIds,
      selectedCount,
      isUpdating,
      // PromptSelectDialog doesn't have onSuccess, so we resolve when it closes
    })
  },

  // Resolve Deep Search Item Dialog
  resolveDeepSearchItem: {
    component: ResolveDeepSearchItem,
    mapProps: ({ queueIds = [] }, resolve) => ({
      queueIds,
      onSuccess: () => resolve(true)
    })
  },

  // Update Task Dialog
  updateTask: {
    component: UpdateTaskDialog,
    mapProps: ({ taskId, task }, resolve) => ({
      taskId,
      task,
      onSuccess: () => resolve(true)
    })
  },

  // Create Prompt Dialog
  createPrompt: {
    component: CreatePromptDialog,
    mapProps: ({}, resolve) => ({
      onSuccess: () => resolve(true)
    })
  },

  // Update Prompt Dialog
  updatePrompt: {
    component: UpdatePromptDialog,
    mapProps: ({ prompt }, resolve) => ({
      prompt,
      onSuccess: () => resolve(true)
    })
  },

  // Find Prospect Emails Dialog
  findProspectEmails: {
    component: FindProspectEmailsDialog,
    mapProps: ({ prospect_ids = [] }, resolve) => ({
      prospect_ids,
      onSuccess: (data) => resolve(data)
    })
  },

  // Verify Prospect Emails Dialog
  verifyProspectEmails: {
    component: VerifyProspectEmailsDialog,
    mapProps: ({ prospect_ids = [] }, resolve) => ({
      prospect_ids,
      onSuccess: (data) => resolve(data)
    })
  },

  // Remove from Group Dialog
  removeFromGroup: {
    component: RemoveFromGroupDialog,
    mapProps: ({ prospect }, resolve) => ({
      prospect_id: prospect.linkedin_id,
      prospect_name: `${prospect.first_name} ${prospect.last_name}`.trim(),
      onSuccess: () => resolve(true)
    })
  },

  // Change Company Dialog
  changeCompany: {
    component: ChangeCompanyDialog,
    mapProps: ({ prospectId }, resolve) => ({
      prospectId,
      onSuccess: () => resolve(true)
    })
  },

  // Task Form Dialog
  taskForm: {
    component: TaskFormDialog,
    mapProps: ({}, resolve) => ({
      // TaskFormDialog manages its own state, so we just resolve when it closes
      // This would need the dialog to be refactored to accept controlled props
    })
  },

  // N8n Warnings Dialog
  n8nWarnings: {
    component: N8nWarningsDialog,
    mapProps: ({ ignoreSignature = false }, resolve) => ({
      // DialogRenderer will pass open={true} and onOpenChange
      ignoreSignature,
      onSuccess: () => resolve(true)
    })
  },

  // Prompt Preview Dialog
  promptPreview: {
    component: PromptPreviewDialog,
    mapProps: ({ prompt }, resolve) => ({
      prompt
    })
  },

  // Execute Custom Action Dialog
  executeCustomAction: {
    component: ExecuteCustomActionDialog,
    mapProps: ({ action, mode, prospectIds = [] }, resolve) => ({
      action,
      mode,
      prospectIds,
      onSuccess: (data) => resolve(data ?? true)
    })
  }
}

export default dialogsRegistry
