import React from 'react'
import { useParams } from 'react-router-dom'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, Search } from 'lucide-react'
import { LoadingScreen } from '@/components/shared/ui/LoadingScreen'
import { useAuth } from '@/contexts/AuthContext'
import { usegetProspectDetails } from '@/api/prospect-details/useGetProspectsDetails'
import { useDialogs } from '@/contexts/DialogsContext'
import {
  TabsPanel
} from '@/components/prospect-details'
import ProspectInfo from '@/components/prospect-details/ProspectInfo'

export default function ProspectDetails() {
  const { user } = useAuth()
  const { linkedinId } = useParams()
  

  const { data, isLoading, isError, refetch } = usegetProspectDetails(user?.id, linkedinId)

  const {
    openProspectNotes,
    openProspectTasks,
    openProspectVariables,
    openHandleGroups,
    openChangeCompany,
    openUpdateCompany
  } = useDialogs()

  const handleOpenNotesDialog = async () => {
    await openProspectNotes({ prospect: data.prospect })
    refetch()
  }

  const handleOpenTasksDialog = async () => {
    await openProspectTasks({ prospect: data.prospect })
    refetch()
  }

  const handleOpenGroupsDialog = async () => {
    await openHandleGroups({ user_id: data.prospect.user_id, prospect_ids: [data.prospect.linkedin_id] })
    refetch()
  }

  const handleOpenVariablesDialog = async () => {
    await openProspectVariables({ prospect: data.prospect })
    refetch()
  }

  const handleOpenChangeCompanyDialog = async () => {
    await openChangeCompany({ prospectId: data.prospect.linkedin_id })
    refetch()
  }

  const handleOpenUpdateCompanyDialog = async () => {
    await openUpdateCompany({ company: data.company })
    refetch()
  }

  if (isLoading) {
    return (
      <DashboardLayout headerText="Prospect Details">
        <LoadingScreen message="Loading prospect details..." />
      </DashboardLayout>
    )
  }

  if (isError || Array.isArray(data) && !data.length) {
    return (
      <DashboardLayout headerText="Prospect Details">
        <div className="flex justify-center items-center py-24">
          <Card className="max-w-md">
            <CardContent className="pt-6 flex flex-col items-center gap-4 text-center">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <p className="text-muted-foreground">
                Failed to load prospect details. Please try again.
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
      <DashboardLayout headerText="Prospect Details">
        <div className="flex justify-center items-center py-24">
          <Card className="max-w-md">
            <CardContent className="pt-6 flex flex-col items-center gap-4 text-center">
              <Search className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">
                No prospect found with LinkedIn ID:{' '}
                <span className="px-2 py-0.5 rounded-md bg-muted text-foreground/80 font-mono text-sm">
                  {linkedinId}
                </span>
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout headerText="Prospect Details">
      <ProspectInfo
        prospect={data.prospect}
        company={data.company}
        deepSearch={data.deep_search}
        onRefetch={refetch}
        onAddCompany={handleOpenChangeCompanyDialog}
        onEditCompany={handleOpenUpdateCompanyDialog}
      />

      <TabsPanel
            notes={data.notes}
            tasks={data.tasks}
            enrichment={data.enrichment}
            groups={data.groups}
            variables={data.variables}
            logs={data.logs}
            prospect={data.prospect}
            onAddNote={handleOpenNotesDialog}
            onAddTask={handleOpenTasksDialog}
            onAddVariable={handleOpenVariablesDialog}
            onAddToGroup={handleOpenGroupsDialog}
            onRefetch={refetch}
          />
    </DashboardLayout>
  )
}
