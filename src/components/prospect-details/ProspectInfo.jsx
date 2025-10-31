import React from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { ProspectsActionDropdown } from '@/components/ui/ProspectsActionDropdown'
import { 
  MailIcon,
  CopyIcon,
  SearchIcon,
  MapPinIcon,
  ShieldCheckIcon,
  ShieldAlertIcon,
  AlertTriangleIcon,
  BuildingIcon,
  PlusIcon,
  ExternalLinkIcon,
  UsersIcon
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { useProspects } from '@/contexts/ProspectsContext'
import { useDeepSearchQueue } from '@/contexts/DeepSearchQueueContext'
import { useDialogs } from '@/contexts/DialogsContext'
import { formatTimestamp } from '@/utils/timeformat'
import { ActionDropdown } from '@/components/shared/ui/ActionDropdown'

// Utility functions
const getInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
}

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
  if (safe?.toLowerCase() === "yes") {
    return { variant: "default", label: "Safe to Send", icon: ShieldCheckIcon }
  }
  if (safe?.toLowerCase() === "no") {
    return { variant: "destructive", label: "Not Safe", icon: ShieldAlertIcon }
  }
  return { variant: "outline", label: safe?.toLowerCase() || safe, icon: AlertTriangleIcon }
}

const getLatestVerification = (verifications) => {
  if (!Array.isArray(verifications) || !verifications.length) return null
  return [...verifications].sort((a, b) => 
    new Date(b.verified_on || b.created_at) - new Date(a.verified_on || a.created_at)
  )[0]
}

// StatusBadge component - renders status from object with color/text
const StatusBadge = ({ status }) => {
  if (!status) return null
  
  // Handle object type
  if (typeof status === 'object' && status.status) {
    const hasColors = status.color || status.text_color
    
    if (hasColors) {
      return (
        <Badge 
          className="text-sm px-3 py-1"
          style={{
            backgroundColor: status.color || undefined,
            color: status.text_color || undefined,
            borderColor: status.color || undefined
          }}
        >
          {status.status}
        </Badge>
      )
    }
    
    // Fallback to variant if no colors
    return <Badge variant="outline" className="text-sm px-3 py-1">{status.status}</Badge>
  }
  
  // Handle string type - legacy support
  const statusStr = typeof status === 'string' ? status : String(status)
  const normalized = statusStr.toLowerCase()
  
  if (normalized === 'new') {
    return <Badge variant="default" className="text-sm px-3 py-1">New</Badge>
  }
  if (normalized === 'contacted') {
    return <Badge variant="secondary" className="text-sm px-3 py-1">Contacted</Badge>
  }
  if (normalized === 'qualified') {
    return <Badge variant="default" className="text-sm px-3 py-1">Qualified</Badge>
  }
  
  return <Badge variant="outline" className="text-sm px-3 py-1">{statusStr}</Badge>
}

