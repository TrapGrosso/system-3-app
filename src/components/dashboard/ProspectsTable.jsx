import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function ProspectsTable({ prospects }) {
  if (!prospects || prospects.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No prospects found
      </div>
    )
  }

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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Notes</TableHead>
            <TableHead className="text-right">Tasks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prospects.map((prospect) => (
            <TableRow key={prospect.linkedin_id}>
              <TableCell className="font-medium">
                {prospect.first_name || '—'}
              </TableCell>
              <TableCell>
                {prospect.last_name || '—'}
              </TableCell>
              <TableCell className="max-w-xs">
                <div className="truncate" title={prospect.title || prospect.headline}>
                  {prospect.title || prospect.headline || '—'}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(prospect.status)}>
                  {prospect.status || 'Unknown'}
                </Badge>
              </TableCell>
              <TableCell className="max-w-xs">
                <div className="truncate" title={prospect.location}>
                  {prospect.location || '—'}
                </div>
              </TableCell>
              <TableCell>
                {prospect.email ? (
                  <a 
                    href={`mailto:${prospect.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {prospect.email}
                  </a>
                ) : (
                  '—'
                )}
              </TableCell>
              <TableCell className="max-w-xs">
                <div className="truncate" title={prospect.company_name}>
                  {prospect.company_name || '—'}
                </div>
              </TableCell>
              <TableCell className="text-right">
                {prospect.note_count || 0}
              </TableCell>
              <TableCell className="text-right">
                {prospect.task_count || 0}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
