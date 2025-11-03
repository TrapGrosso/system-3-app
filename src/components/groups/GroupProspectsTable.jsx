import * as React from "react"
import { useNavigate } from "react-router-dom"
import { User, Trash2 } from "lucide-react"

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import ProspectFilters from "./ProspectFilters"
import { formatAbsolute } from '@/utils/timeformat'

function GroupProspectsTable({ 
  group,
  prospects = [], 
  isLoading, 
  isError, 
  onRemoveProspect, 
  onRefetch,
  isRemovingFromGroup,
  className 
}) {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = React.useState(1)
  const [filter, setFilter] = React.useState(null)
  const perPage = 10

  // Apply filtering
  const filteredProspects = React.useMemo(() => {
    if (!filter) return prospects

    return prospects.filter(prospect => {
      const { field, value } = filter
      
      switch (field) {
        case 'first_name':
          return prospect.first_name?.toLowerCase().includes(value.toLowerCase())
        case 'last_name':
          return prospect.last_name?.toLowerCase().includes(value.toLowerCase())
        case 'company':
          return prospect.company?.toLowerCase().includes(value.toLowerCase())
        case 'title':
          return prospect.title?.toLowerCase().includes(value.toLowerCase())
        default:
          return true
      }
    })
  }, [prospects, filter])

  // Calculate pagination
  const totalPages = Math.ceil(filteredProspects.length / perPage)
  const startIndex = (currentPage - 1) * perPage
  const endIndex = startIndex + perPage
  const paginatedProspects = filteredProspects.slice(startIndex, endIndex)

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

  const handleRowClick = (prospect) => {
    navigate(`/prospects/${prospect.linkedin_id}`)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleRemoveProspect = (e, prospect) => {
    e.stopPropagation() // Prevent row navigation
    onRemoveProspect(prospect)
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Prospects in Group
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProspectFilters onApply={handleFilterApply} onClear={handleFilterClear} />
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="w-16">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Prospects in Group
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProspectFilters onApply={handleFilterApply} onClear={handleFilterClear} />
          <div className="text-center py-8">
            <p className="text-sm text-destructive mb-2">Failed to load prospects</p>
            <Button variant="outline" size="sm" onClick={onRefetch}>
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (filteredProspects.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Prospects in {group?.name || 'Group'} ({prospects.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProspectFilters onApply={handleFilterApply} onClear={handleFilterClear} />
          <div className="text-center py-12">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-2">
              {filter ? 'No prospects match your filter' : 'No prospects in this group'}
            </p>
            <p className="text-xs text-muted-foreground">
              {filter ? 'Try adjusting your filter criteria' : 'Add prospects to this group to see them here'}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Prospects in {group?.name || 'Group'} ({filteredProspects.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <ProspectFilters onApply={handleFilterApply} onClear={handleFilterClear} />

        {/* Results info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {startIndex + 1}-{Math.min(endIndex, filteredProspects.length)} of {filteredProspects.length} prospects
            {filter && ` (filtered from ${prospects.length} total)`}
          </span>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="w-16">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProspects.map((prospect) => (
                <TableRow
                  key={prospect.linkedin_id}
                  onClick={() => handleRowClick(prospect)}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell className="font-medium max-w-xs">
                    <div className="truncate" title={`${prospect.first_name} ${prospect.last_name}`.trim()}>
                      {`${prospect.first_name || ''} ${prospect.last_name || ''}`.trim() || 'No name'}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-sm">
                    <div className="truncate text-sm text-muted-foreground" title={prospect.title}>
                      {prospect.title || 'No title'}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-sm">
                    <div className="truncate text-sm text-muted-foreground" title={prospect?.company?.name}>
                      {prospect?.company?.name || 'No company'}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatAbsolute(prospect.added_at || prospect.created_at, { mode: "date", dateStyle: "short" })}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={(e) => handleRemoveProspect(e, prospect)}
                      title="Remove from group"
                      disabled={isRemovingFromGroup}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove from group</span>
                    </Button>
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
      </CardContent>
    </Card>
  )
}

export default GroupProspectsTable
