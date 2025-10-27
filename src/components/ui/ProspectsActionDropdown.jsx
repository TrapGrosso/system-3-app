import * as React from "react"
import { MoreHorizontalIcon, ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useGetCustomActionAll } from "@/api/custom-actions/get/all"
import { useDialogs } from "@/contexts/DialogsContext"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { useDeleteProspects } from "@/api/prospect-context/deleteProspects"
import { useQueryClient } from '@tanstack/react-query'

/**
 * Central hub for all prospect actions with customizable trigger and automatic custom action fetching
 * 
 * @param {Object} props
 * @param {'single'|'bulk'} props.mode - Action mode: single for row actions, bulk for selection actions
 * @param {Object} [props.prospect] - Prospect data (required for single mode)
 * @param {string[]} [props.selectedIds] - Selected prospect IDs (required for bulk mode)
 * @param {Object} [props.includeTypes] - Control which action types to include
 * @param {boolean} [props.includeTypes.defaultSingle=true] - Include default single actions
 * @param {boolean} [props.includeTypes.defaultBulk=true] - Include default bulk actions
 * @param {boolean} [props.includeTypes.custom=true] - Include custom actions
 * @param {Object} [props.groupVisibility] - Control visibility of entire action groups
 * @param {boolean} [props.groupVisibility.single=true] - Show single default actions
 * @param {boolean} [props.groupVisibility.bulk=true] - Show bulk default actions
 * @param {boolean} [props.groupVisibility.custom=true] - Show custom actions
 * @param {Array} [props.additionalActions] - Additional actions to merge in
 * @param {string[]} [props.hideByName] - Hide actions by label/name
 * @param {string[]} [props.hideById] - Hide actions by id
 * @param {string[]} [props.onlyNames] - Only show actions with these names
 * @param {string[]} [props.order] - Custom order of action ids and separators
 * @param {React.ReactNode} [props.trigger] - Custom trigger element
 * @param {Object} [props.triggerProps] - Trigger button props when no custom trigger
 * @param {React.ComponentType} [props.triggerProps.icon] - Trigger icon component
 * @param {string} [props.triggerProps.variant] - Trigger button variant
 * @param {string} [props.triggerProps.size] - Trigger button size
 * @param {string} [props.triggerProps.className] - Trigger button className
 * @param {string} [props.triggerProps.children] - Trigger button children
 * @param {boolean} [props.triggerProps.disabled] - Trigger button disabled state
 * @param {Function} [props.onUpdateProspect] - Override update prospect handler
 * @param {Function} [props.onDeleteProspect] - Override delete prospect handler
 * @param {Function} [props.onAddNote] - Override add note handler
 * @param {Function} [props.onCreateTask] - Override create task handler
 * @param {Function} [props.onAddToGroupSingle] - Override add to group handler (single)
 * @param {Function} [props.onAddToDeepSearchSingle] - Override add to deep search handler (single)
 * @param {Function} [props.onCreateVariablesSingle] - Override create variables handler (single)
 * @param {Function} [props.onRemoveFromGroup] - Override remove from group handler
 * @param {Function} [props.onFindEmailSingle] - Override find email handler (single)
 * @param {Function} [props.onVerifyEmailSingle] - Override verify email handler (single)
 * @param {Function} [props.onDeleteProspectsBulk] - Override delete prospects handler (bulk)
 * @param {Function} [props.onAddToGroupBulk] - Override add to group handler (bulk)
 * @param {Function} [props.onAddToDeepSearchBulk] - Override add to deep search handler (bulk)
 * @param {Function} [props.onFindEmailsBulk] - Override find emails handler (bulk)
 * @param {Function} [props.onVerifyEmailsBulk] - Override verify emails handler (bulk)
 * @param {Function} [props.onCreateVariablesBulk] - Override create variables handler (bulk)
 * @param {Function} [props.onSendEmailBulk] - Override send email handler (bulk)
 * @param {Function} [props.onExportSelected] - Override export selected handler (bulk)
 * @param {Function} [props.onExecuteCustomAction] - Handler for custom action execution
 */
