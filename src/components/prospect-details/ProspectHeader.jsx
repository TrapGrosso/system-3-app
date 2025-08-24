import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
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
  Wand2,
  MapPinIcon,
  ShieldCheckIcon,
  ShieldAlertIcon,
  AlertTriangleIcon
} from 'lucide-react'
import { toast } from 'sonner'
import { useProspects } from '@/contexts/ProspectsContext'
import { useDeepSearchQueue } from '@/contexts/DeepSearchQueueContext'
import { useDialogs } from '@/contexts/DialogsContext'

// Utility functions
const formatDate = (ts) => ts ? new Date(ts).toLocaleString() : "—"

const getEmailStatusConfig = (status) => {
  const normalized = status?.toLowerCase()
  if (["verified", "valid"].includes(normalized)) {
    return { variant: "default", label: "Valid", icon: ShieldCheckIcon }
  }
  if (normalized === "not_found") {
    return { variant: "destructive", label: "Not Found", icon: AlertTriangleIcon }
  }
  if (normalized === "invalid") {
    return { variant: "destructive", label: "Invalid", icon: ShieldAlertIcon }
  }
  return { variant: "outline", label: status, icon: AlertTriangleIcon }
}

const getSafeToSendConfig = (safe) => {
  if (safe.toLowerCase() === "yes") {
    return { variant: "default", label: "Safe to Send", icon: ShieldCheckIcon }
  }
  if (safe.toLowerCase() === "no") {
    return { variant: "destructive", label: "Not Safe", icon: ShieldAlertIcon }
  }
  return { variant: "outline", label: safe.toLowerCase(), icon: AlertTriangleIcon }
}

const getStatusConfig = (status) => {
  switch (status?.toLowerCase()) {
    case 'new':
      return { variant: 'default', label: 'New' }
    case 'contacted':
      return { variant: 'secondary', label: 'Contacted' }
    case 'qualified':
      return { variant: 'default', label: 'Qualified' }
    default:
      return { variant: 'outline', label: status || 'Unknown' }
  }
}

