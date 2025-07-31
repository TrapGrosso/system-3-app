import * as React from "react"
import { Users, Trash2 } from "lucide-react"
import { IconTrashX as TrashX } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import GroupFilters from "./GroupFilters"

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return null
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

function GroupTable({ 
  groups = [], 
  isLoading, 
  isError, 
  onSelect, 
  selectedGroupId, 
  onEmpty, 
  onDelete, 
  onRefetch,
  isEmptyingGroup,
  isDeletingGroup,
  className 
}) {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [filter, setFilter] = React.useState(null)
  const perPage = 10

  // Apply filtering
  const filteredGroups = React.useMemo(() => {
    if (!filter) return groups

    return groups.filter(group => {
      const { field, value } = filter
      
      switch (field) {
        case 'name':
          return group.name?.toLowerCase().includes(value.toLowerCase())
        case 'description':
          return group.description?.toLowerCase().includes(value.toLowerCase())
        default:
          return true
      }
    })
  }, [groups, filter])

  // Calculate pagination
  const totalPages = Math.ceil(filteredGroups.length / perPage)
  const startIndex = (currentPage - 1) * perPage
  const endIndex = startIndex + perPage
  const paginatedGroups = filteredGroups.slice(startIndex, endIndex)

  // Reset to page 1 when filter changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [filter])

  const handleFilterApply = (filterData) => {
    setFilter(filterData)
  }

  const handleFilterClear = () => {
    setFilter(null)
  }

  const handleRowClick = (group) => {
    onSelect(group)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleEmptyGroup = (e, group) => {
    e.stopPropagation() // Prevent row selection
    onEmpty(group)
  }

  const handleDeleteGroup = (e, group) => {
    e.stopPropagation() // Prevent row selection
    onDelete(group)
  }

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <GroupFilters onApply={handleFilterApply} onClear={handleFilterClear} />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Prospects</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-16" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className={`space-y-4 ${className}`}>
        <GroupFilters onApply={handleFilterApply} onClear={handleFilterClear} />
        <div className="text-center py-8">
          <p className="text-sm text-destructive mb-2">Failed to load groups</p>
          <Button variant="outline" size="sm" onClick={onRefetch}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (filteredGroups.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <GroupFilters onApply={handleFilterApply} onClear={handleFilterClear} />
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-2">
            {filter ? 'No groups match your filter' : 'No groups found'}
          </p>
          <p className="text-xs text-muted-foreground">
            {filter ? 'Try adjusting your filter criteria' : 'Create your first group to get started'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filters */}
      <GroupFilters onApply={handleFilterApply} onClear={handleFilterClear} />

      {/* Results info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {startIndex + 1}-{Math.min(endIndex, filteredGroups.length)} of {filteredGroups.length} groups
          {filter && ` (filtered from ${groups.length} total)`}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Prospects</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedGroups.map((group) => (
              <TableRow
                key={group.id}
                onClick={() => handleRowClick(group)}
                className={`cursor-pointer hover:bg-muted/50 ${
                  selectedGroupId === group.id ? 'bg-muted' : ''
                }`}
              >
                <TableCell className="font-medium max-w-xs">
                  <div className="truncate" title={group.name}>
                    {group.name}
                  </div>
                </TableCell>
                <TableCell className="max-w-sm">
                  <div className="truncate text-sm text-muted-foreground" title={group.description}>
                    {group.description || 'No description'}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {group.prospect_count || 0}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(group.created_at)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => handleEmptyGroup(e, group)}
                      title="Empty group"
                      disabled={isEmptyingGroup || isDeletingGroup}
                    >
                      <TrashX className="h-4 w-4" />
                      <span className="sr-only">Empty group</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={(e) => handleDeleteGroup(e, group)}
                      title="Delete group"
                      disabled={isEmptyingGroup || isDeletingGroup}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete group</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={page === currentPage}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                }
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <PaginationItem key={page}>
                      <span className="px-4 py-2">...</span>
                    </PaginationItem>
                  )
                }
                return null
              })}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}

export default GroupTable
