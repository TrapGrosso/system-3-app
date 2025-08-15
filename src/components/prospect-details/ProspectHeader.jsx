import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ActionDropdown } from '@/components/shared/ui/ActionDropdown'
import { 
  MailIcon,
  CopyIcon,
  MoreHorizontalIcon, 
  PencilIcon, 
  TrashIcon, 
  MessageSquareIcon, 
  CheckSquareIcon, 
  TargetIcon, 
  SearchIcon, 
  UsersIcon,
  EditIcon,
  XIcon,
  Settings,
  Wand2
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge as UIBadge } from '@/components/ui/badge'
import { Button as UIButton } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Tooltip as UITooltip, TooltipTrigger as UITooltipTrigger, TooltipContent as UITooltipContent } from '@/components/ui/tooltip'

const formatDate = (ts) => ts ? new Date(ts).toLocaleString() : "—"
const emailStatusVariant = (s) => ({ valid: "default", not_found: "destructive" }[s?.toLowerCase()] || "outline")
const verificationStatusVariant = (s) => ({ valid: "default", invalid: "destructive" }[s?.toLowerCase()] || "secondary")
const safeToSendVariant = (s) => s === "yes" ? "default" : s === "no" ? "destructive" : "outline"

const normalizeEmailStatus = (s) => {
  const val = s?.toLowerCase()
  if (["verified", "valid"].includes(val)) return "valid"
  if (val === "not_found") return "not_found"
  if (val === "invalid") return "invalid"
  return "unknown"
}
const normalizeVerificationStatus = (s) => {
  const val = s?.toLowerCase()
  if (["deliverable", "valid"].includes(val)) return "valid"
  if (["undeliverable", "invalid", "rejected"].includes(val)) return "invalid"
  return "unknown"
}
const getLatestVerification = (vs) => {
  if (!Array.isArray(vs) || !vs.length) return null
  return [...vs].sort((a, b) => new Date(b.verified_on || b.created_at) - new Date(a.verified_on || a.created_at))[0]
}
import DeleteDialog from '@/components/dialogs/DeleteDialog'
import useDeleteDialog from '@/components/shared/dialog/useDeleteDialog'
import { useProspects } from '@/contexts/ProspectsContext'
import { useDeepSearchQueue } from '@/contexts/DeepSearchQueueContext'

