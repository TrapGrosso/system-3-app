import * as React from "react"
import {
  NotebookIcon, 
  CalendarIcon,
  ListIcon,
  TagsIcon,
  UsersIcon,
  FlagIcon,
  ClockIcon,
  MailIcon,
  ExternalLinkIcon,
  CopyIcon,
  Building2Icon
} from "lucide-react"

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { TablePopoverCell } from '@/components/shared/table/TablePopoverCell'
import { DataTable } from '@/components/shared/table/DataTable'
import AdvancedFiltersCollapsible from '@/components/shared/ui/AdvancedFiltersCollapsible'

const getStatusVariant = (status) => {
  switch (status?.toLowerCase()) {
    case 'new':
      return 'secondary'
    case 'contacted':
      return 'default'
    case 'qualified':
      return 'default'
    default:
      return 'outline'
  }
}

export default function ProspectsTable({ 
  data,
  total,
  query,
  onQueryChange,
  loading,
  onRowClick,
  onAddNote,
  onCreateTask,
  onAddToGroup,
  onAddToCampaign,
  onAddToDeepSearch,
  onBulkAddToGroup,
  onBulkAddToCampaign,
  onBulkAddToDeepSearch,
  onCreateVariables,
  onBulkCreateVariables,
  onRemoveFromGroup,
  onRemoveFromCampaign,
  onUpdate,
  onDelete,
  onBulkDelete,
  onBulkFindEmails,
  onFindEmails,
  onVerifyEmails,
  onBulkVerifyEmails
}) {

  // Column definitions (without select and actions - DataTable handles these)
  const columns = React.useMemo(() => [
    {
      accessorKey: "first_name",
      header: "First Name",
      cell: ({ row }) => {
        const fn = row.original.first_name || "";
        const ln = row.original.last_name || "";
        const fullName = [fn, ln].filter(Boolean).join(" ");
        const initials = (fn?.[0] || "") + (ln?.[0] || "");
        return (
          <div className="flex items-center gap-2 max-w-[200px]">
            <Avatar className="size-6">
              {row.original.avatar_url ? (
                <AvatarImage src={row.original.avatar_url} alt={fullName} />
              ) : null}
              <AvatarFallback className="text-[10px]">
                {initials || "?"}
              </AvatarFallback>
            </Avatar>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-medium truncate" title={fullName || "—"}>
                  {fn || "—"}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">{fullName || "—"}</TooltipContent>
            </Tooltip>
          </div>
        );
      },
    },
    {
      accessorKey: "last_name",
      header: "Last Name",
      cell: ({ row }) => {
        const value = row.original.last_name || "";
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="truncate max-w-[160px]" title={value || "—"}>
                {value || "—"}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">{value || "—"}</TooltipContent>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const value = row.original.title || row.original.headline || "";
        return (
          <div className="max-w-[220px]">
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="truncate max-w-[220px] font-normal text-xs"
                  title={value || "—"}
                >
                  {value || "—"}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top">{value || "—"}</TooltipContent>
            </Tooltip>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.status)}>
          {row.original.status || 'Unknown'}
        </Badge>
      ),
    },
    {
      accessorKey: "last_log",
      header: "Last Log",
      enableSorting: false,
      cell: ({ row }) => {
        const lastLog = row.original.last_log;
        if (!lastLog) {
          return <div className="text-center text-muted-foreground">—</div>;
        }

        // Importing AdvancedFiltersCollapsible here would cause issues, so we'll define the collapsible content inline
        const formatTimestamp = (timestamp) => {
          if (!timestamp) return '—';
          return new Date(timestamp).toLocaleString();
        };

        return (
          <TablePopoverCell
            items={[lastLog]}
            icon={<ClockIcon />}
            triggerVariant="accent"
            title="Last Log"
            renderItem={(log) => (
              <div className="p-2 border rounded-md text-sm space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{log.action}</Badge>
                  <Badge variant={log.prospect_success ? "default" : "destructive"}>
                    {log.prospect_success ? "SUCCESS" : "ERROR"}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatTimestamp(log.end_time || log.start_time)}
                </div>
                
                <div className="border-t pt-2 mt-2">
                  <AdvancedFiltersCollapsible 
                    label="See more details" 
                    className="text-xs space-y-1"
                  >
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span>{log.status || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>{log.duration_ms ? `${log.duration_ms}ms` : '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span>{formatTimestamp(log.prospect_created_at)}</span>
                    </div>
                  </AdvancedFiltersCollapsible>
                </div>
              </div>
            )}
          />
        );
      },
    },
    {
      id: "email",
      accessorFn: (row) => row.email_record?.email || "",
      header: "Email",
      cell: ({ row }) => {
        const rec = row.original.email_record;
        if (!rec) return <div>—</div>;
        const email = rec.email || "";

        const formatDate = (ts) => ts ? new Date(ts).toLocaleString() : "—";
        const emailStatusVariant = (s) => ({ valid: "default", invalid: "destructive" }[s?.toLowerCase()] || "outline");
        const verificationStatusVariant = (s) => ({ valid: "default", invalid: "destructive" }[s?.toLowerCase()] || "secondary");
        const safeToSendVariant = (s) => s === "yes" ? "default" : s === "no" ? "destructive" : "outline";

        const handleCopy = (e) => { e.stopPropagation(); if (email) navigator.clipboard?.writeText(email); };
        const stop = (e) => e.stopPropagation();

        return (
          <TablePopoverCell
            items={[rec]}
            icon={<MailIcon />}
            triggerVariant="blue"
            title="Email"
            renderItem={(r) => (
              <div className="p-2 border rounded-md text-sm space-y-3">
                {/* Header: email link + copy */}
                <div className="flex items-center gap-2 min-w-0">
                  {email ? (
                    <Button variant="link" asChild className="h-auto p-0 min-w-0" onClick={stop}>
                      <a href={`mailto:${email}`} rel="noopener noreferrer" className="flex items-center gap-1 min-w-0">
                        <MailIcon className="h-3.5 w-3.5 shrink-0 opacity-70" />
                        <span className="truncate max-w-[180px]">{email}</span>
                        <ExternalLinkIcon className="h-3.5 w-3.5 shrink-0" />
                      </a>
                    </Button>
                  ) : (
                    <span className="text-muted-foreground">No email</span>
                  )}
                </div>

                {/* Status + Created */}
                <div className="flex flex-wrap items-center gap-2">
                  {r.status && <Badge variant={emailStatusVariant(r.status)}>{r.status}</Badge>}
                  <span className="text-xs text-muted-foreground">Created: {formatDate(r.created_at)}</span>
                </div>

                {/* Collapsible for Verifications */}
                <AdvancedFiltersCollapsible label={`Verifications (${Array.isArray(r.verifications) ? r.verifications.length : 0})`} className="text-xs space-y-2" onClick={stop}>
                  {Array.isArray(r.verifications) && r.verifications.length > 0 ? (
                    r.verifications.map((v) => (
                      <div key={v.id} className="border rounded-md p-2 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant={verificationStatusVariant(v.verification_status)}>
                            {v.verification_status || "unknown"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{formatDate(v.verified_on)}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {v.safe_to_send && (
                            <Badge variant={safeToSendVariant(v.safe_to_send)}>safe_to_send: {v.safe_to_send}</Badge>
                          )}
                          {v.disposable && <Badge variant="outline">disposable: {v.disposable}</Badge>}
                          {v.free && <Badge variant="outline">free: {v.free}</Badge>}
                          {v.role && <Badge variant="outline">role: {v.role}</Badge>}
                          {v.gibberish && <Badge variant="outline">gibberish: {v.gibberish}</Badge>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">No verifications found</span>
                  )}
                </AdvancedFiltersCollapsible>
              </div>
            )}
          />
        );
      },
    },
    {
      accessorKey: "company_name",
      header: "Company",
      cell: ({ row }) => {
        const name = row.original.company_name || "";
        const domain = row.original.company_domain || row.original.company_website || "";
        const href = domain ? (domain.startsWith("http") ? domain : `https://${domain}`) : null;

        if (!name) return <div>—</div>;

        const content = (
          <>
            <Building2Icon className="h-3.5 w-3.5 shrink-0 opacity-70" />
            <span className="truncate max-w-[200px]">{name}</span>
            {href ? <ExternalLinkIcon className="h-3.5 w-3.5 shrink-0" /> : null}
          </>
        );

        return (
          <div className="max-w-[240px]">
            {href ? (
              <Button
                variant="link"
                asChild
                className="h-auto p-0 text-left justify-start min-w-0"
                onClick={(e) => e.stopPropagation()}
              >
                <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 min-w-0">
                  {content}
                </a>
              </Button>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <span className="truncate max-w-[220px]" title={name}>{name}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">{name}</TooltipContent>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "notes",
      header: "Notes",
      enableSorting: false,
      cell: ({ row }) => {
        const notes = row.original.notes || []
        return (
          <TablePopoverCell
            items={notes}
            icon={<NotebookIcon />}
            triggerVariant="blue"
            title="Notes"
            renderItem={(note) => (
              <div className="p-2 border rounded-md text-sm">
                <p className="text-foreground">{note.body}</p>
              </div>
            )}
          />
        )
      },
    },
    {
      accessorKey: "tasks",
      header: "Tasks",
      enableSorting: false,
      cell: ({ row }) => {
        const tasks = row.original.tasks || []
        return (
          <TablePopoverCell
            items={tasks}
            icon={<CalendarIcon />}
            triggerVariant="green"
            title="Tasks"
            renderItem={(task) => (
              <div className="p-2 border rounded-md text-sm">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-medium">{task.title}</h5>
                  <Badge variant={task.status === 'open' ? 'default' : 'secondary'}>
                    {task.status}
                  </Badge>
                </div>
                {task.due_date && (
                  <p className="text-xs text-muted-foreground mb-1">
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </p>
                )}
                {task.description && (
                  <p className="text-foreground">{task.description}</p>
                )}
              </div>
            )}
          />
        )
      },
    },
    {
      accessorKey: "variables",
      header: "Variables",
      enableSorting: false,
      cell: ({ row }) => {
        const variables = row.original.variables || []
        return (
          <TablePopoverCell
            items={variables}
            icon={<ListIcon />}
            triggerVariant="slate"
            title="Variables"
            renderItem={(variable) => (
              <div className="p-2 border rounded-md text-sm">
                <p className="font-medium">{variable.name}</p>
                <p className="text-xs text-muted-foreground">{variable.value}</p>
                {variable.tags && variable.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {variable.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          />
        )
      },
    },
    {
      accessorKey: "enrichments",
      header: "Enrichments",
      enableSorting: false,
      cell: ({ row }) => {
        const enrichments = row.original.enrichments || []
        return (
          <TablePopoverCell
            items={enrichments}
            icon={<TagsIcon />}
            triggerVariant="slate"
            title="Enrichments"
            renderItem={(enrichment) => (
              <div className="p-2 border rounded-md text-sm">
                <p className="font-medium">{enrichment.type}</p>
                {enrichment.prompt_name && (
                  <p className="text-xs text-muted-foreground">{enrichment.prompt_name}</p>
                )}
                <Badge variant="outline" className="text-xs mt-1">
                  {enrichment.entity_kind}
                </Badge>
              </div>
            )}
          />
        )
      },
    },
    {
      accessorKey: "groups",
      header: "Groups",
      enableSorting: false,
      cell: ({ row }) => {
        const groups = row.original.groups || []
        return (
          <TablePopoverCell
            items={groups}
            icon={<UsersIcon />}
            triggerVariant="slate"
            title="Groups"
            renderItem={(group) => (
              <div className="p-2 border rounded-md text-sm">
                <p className="text-foreground">{group.name}</p>
              </div>
            )}
          />
        )
      },
    },
    {
      accessorKey: "campaigns",
      header: "Campaigns",
      enableSorting: false,
      cell: ({ row }) => {
        const campaigns = row.original.campaigns || []
        return (
          <TablePopoverCell
            items={campaigns}
            icon={<FlagIcon />}
            triggerVariant="slate"
            title="Campaigns"
            renderItem={(campaign) => (
              <div className="p-2 border rounded-md text-sm">
                <p className="text-foreground">{campaign.name}</p>
              </div>
            )}
          />
        )
      },
    },
  ], [])

  // External pagination state
  const paginationState = React.useMemo(() => ({
    pageIndex: query.page - 1,
    pageSize: query.page_size,
    pageCount: Math.ceil(total / query.page_size),
    totalElements: total || null
  }), [query.page, query.page_size, total])

  // Pagination handler
  const handlePaginationChange = React.useCallback((update) => {
    if (update.pageIndex !== undefined) {
      onQueryChange({ page: update.pageIndex + 1 })
    }
    if (update.pageSize !== undefined) {
      onQueryChange({ page_size: update.pageSize, page: 1 })
    }
  }, [onQueryChange])

  // Sorting state and handler
  const sorting = React.useMemo(() => [
    { id: query.sort_by, desc: query.sort_dir === 'desc' }
  ], [query.sort_by, query.sort_dir])

  const handleSortingChange = React.useCallback((updatedSorting) => {
    const newSorting = typeof updatedSorting === 'function' ? updatedSorting(sorting) : updatedSorting
    const s = newSorting[0] || {}
    onQueryChange({ 
      sort_by: s.id || 'created_at', 
      sort_dir: s.desc ? 'desc' : 'asc' 
    })
  }, [onQueryChange, sorting])

  // Bulk actions array
  const bulkActions = React.useMemo(() => [
    {
      label: "Add to Group",
      value: "addToGroup",
      onSelect: (selectedIds) => {
        if (onBulkAddToGroup) {
          onBulkAddToGroup(selectedIds)
        } else {
          alert(`Add ${selectedIds.length} prospects to group`)
        }
      }
    },
    {
      label: "Add to Campaign", 
      value: "addToCampaign",
      onSelect: (selectedIds) => {
        if (onBulkAddToCampaign) {
          onBulkAddToCampaign(selectedIds)
        } else {
          alert(`Add ${selectedIds.length} prospects to campaign`)
        }
      }
    },
    {
      label: "Add to Deep Search Queue",
      value: "addToDeepSearch",
      onSelect: (selectedIds) => {
        if (onBulkAddToDeepSearch) {
          onBulkAddToDeepSearch(selectedIds)
        }
      }
    },
    {
      label: "Find Emails",
      value: "findEmails",
      onSelect: (selectedIds) => {
        if (onBulkFindEmails) {
          onBulkFindEmails(selectedIds)
        } else {
          alert(`Find emails for ${selectedIds.length} prospects`)
        }
      }
    },
    {
      label: "Create Variables With AI",
      value: "createVariables",
      onSelect: (selectedIds) => {
        if (onBulkCreateVariables) {
          onBulkCreateVariables(selectedIds)
        } else {
          alert(`Create variables for ${selectedIds.length} prospects`)
        }
      }
    },
    {
      label: "Verify Emails",
      value: "verifyEmails",
      onSelect: (selectedIds) => {
        if (onBulkVerifyEmails) {
          onBulkVerifyEmails(selectedIds)
        } else {
          alert(`Verify emails for ${selectedIds.length} prospects`)
        }
      }
    },
    "separator",
    {
      label: "Send Email",
      value: "email",
      onSelect: (selectedIds) => {
        alert(`Send email to ${selectedIds.length} prospects`)
      }
    },
    {
      label: "Export Selected",
      value: "export",
      onSelect: (selectedIds) => {
        alert(`Export ${selectedIds.length} prospects`)
      }
    },
    "separator",
    {
      label: "Delete Selected",
      value: "delete",
      variant: "destructive",
      onSelect: (selectedIds) => {
        if (onBulkDelete) {
          onBulkDelete(selectedIds)
        } else {
          alert(`Delete ${selectedIds.length} prospects`)
        }
      }
    },
  ], [onBulkAddToGroup, onBulkAddToCampaign, onBulkAddToDeepSearch, onBulkCreateVariables, onBulkDelete, onBulkFindEmails])

  // Row actions function
  const rowActions = React.useCallback((ctx) => [
    {
      label: "Update",
      onSelect: () => onUpdate
        ? onUpdate(ctx)
        : alert(`Update prospect ${ctx.first_name} ${ctx.last_name}`)
    },
    "separator",
    {
      label: "Add Note",
      onSelect: () => onAddNote
        ? onAddNote(ctx.linkedin_id, ctx)
        : alert(`Add note for ${ctx.first_name} ${ctx.last_name}`)
    },
    {
      label: "Find Email",
      onSelect: () => onFindEmails
        ? onFindEmails(Array.isArray(ctx.linkedin_id) ? ctx.linkedin_id : [ctx.linkedin_id])
        : alert(`Find emails for ${ctx.first_name} ${ctx.last_name}`)
    },
    {
      label: "Create Task",
      onSelect: () => onCreateTask
        ? onCreateTask(ctx.linkedin_id, ctx)
        : alert(`Create task for ${ctx.first_name} ${ctx.last_name}`)
    },
    {
      label: "Verify Email",
      onSelect: () => onVerifyEmails
        ? onVerifyEmails(ctx.linkedin_id)
        : alert(`Verify email for ${ctx.first_name} ${ctx.last_name}`)
    },
    "separator",
    {
      label: "Add to Group",
      onSelect: () => onAddToGroup
        ? onAddToGroup(ctx.linkedin_id)
        : alert(`Add ${ctx.first_name} ${ctx.last_name} to group`)
    },
    {
      label: "Add to Campaign",
      onSelect: () => onAddToCampaign
        ? onAddToCampaign(ctx.linkedin_id)
        : alert(`Add ${ctx.first_name} ${ctx.last_name} to campaign`)
    },
    {
      label: "Add to Deep Search Queue",
      onSelect: () => onAddToDeepSearch?.(ctx.linkedin_id)
    },
    {
      label: "Create Variables With AI",
      onSelect: () => onCreateVariables
        ? onCreateVariables(ctx.linkedin_id)
        : alert(`Create variables for ${ctx.first_name} ${ctx.last_name}`)
    },
    "separator",
    {
      label: "Remove from Group",
      variant: "destructive",
      onSelect: () => onRemoveFromGroup
        ? onRemoveFromGroup(ctx.linkedin_id, ctx)
        : alert(`Remove ${ctx.first_name} ${ctx.last_name} from group`)
    },
    {
      label: "Remove from Campaign",
      variant: "destructive",
      onSelect: () => onRemoveFromCampaign
        ? onRemoveFromCampaign(ctx.linkedin_id, ctx)
        : alert(`Remove ${ctx.first_name} ${ctx.last_name} from campaign`)
    },
    {
      label: "Delete",
      variant: "destructive",
      onSelect: () => onDelete
        ? onDelete(ctx)
        : alert(`Delete ${ctx.first_name} ${ctx.last_name}`)
    }
  ], [onUpdate, onDelete, onAddNote, onCreateTask, onAddToGroup, onAddToCampaign, onAddToDeepSearch, onCreateVariables, onRemoveFromGroup, onRemoveFromCampaign])

  // Row click handler
  const handleRowClick = React.useCallback((prospect) => {
    if (onRowClick) {
      onRowClick(prospect.linkedin_id)
    } else {
      alert(`row clicked '${prospect.linkedin_id}'`)
    }
  }, [onRowClick])

  return (
    <DataTable
      columns={columns}
      data={data || []}
      rowId={(row) => row.linkedin_id}
      loading={loading}
      emptyMessage="No prospects found"
      mode="external"
      paginationState={paginationState}
      onPaginationChange={handlePaginationChange}
      sorting={sorting}
      onSortingChange={handleSortingChange}
      manualSorting={true}
      bulkActions={bulkActions}
      rowActions={rowActions}
      onRowClick={handleRowClick}
    />
  )
}
