import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { LoadingScreen } from '@/components/shared/ui/LoadingScreen'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, Search } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useGetLogsDetails } from '@/api/log-details/getLogsDetails'
import { LogMainCard, ResultCodeCard, ResultsTable } from '@/components/log-details'

export default function LogDetails() {
  const { user } = useAuth()
  const { logId } = useParams()
  
  const [selectedResult, setSelectedResult] = useState(null)
  
  const { data, isLoading, isError, refetch } = useGetLogsDetails(user?.id, logId)

  if (isLoading) {
    return (
      <DashboardLayout headerText="Log Details">
        <LoadingScreen message="Loading log details..." />
      </DashboardLayout>
    )
  }

  if (isError || (Array.isArray(data) && !data.length)) {
    return (
      <DashboardLayout headerText="Log Details">
        <div className="flex justify-center items-center py-24">
          <Card className="max-w-md">
            <CardContent className="pt-6 flex flex-col items-center gap-4 text-center">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <p className="text-muted-foreground">
                Failed to load log details. Please try again.
              </p>
              <Button variant="outline" onClick={() => refetch()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  if (!data) {
    return (
      <DashboardLayout headerText="Log Details">
        <div className="flex justify-center items-center py-24">
          <Card className="max-w-md">
            <CardContent className="pt-6 flex flex-col items-center gap-4 text-center">
              <Search className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">
                No log found with ID:{' '}
                <span className="px-2 py-0.5 rounded-md bg-muted text-foreground/80 font-mono text-sm">
                  {logId}
                </span>
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  const { log, results = [] } = data
  const firstResult = results?.[0]

  return (
    <DashboardLayout headerText="Log Details">
      <div className="px-4 lg:px-6">
        <LogMainCard log={log} />
        
        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          <ResultCodeCard result={selectedResult?.result} />
          <ResultsTable results={results} onRowClick={setSelectedResult} />
        </div>
      </div>
    </DashboardLayout>
  )
}