export default function ProspectHeader({ 
  prospect, 
  deepSearch, 
  onUpdateProspect, 
  onUpdateQueuePrompt, 
  onResolveDeepSearchItem,
  onAddNote, 
  onCreateTask, 
  onAddToCampaign, 
  onAddToDeepResearch, 
  onAddToGroup,
  onCreateVariables,
  onRefetch
}) {
  const navigate = useNavigate()
  const { deleteProspect } = useProspects()
  const { deleteProspects: deleteQueueItem } = useDeepSearchQueue()

  const {
    openDialog: openDeleteProspectDialog,
    DeleteDialogProps: deleteProspectDialogProps
  } = useDeleteDialog(
    async () => {
      await deleteProspect(prospect.linkedin_id)
      navigate('/dashboard')
    }
  )

  const {
    openDialog: openRemoveQueueDialog,
    DeleteDialogProps: removeQueueDialogProps
  } = useDeleteDialog(
    async () => {
      await deleteQueueItem(deepSearch.queue_id)
      onRefetch?.()
    }
  )

  if (!prospect) return null

  const { first_name, last_name, headline, status, location, linkedin_id, email } = prospect
  
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'new':
        return 'default'
      case 'contacted':
        return 'secondary'
      case 'qualified':
        return 'default'
      default:
        return 'outline'
    }
  }

  const actions = [
    {
      id: 'update-prospect',
      label: 'Update prospect',
      icon: PencilIcon,
      onSelect: onUpdateProspect
    },
    {
      id: 'delete-prospect',
      label: 'Delete prospect',
      icon: TrashIcon,
      onSelect: openDeleteProspectDialog,
      variant: 'destructive'
    },
    'separator',
    ...(deepSearch?.is_in_queue ? [
      {
        id: 'resolve-deepsearch-item',
        label: 'Resolve deep search item',
        icon: Settings,
        onSelect: onResolveDeepSearchItem
      },
      {
        id: 'update-deepsearch-prompt',
        label: 'Update deep search queue prompt',
        icon: EditIcon,
        onSelect: onUpdateQueuePrompt
      },
      {
        id: 'remove-from-deepsearch-queue',
        label: 'Remove from deepsearch queue',
        icon: XIcon,
        onSelect: openRemoveQueueDialog,
        variant: 'destructive'
      },
      'separator'
    ] : []),
    {
      id: 'add-note',
      label: 'Add note',
      icon: MessageSquareIcon,
      onSelect: onAddNote
    },
    {
      id: 'create-task',
      label: 'Create task',
      icon: CheckSquareIcon,
      onSelect: onCreateTask
    },
    {
      id: 'add-to-campaign',
      label: 'Add to campaign',
      icon: TargetIcon,
      onSelect: onAddToCampaign
    },
    {
      id: 'add-to-deep-research',
      label: deepSearch?.is_in_queue ? 'Already in deep research queue' : 'Add to deep research queue',
      icon: SearchIcon,
      onSelect: deepSearch?.is_in_queue 
        ? () => toast.info('Prospect already queued for deep research')
        : onAddToDeepResearch,
      variant: deepSearch?.is_in_queue ? 'secondary' : undefined
    },
    {
      id: 'add-to-group',
      label: 'Add to group',
      icon: UsersIcon,
      onSelect: onAddToGroup
    },
    {
      id: 'create-variables',
      label: 'Create variables With AI',
      icon: Wand2,
      onSelect: onCreateVariables
    }
  ]

  return (
    <Card className="mx-4 lg:mx-6 mb-6">
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">
              {getInitials(first_name, last_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <CardTitle className="text-2xl">
                {first_name} {last_name}
              </CardTitle>
              <Badge variant={getStatusVariant(status)}>
                {status}
              </Badge>
              {deepSearch?.is_in_queue && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 cursor-help">
                      Deep research queued
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1">
                      <p className="font-medium">Queued prompts:</p>
                      {deepSearch.prompts?.map((prompt, index) => (
                        <p key={prompt.id || index} className="text-sm">
                          • {prompt.name}
                        </p>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            
            {email?.email ? (
              <div className="flex items-center gap-2 flex-wrap text-sm mb-2">
                <div className="flex items-center gap-1 min-w-0">
                  <MailIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <a href={`mailto:${email.email}`} className="truncate text-primary hover:underline" title={email.email}>
                    {email.email}
                  </a>
                  <UIButton variant="ghost" size="icon" className="h-6 w-6" onClick={() => { navigator.clipboard.writeText(email.email); toast.success('Copied email') }}>
                    <CopyIcon className="w-3 h-3" />
                  </UIButton>
                </div>
                <UIBadge variant={emailStatusVariant(normalizeEmailStatus(email.status))}>
                  {normalizeEmailStatus(email.status)}
                </UIBadge>
                {getLatestVerification(email.verifications) && (
                  <>
                    <UIBadge variant={safeToSendVariant(getLatestVerification(email.verifications).safe_to_send)}>
                      Safe: {getLatestVerification(email.verifications).safe_to_send}
                    </UIBadge>
                    <span className="text-xs text-muted-foreground">
                      Last verified: {formatDate(getLatestVerification(email.verifications).verified_on)}
                    </span>
                  </>
                )}
                {Array.isArray(email.verifications) && email.verifications.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <UIButton variant="outline" size="sm">Verifications ({email.verifications.length})</UIButton>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-[min(90vw,500px)]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Status</TableHead>
                            <TableHead>Safe</TableHead>
                            <TableHead>Verified On</TableHead>
                            <TableHead>Flags</TableHead>
                            <TableHead>Bounce</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {email.verifications
                            .sort((a,b) => new Date(b.verified_on || b.created_at) - new Date(a.verified_on || a.created_at))
                            .slice(0,5)
                            .map(v => (
                            <TableRow key={v.id}>
                              <TableCell><UIBadge variant={verificationStatusVariant(normalizeVerificationStatus(v.verification_status))}>{normalizeVerificationStatus(v.verification_status)}</UIBadge></TableCell>
                              <TableCell><UIBadge variant={safeToSendVariant(v.safe_to_send)}>{v.safe_to_send}</UIBadge></TableCell>
                              <TableCell>{formatDate(v.verified_on)}</TableCell>
                              <TableCell className="flex flex-wrap gap-1">
                                {["disposable","free","role","gibberish"].map(flag => v[flag] === "yes" && (
                                  <UIBadge key={flag} variant="secondary">{flag}</UIBadge>
                                ))}
                              </TableCell>
                              <TableCell>{v.bounce_type || "—"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {email.verifications.length > 5 && (
                        <div className="mt-2 text-xs text-muted-foreground">Showing 5 of {email.verifications.length} records</div>
                      )}
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            ) : (
              <CardDescription className="text-sm text-muted-foreground mb-2">No email found</CardDescription>
            )}

            {headline && (
              <CardDescription className="text-base mb-2">
                {headline}
              </CardDescription>
            )}
            
            {location && (
              <CardDescription className="text-sm text-muted-foreground">
                📍 {location}
              </CardDescription>
            )}
          </div>

          <div className="flex gap-2">
            <ActionDropdown
              items={actions}
              triggerProps={{
                variant: "outline",
                size: "sm",
                icon: MoreHorizontalIcon,
                className: "justify-between"
              }}
              align="end"
              side="bottom"
            />
          </div>
        </div>
      </CardHeader>

      <DeleteDialog
        {...deleteProspectDialogProps}
        title="Delete prospect"
        itemName={`${first_name} ${last_name}`}
      />

      {deepSearch?.is_in_queue && (
        <DeleteDialog
          {...removeQueueDialogProps}
          title="Remove from deep search queue"
          description="The prospect will be removed from the deep-search queue. Continue?"
          confirmLabel="Remove"
        />
      )}
    </Card>
  )
}