export function ProspectsActionDropdown({
  mode,
  prospect,
  selectedIds = [],
  includeTypes = { defaultSingle: true, defaultBulk: true, custom: true },
  groupVisibility = { single: true, bulk: true, custom: true },
  additionalActions = [],
  hideByName = [],
  hideById = [],
  onlyNames = [],
  order = [],
  trigger,
  triggerProps = {},
  // Handler overrides
  onUpdateProspect,
  onDeleteProspect,
  onAddNote,
  onCreateTask,
  onAddToGroupSingle,
  onAddToDeepSearchSingle,
  onCreateVariablesSingle,
  onRemoveFromGroup,
  onFindEmailSingle,
  onVerifyEmailSingle,
  onDeleteProspectsBulk,
  onAddToGroupBulk,
  onAddToDeepSearchBulk,
  onFindEmailsBulk,
  onVerifyEmailsBulk,
  onCreateVariablesBulk,
  onExecuteCustomAction,
}) {
  const { user } = useAuth()
  const userId = user?.id
  const queryClient = useQueryClient()
  const { data: customActionsData } = useGetCustomActionAll(userId)
  const {
    openHandleGroups,
    openProspectNotes,
    openProspectTasks,
    openProspectVariables,
    openDeepSearchQueue,
    openFindProspectEmails,
    openVerifyProspectEmails,
    openRemoveFromGroup,
    openUpdateProspect,
    openProspectEnrichments,
    confirm
  } = useDialogs()

  const { mutate: deleteProspectsMutate, isPending: isDeleting } = useDeleteProspects({
    onSuccess: (res) => {
      toast.success(res?.message || "Prospect(s) deleted")
      queryClient.invalidateQueries({ queryKey: ['prospects', userId] })
    },
    onError: (err) => toast.error(err.message || "Failed to delete prospect(s)")
  })

  // Build default single actions
  const defaultSingleActions = React.useMemo(() => {
    if (mode !== 'single' || !prospect) return []
    
    return [
      {
        id: 'update-prospect',
        label: 'Update prospect',
        onSelect: () => {
          if (onUpdateProspect) {
            onUpdateProspect(prospect)
          } else {
            openUpdateProspect({ prospect })
          }
        }
      },
      'separator',
      {
        id: 'add-note',
        label: 'Add note',
        onSelect: () => {
          if (onAddNote) {
            onAddNote(prospect)
          } else {
            openProspectNotes({ prospect })
          }
        }
      },
      {
        id: 'create-task',
        label: 'Create task',
        onSelect: () => {
          if (onCreateTask) {
            onCreateTask(prospect)
          } else {
            openProspectTasks({ prospect })
          }
        }
      },
      {
        id: 'find-email',
        label: 'Find email',
        onSelect: () => {
          if (onFindEmailSingle) {
            onFindEmailSingle(prospect.linkedin_id)
          } else {
            openFindProspectEmails({ prospect_ids: [prospect.linkedin_id] })
          }
        }
      },
      {
        id: 'verify-email',
        label: 'Verify email',
        onSelect: () => {
          if (onVerifyEmailSingle) {
            onVerifyEmailSingle(prospect.linkedin_id)
          } else {
            openVerifyProspectEmails({ prospect_ids: [prospect.linkedin_id] })
          }
        }
      },
      'separator',
      {
        id: 'add-to-group',
        label: 'Add to group',
        onSelect: () => {
          if (onAddToGroupSingle) {
            onAddToGroupSingle(prospect.linkedin_id)
          } else {
            openHandleGroups({ user_id: userId, prospect_ids: [prospect.linkedin_id], tab: 'add' })
          }
        }
      },
      {
        id: 'add-to-deep-search',
        label: 'Add to deep search queue',
        onSelect: () => {
          if (onAddToDeepSearchSingle) {
            onAddToDeepSearchSingle(prospect.linkedin_id)
          } else {
            openDeepSearchQueue({ prospect_ids: [prospect.linkedin_id] })
          }
        }
      },
      {
        id: 'create-variables',
        label: 'Create variables With AI',
        onSelect: () => {
          if (onCreateVariablesSingle) {
            onCreateVariablesSingle(prospect.linkedin_id)
          } else {
            openProspectEnrichments({ user_id: userId, prospectIds: [prospect.linkedin_id] })
          }
        }
      },
      'separator',
      {
        id: 'remove-from-group',
        label: 'Remove from group',
        variant: 'destructive',
        onSelect: () => {
          if (onRemoveFromGroup) {
            onRemoveFromGroup(prospect)
          } else {
            openRemoveFromGroup({ prospect })
          }
        }
      },
      {
        id: 'delete-prospect',
        label: 'Delete',
        variant: 'destructive',
        disabled: isDeleting,
        onSelect: async () => {
          if (onDeleteProspect) {
            onDeleteProspect(prospect)
          } else {
            const ok = await confirm({
              title: 'Delete prospect',
              description: `Delete ${prospect.first_name} ${prospect.last_name}?`,
              confirmLabel: 'Delete'
            })
            if (ok) {
              deleteProspectsMutate({ user_id: userId, prospect_ids: [prospect.linkedin_id] })
            }
          }
        }
      }
    ]
  }, [
    mode, prospect, userId, onUpdateProspect, onDeleteProspect, onAddNote, onCreateTask,
    onAddToGroupSingle, onAddToDeepSearchSingle, onCreateVariablesSingle, onRemoveFromGroup,
    onFindEmailSingle, onVerifyEmailSingle, confirm, openHandleGroups,
    openProspectNotes, openProspectTasks, openProspectVariables, openDeepSearchQueue,
    openFindProspectEmails, openVerifyProspectEmails, openRemoveFromGroup, openUpdateProspect,
    isDeleting, deleteProspectsMutate
  ])

  // Build default bulk actions
  const defaultBulkActions = React.useMemo(() => {
    if (mode !== 'bulk') return []
    
    return [
      {
        id: 'add-to-group-bulk',
        label: 'Add to Group',
        onSelect: (selectedIds) => {
          if (onAddToGroupBulk) {
            onAddToGroupBulk(selectedIds)
          } else {
            openHandleGroups({ user_id: userId, prospect_ids: selectedIds, tab: 'add' })
          }
        }
      },
      {
        id: 'add-to-deep-search-bulk',
        label: 'Add to Deep Search Queue',
        onSelect: (selectedIds) => {
          if (onAddToDeepSearchBulk) {
            onAddToDeepSearchBulk(selectedIds)
          } else {
            openDeepSearchQueue({ prospect_ids: selectedIds })
          }
        }
      },
      {
        id: 'find-emails-bulk',
        label: 'Find Emails',
        onSelect: (selectedIds) => {
          if (onFindEmailsBulk) {
            onFindEmailsBulk(selectedIds)
          } else {
            openFindProspectEmails({ prospect_ids: selectedIds })
          }
        }
      },
      {
        id: 'create-variables-bulk',
        label: 'Create Variables With AI',
        onSelect: (selectedIds) => {
          if (onCreateVariablesBulk) {
            onCreateVariablesBulk(selectedIds)
          } else {
            openProspectEnrichments({ user_id: userId, prospectIds: selectedIds })
          }
        }
      },
      {
        id: 'verify-emails-bulk',
        label: 'Verify Emails',
        onSelect: (selectedIds) => {
          if (onVerifyEmailsBulk) {
            onVerifyEmailsBulk(selectedIds)
          } else {
            openVerifyProspectEmails({ prospect_ids: selectedIds })
          }
        }
      },
      'separator',
      {
        id: 'delete-selected',
        label: 'Delete Selected',
        variant: 'destructive',
        disabled: isDeleting,
        onSelect: async (selectedIds) => {
          if (onDeleteProspectsBulk) {
            onDeleteProspectsBulk(selectedIds)
          } else {
            const ok = await confirm({
              title: 'Delete prospects',
              description: `Delete ${selectedIds.length} selected prospects?`,
              confirmLabel: 'Delete'
            })
            if (ok) {
              deleteProspectsMutate({ user_id: userId, prospect_ids: selectedIds })
            }
          }
        }
      }
    ]
  }, [
    mode, userId, onAddToGroupBulk, onAddToDeepSearchBulk, onFindEmailsBulk, onCreateVariablesBulk,
    onVerifyEmailsBulk, onDeleteProspectsBulk,
    confirm, openHandleGroups, openDeepSearchQueue, openFindProspectEmails, openVerifyProspectEmails,
    isDeleting, deleteProspectsMutate
  ])

  // Filter and map custom actions
  const filteredCustomActions = React.useMemo(() => {
    if (!includeTypes.custom || !groupVisibility.custom || mode === 'single' || mode === 'bulk') {
      const executionModes = mode === 'single' 
        ? ['single', 'both'] 
        : mode === 'bulk' 
          ? ['bulk', 'both'] 
          : []
      
      return (customActionsData || [])
        .filter(action => 
          action.is_active && 
          executionModes.includes(action.execution_mode)
        )
        .map(action => ({
          id: `custom-${action.id}`,
          label: action.name,
          description: action.description,
          onSelect: () => {
            if (onExecuteCustomAction) {
              onExecuteCustomAction({
                action,
                mode,
                prospect: mode === 'single' ? prospect : undefined,
                selectedIds: mode === 'bulk' ? selectedIds : undefined
              })
            } else {
              toast.info(`Custom action "${action.name}" executed`)
            }
          }
        }))
    }
    return []
  }, [customActionsData, mode, prospect, selectedIds, includeTypes.custom, groupVisibility.custom, onExecuteCustomAction])

  // Merge all actions
  const allActions = React.useMemo(() => {
    let actions = []
    
    // Add default actions based on mode and visibility
    if (mode === 'single' && includeTypes.defaultSingle && groupVisibility.single) {
      actions = [...defaultSingleActions]
    } else if (mode === 'bulk' && includeTypes.defaultBulk && groupVisibility.bulk) {
      actions = [...defaultBulkActions]
    }
    
    // Add custom actions
    if (includeTypes.custom && groupVisibility.custom) {
      actions.push(...filteredCustomActions)
    }
    
    // Add additional actions
    actions.push(...additionalActions)
    
    // Apply filters
    if (hideByName.length > 0) {
      actions = actions.filter(action => 
        action === 'separator' || !hideByName.some(name => 
          action.label?.toLowerCase().includes(name.toLowerCase())
        )
      )
    }
    
    if (hideById.length > 0) {
      actions = actions.filter(action => 
        action === 'separator' || !hideById.includes(action.id)
      )
    }
    
    if (onlyNames.length > 0) {
      actions = actions.filter(action => 
        action === 'separator' || onlyNames.some(name => 
          action.label?.toLowerCase().includes(name.toLowerCase())
        )
      )
    }
    
    // Apply custom order
    if (order.length > 0) {
      const orderMap = {}
      order.forEach((id, index) => {
        if (id !== 'separator') {
          orderMap[id] = index
        }
      })
      
      actions.sort((a, b) => {
        if (a === 'separator' || b === 'separator') return 0
        
        const aIndex = orderMap[a.id] !== undefined ? orderMap[a.id] : Infinity
        const bIndex = orderMap[b.id] !== undefined ? orderMap[b.id] : Infinity
        
        return aIndex - bIndex
      })
    }
    
    return actions
  }, [
    mode, 
    defaultSingleActions, 
    defaultBulkActions, 
    filteredCustomActions, 
    additionalActions,
    hideByName, 
    hideById, 
    onlyNames, 
    order,
    includeTypes, 
    groupVisibility
  ])

  // Render trigger
  const renderTrigger = () => {
    if (trigger) {
      return trigger
    }
    
    const {
      icon: TriggerIcon = mode === 'single' ? MoreHorizontalIcon : ChevronDownIcon,
      variant = mode === 'single' ? 'ghost' : 'outline',
      size = 'sm',
      className = '',
      children,
      disabled = mode === 'bulk' && selectedIds.length === 0,
      ...restProps
    } = triggerProps
    
    if (mode === 'single') {
      return (
        <Button
          variant={variant}
          size={size}
          className={`h-8 w-8 p-0 ${className}`}
          disabled={disabled}
          {...restProps}
        >
          <span className="sr-only">Open menu</span>
          {children || <TriggerIcon className="h-4 w-4" />}
        </Button>
      )
    } else {
      return (
        <Button
          variant={variant}
          size={size}
          disabled={disabled}
          className={className}
          {...restProps}
        >
          {children || `Selected (${selectedIds.length})`}
          <TriggerIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    }
  }

  if (allActions.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {renderTrigger()}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {allActions.map((action, index) => {
          // Handle separator
          if (action === 'separator') {
            return <DropdownMenuSeparator key={`separator-${index}`} />
          }
          
          // Handle action item
          const {
            id = `action-${index}`,
            label,
            onSelect,
            icon: ItemIcon,
            variant = 'default',
            disabled = false,
            description
          } = action
          
          return (
            <DropdownMenuItem
              key={id}
              variant={variant}
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation()
                if (onSelect && !disabled) {
                  if (mode === 'single') {
                    onSelect(prospect)
                  } else if (mode === 'bulk') {
                    onSelect(selectedIds)
                  }
                }
              }}
            >
              {ItemIcon && <ItemIcon className="h-4 w-4 mr-2" />}
              <div>
                <div>{label}</div>
                {description && (
                  <div className="text-xs text-muted-foreground mt-1">{description}</div>
                )}
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