export default function ProspectInfo({ 
  prospect, 
  company,
  deepSearch,
  onRefetch,
  onAddCompany,
  onEditCompany
}) {
  const { user } = useAuth()
  const { updateProspectCompany } = useProspects()
  const { deleteProspects: deleteQueueItem } = useDeepSearchQueue()
  const { 
    confirm,
    openUpdateProspect,
    openProspectNotes,
    openProspectTasks,
    openHandleGroups,
    openDeepSearchQueue,
    openProspectEnrichments,
    openResolveDeepSearchItem,
    openPromptSelect
  } = useDialogs()

  if (!prospect) return null

  const { first_name, last_name, headline, status, location, email } = prospect
  
  const latestVerification = getLatestVerification(email?.verifications)
  const emailConfig = getEmailStatusConfig(email?.status)
  const safeConfig = latestVerification ? getSafeToSendConfig(latestVerification.safe_to_send) : null

  // Determine email action visibility
  const hasEmail = Boolean(email?.email)
  const isVerified = ["verified", "valid"].includes(email?.status?.toLowerCase()) ||
    ["yes"].includes((latestVerification?.safe_to_send || "").toLowerCase()) ||
    ["deliverable", "valid", "verified"].includes((latestVerification?.verification_status || "").toLowerCase())
  
  // Hide actions independently based on email status
  const shouldHideFindEmail = hasEmail
  const shouldHideVerifyEmail = isVerified || !hasEmail
  const hideById = [
    ...(shouldHideFindEmail ? ['find-email'] : []),
    ...(shouldHideVerifyEmail ? ['verify-email'] : []),
  ]

  // Handler functions that call dialogs then refetch
  const handleUpdateProspect = async () => {
    await openUpdateProspect({ prospect })
    onRefetch?.()
  }

  const handleAddNote = async () => {
    await openProspectNotes({ prospect })
    onRefetch?.()
  }

  const handleCreateTask = async () => {
    await openProspectTasks({ prospect })
    onRefetch?.()
  }

  const handleAddToGroup = async () => {
    await openHandleGroups({ user_id: user?.id, prospect_ids: [prospect.linkedin_id], tab: 'add' })
    onRefetch?.()
  }

  const handleAddToDeepSearch = async () => {
    await openDeepSearchQueue({ prospect_ids: [prospect.linkedin_id] })
    onRefetch?.()
  }

  const handleCreateVariables = async () => {
    await openProspectEnrichments({ user_id: user?.id, prospectIds: [prospect.linkedin_id] })
    onRefetch?.()
  }

  const handleResolveDeepSearchItem = async () => {
    if (deepSearch?.is_in_queue) {
      await openResolveDeepSearchItem({ queueIds: [deepSearch.queue_id] })
      onRefetch?.()
    }
  }

  const handleUpdateQueuePrompt = async () => {
    if (deepSearch?.is_in_queue) {
      await openPromptSelect({ queueItemIds: [deepSearch.queue_id], selectedCount: 1 })
      onRefetch?.()
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

  const handleRemoveCompany = async () => {
    const fullName = [prospect?.first_name, prospect?.last_name].filter(Boolean).join(' ')
    const confirmed = await confirm({
      title: 'Remove company from prospect',
      description: `This will unlink ${company?.name ?? 'the company'} from ${fullName || 'this prospect'}.`,
      confirmLabel: 'Remove',
      cancelLabel: 'Cancel',
      size: 'sm'
    })
    if (!confirmed) return

    await updateProspectCompany(prospect.linkedin_id, null)
    onRefetch?.()
  }

  // Additional actions for deep search
  const additionalActions = deepSearch?.is_in_queue ? [
    {
      id: 'resolve-deepsearch-item',
      label: 'Resolve deep search item',
      onSelect: handleResolveDeepSearchItem
    },
    {
      id: 'update-deepsearch-prompt',
      label: 'Update deep search queue prompt',
      onSelect: handleUpdateQueuePrompt
    },
    {
      id: 'remove-from-deepsearch-queue',
      label: 'Remove from deepsearch queue',
      variant: 'destructive',
      onSelect: handleRemoveFromQueue
    },
    'separator'
  ] : []

  // Company actions dropdown items
  const companyDropdownItems = company ? [
    { label: "Edit company", onSelect: onEditCompany },
    "separator",
    { label: "Remove company from prospect", onSelect: handleRemoveCompany, variant: "destructive" },
    "separator",
    { label: "Change company", onSelect: onAddCompany }
  ] : []

  return (
    <div className="w-full px-4 lg:px-6 space-y-6">
      {/* Header Section */}
      <div className="p-6 space-y-6">
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
                  <StatusBadge status={status} />
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

                {/* Headline and Location */}
                {headline && (
                  <p className="text-base text-foreground leading-relaxed">{headline}</p>
                )}
                {location && (
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-base text-foreground">{location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <ProspectsActionDropdown
            mode="single"
            prospect={prospect}
            additionalActions={additionalActions}
            hideById={hideById}
            onUpdateProspect={handleUpdateProspect}
            onAddNote={handleAddNote}
            onCreateTask={handleCreateTask}
            onAddToGroupSingle={handleAddToGroup}
            onAddToDeepSearchSingle={handleAddToDeepSearch}
            onCreateVariablesSingle={handleCreateVariables}
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
                    Last verified: {formatTimestamp(latestVerification.verified_on)}
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
                                        {formatTimestamp(verification.verified_on)}
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

        <Separator />

        {/* Company Section */}
        <div className="space-y-4">
            <div className="flex items-start justify-between">
            <h2 className="text-lg font-semibold text-foreground">Company</h2>
            {company && (
                <ActionDropdown items={companyDropdownItems} align="end" side="bottom" />
            )}
            </div>

            {!company ? (
            <div className="text-center py-8 space-y-4">
                <BuildingIcon className="h-12 w-12 mx-auto opacity-50 text-muted-foreground" />
                <p className="text-muted-foreground">This prospect is not currently associated with any company.</p>
                <Button onClick={onAddCompany} variant="outline">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add a company
                </Button>
            </div>
            ) : (
            <div className="space-y-4">
                {/* Company Name and Website */}
                <div className="space-y-1">
                <div className="flex items-start gap-2">
                    <BuildingIcon className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-semibold">{company.name}</h3>
                    {company.website && (
                        <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary hover:underline flex items-center gap-1 mt-1"
                        >
                        <ExternalLinkIcon className="h-3 w-3" />
                        {company.website.replace(/^https?:\/\//, '')}
                        </a>
                    )}
                    </div>
                </div>
                </div>

                {/* Industry */}
                {company.industry && (
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="gap-1">
                    <BuildingIcon className="h-3 w-3" />
                    {company.industry}
                    </Badge>
                </div>
                )}
                
                {/* Size and Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {company.size && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                    <UsersIcon className="h-4 w-4" />
                    <span>{company.size} employees</span>
                    </div>
                )}
                
                {company.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{company.location}</span>
                    </div>
                )}
                </div>
            </div>
            )}
        </div>
      </div>
    </div>
  )
}