const getLatestVerification = (verifications) => {
  if (!Array.isArray(verifications) || !verifications.length) return null
  return [...verifications].sort((a, b) => 
    new Date(b.verified_on || b.created_at) - new Date(a.verified_on || a.created_at)
  )[0]
}

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
  const { confirm } = useDialogs()

  const handleDeleteProspect = async () => {
    const ok = await confirm({
      title: 'Delete prospect',
      description: `Delete ${prospect.first_name} ${prospect.last_name}?`,
      confirmLabel: 'Delete'
    })
    if (ok) {
      await deleteProspect(prospect.linkedin_id)
      navigate('/dashboard')
    }
  }

  const handleRemoveFromQueue = async () => {
    const ok = await confirm({
      title: 'Remove from deep search queue',
      description: 'The prospect will be removed from the deep-search queue. Continue?',
      confirmLabel: 'Remove'
    })
    if (ok) {
      await deleteQueueItem(deepSearch.queue_id)
      onRefetch?.()
    }
  }

  if (!prospect) return null

  const { first_name, last_name, headline, status, location, email } = prospect
  
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  const statusConfig = getStatusConfig(status)
  const latestVerification = getLatestVerification(email?.verifications)
  const emailConfig = getEmailStatusConfig(email?.status)
  const safeConfig = latestVerification ? getSafeToSendConfig(latestVerification.safe_to_send) : null

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
      onSelect: handleDeleteProspect,
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
        onSelect: handleRemoveFromQueue,
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
    <div className="w-full px-4 lg:px-6">
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-0">
          {/* Main Header Section */}
          <div className="bg-card border rounded-xl p-6 space-y-6">
            
            {/* Top Row: Avatar, Name, Status, Actions */}
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-start gap-4 min-w-0 flex-1">
                <Avatar className="h-20 w-20 shrink-0 border-2 border-muted">
                  <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
                    {getInitials(first_name, last_name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="min-w-0 flex-1 space-y-3">
                  {/* Name and Primary Status */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        {first_name} {last_name}
                      </h1>
                      <Badge variant={statusConfig.variant} className="text-sm px-3 py-1">
                        {statusConfig.label}
                      </Badge>
                    </div>
                    
                    {/* Special Status Badges */}
                    {deepSearch?.is_in_queue && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 cursor-help">
                            <SearchIcon className="w-3 h-3 mr-1" />
                            Deep Research Queued
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-xs">
                          <div className="space-y-2">
                            <p className="font-medium">Queued Research Prompts:</p>
                            <div className="space-y-1">
                              {deepSearch.prompts?.map((prompt, index) => (
                                <p key={prompt.id || index} className="text-sm">
                                  • {prompt.name}
                                </p>
                              ))}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <ActionDropdown
                items={actions}
                triggerProps={{
                  variant: "outline",
                  size: "default",
                  icon: MoreHorizontalIcon,
                  className: "shrink-0"
                }}
                align="end"
                side="bottom"
              />
            </div>

            <Separator />

            {/* Contact Information Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Contact Information</h2>
              
              {email?.email ? (
                <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                  {/* Email Address */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <MailIcon className="w-5 h-5 text-muted-foreground shrink-0" />
                        <a 
                          href={`mailto:${email.email}`} 
                          className="text-base font-medium text-primary hover:underline truncate"
                          title={email.email}
                        >
                          {email.email}
                        </a>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(email.email)
                          toast.success('Email copied to clipboard')
                        }}
                        className="shrink-0"
                      >
                        <CopyIcon className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Email Status Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={emailConfig.variant} className="flex items-center gap-1">
                        <emailConfig.icon className="w-3 h-3" />
                        {emailConfig.label}
                      </Badge>
                      
                      {safeConfig && safeConfig.label !== emailConfig.label && (
                        <Badge variant={safeConfig.variant} className="flex items-center gap-1">
                          <safeConfig.icon className="w-3 h-3" />
                          {safeConfig.label}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Email Verification Details */}
                  {latestVerification && (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Last verified: {formatDate(latestVerification.verified_on)}
                      </p>
                      
                      {Array.isArray(email.verifications) && email.verifications.length > 0 && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="w-fit">
                              View All Verifications ({email.verifications.length})
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent align="start" className="w-[min(90vw,600px)]">
                            <div className="space-y-3">
                              <h3 className="font-medium">Email Verification History</h3>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Safe to Send</TableHead>
                                    <TableHead>Verified On</TableHead>
                                    <TableHead>Flags</TableHead>
                                    <TableHead>Bounce Type</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {email.verifications
                                    .sort((a, b) => new Date(b.verified_on || b.created_at) - new Date(a.verified_on || a.created_at))
                                    .slice(0, 5)
                                    .map(verification => {
                                      const verificationStatus = getEmailStatusConfig(verification.verification_status)
                                      const safeStatus = getSafeToSendConfig(verification.safe_to_send)
                                      
                                      return (
                                        <TableRow key={verification.id}>
                                          <TableCell>
                                            <Badge variant={verificationStatus.variant} className="flex items-center gap-1">
                                              <verificationStatus.icon className="w-3 h-3" />
                                              {verificationStatus.label}
                                            </Badge>
                                          </TableCell>
                                          <TableCell>
                                            <Badge variant={safeStatus.variant} className="flex items-center gap-1">
                                              <safeStatus.icon className="w-3 h-3" />
                                              {safeStatus.label}
                                            </Badge>
                                          </TableCell>
                                          <TableCell className="text-sm">
                                            {formatDate(verification.verified_on)}
                                          </TableCell>
                                          <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                              {["disposable", "free", "role", "gibberish"].map(flag => 
                                                verification[flag] === "yes" && (
                                                  <Badge key={flag} variant="secondary" className="text-xs">
                                                    {flag}
                                                  </Badge>
                                                )
                                              )}
                                            </div>
                                          </TableCell>
                                          <TableCell className="text-sm">
                                            {verification.bounce_type || "—"}
                                          </TableCell>
                                        </TableRow>
                                      )
                                    })}
                                </TableBody>
                              </Table>
                              {email.verifications.length > 5 && (
                                <p className="text-xs text-muted-foreground">
                                  Showing 5 of {email.verifications.length} verifications
                                </p>
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MailIcon className="w-5 h-5" />
                  <span className="text-base">No email address available</span>
                </div>
              )}
            </div>

            {/* Professional Information Section */}
            {(headline || location) && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">Professional Information</h2>
                  
                  <div className="space-y-3">
                    {headline && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Headline</p>
                        <p className="text-base text-foreground leading-relaxed">{headline}</p>
                      </div>
                    )}
                    
                    {location && (
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-base text-foreground">{location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Dialogs */}
    </div>
  )
}
