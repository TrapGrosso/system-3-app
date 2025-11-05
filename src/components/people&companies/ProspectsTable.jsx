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
import { formatTimestamp, formatAbsolute } from '@/utils/timeformat'
import { formatDuration } from '@/utils/durationFormat'

export default function ProspectsTable({ 
  data = [],
  total,
  query,
  onQueryChange,
  loading,
  error,
  errorMessage,
  onRowClick,
  onProspectActionFallback
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
      cell: ({ row }) => {
        const statusObj = row.original.status;
        const { 
          status: label = '—',
          description = statusObj?.label ?? statusObj ? 'No description provided' : 'No status selected for this prospect',
          color,
          text_color,
         } = statusObj || {}

        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="secondary" 
                style={{ backgroundColor: color, borderColor: null, color: text_color }}
              >
                {label}
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="top">
              {description}
            </TooltipContent>
          </Tooltip>
        );
      },
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
                      <span>{log.duration_ms ? formatDuration(log.duration_ms) : '—'}</span>
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
      enableSorting: false,
      cell: ({ row }) => {
        const rec = row.original.email;
        if (!rec) return <div>—</div>;
        const email = rec.email || "";

        const emailStatusVariant = (s) => ({ valid: "default", not_found: "destructive" }[s?.toLowerCase()] || "outline");
        const verificationStatusVariant = (s) => ({ valid: "default", invalid: "destructive" }[s?.toLowerCase()] || "secondary");
        const safeToSendVariant = (s) => s === "yes" ? "default" : s === "no" ? "destructive" : "outline";
        const stop = (e) => e.stopPropagation();

        return (
          <TablePopoverCell
            items={[rec]}
            icon={<MailIcon />}
            triggerVariant="blue"
            title="Email"
            renderItem={(r) => (
              <div className="p-3 rounded-xl border shadow-sm bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 text-sm space-y-3 transition-all duration-200 hover:shadow-md">
                {/* Header: email link + copy */}
                <div className="flex items-center gap-2 min-w-0">
                  {email ? (
                    <Button variant="link" asChild className="h-auto p-0 !px-0 justify-start min-w-0 has-[&>svg]:!px-0" onClick={stop}>
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
                  <span className="text-xs text-muted-foreground">Created: {formatTimestamp(r.created_at)}</span>
                </div>

                {/* Single latest Verification */}
                {r.status !== 'not_found' && (() => {
                  // pull from last_verification array or fallback to verifications
                  const v = Array.isArray(r.last_verification) && r.last_verification.length > 0
                    ? r.last_verification[0]
                    : (Array.isArray(r.verifications) && r.verifications.length > 0 ? r.verifications[0] : null);

                  return (
                    <div className="mt-2">
                      {v ? (
                          <div className="border-t pt-2 mt-2">
                            <AdvancedFiltersCollapsible 
                              label="Verification details"
                              className="space-y-3"
                              onClick={stop}
                            >
                              {/* Render ALL details including status & safe_to_send inside collapsible */}
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant={verificationStatusVariant(v.verification_status)}>
                                  {v.verification_status || "unknown"}
                                </Badge>
                                {v.safe_to_send !== undefined && (
                                  <Badge variant={safeToSendVariant(v.safe_to_send)}>
                                    safe_to_send: {String(v.safe_to_send)}
                                  </Badge>
                                )}
                                {v.verified_on && (
                                  <span className="text-xs text-muted-foreground">
                                    Verified: {formatTimestamp(v.verified_on)}
                                  </span>
                                )}
                              </div>

                              <div className="border-t pt-3 mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                                {Object.entries(v)
                                .filter(([key, val]) => {
                                  const allowedProperties = ['gibberish', 'role', 'free', 'disposable', 'bounce_type']
                                  return allowedProperties.includes(key)
                                })
                                .map(([key, val]) => {
                                  const displayVal = val === null || val === undefined || val === ''
                                    ? "—"
                                    : (/_at$|_on$/.test(key) ? formatTimestamp(val) : String(val));
                                  return (
                                    <React.Fragment key={key}>
                                      <span className="text-muted-foreground break-all">{key}:</span>
                                      <span className="break-all">{displayVal}</span>
                                    </React.Fragment>
                                  );
                                })}
                              </div>
                            </AdvancedFiltersCollapsible>
                          </div>
                      ) : (
                        <span className="text-xs italic text-rose-500 font-medium">this email it’s not verified</span>
                      )}
                    </div>
                  );
                })()}
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
                    Due: {formatAbsolute(task.due_date, { mode: "date", dateStyle: "short" })}
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
    }
  ], [])

  // External pagination state
  const paginationState = React.useMemo(() => ({
    pageIndex: query.page - 1,
    pageSize: query.page_size,
    pageCount: query.page_size === 'all' ? 1 : Math.ceil(total / query.page_size),
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
      error={error}
      errorMessage={errorMessage}
      emptyMessage="No prospects found"
      mode="external"
      paginationState={paginationState}
      onPaginationChange={handlePaginationChange}
      sorting={sorting}
      onSortingChange={handleSortingChange}
      manualSorting={true}
      onRowClick={handleRowClick}
      pageSizes={[10, 20, 30, 50]}
      paginationAllOption={{ enabled: true, label: 'All', externalValue: 'all' }}
      autoProspectActions={{
        enabled: true
      }}
    />
  )
}
