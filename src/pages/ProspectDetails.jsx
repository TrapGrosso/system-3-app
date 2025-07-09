import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { GroupsProvider } from '@/contexts/GroupsContext'
import { NotesProvider } from '@/contexts/NotesContext'
import { TaskProvider } from '@/contexts/TaskContext'
import { usegetProspectDetails } from '@/api/prospect-details/useGetProspectsDetails'
import ProspectNotesDialog from '@/components/dialogs/ProspectNotesDialog'
import ProspectTasksDialog from '@/components/dialogs/ProspectTasksDialog'
import DeepSearchQueueDialog from '@/components/dialogs/DeepSearchQueueDialog'
import HandleGroupsDialog from '@/components/dialogs/HandleGroupsDialog'
import {
  ProspectHeader,
  CompanyCard,
  TabsPanel,
} from '@/components/prospect-details'

export default function ProspectDetails() {
  const { user } = useAuth()
  const { linkedinId } = useParams()
  const [notesDialogOpen, setNotesDialogOpen] = useState(false)
  const [tasksDialogOpen, setTasksDialogOpen] = useState(false)
  const [deepSearchDialogOpen, setDeepSearchDialogOpen] = useState(false)
  const [groupsDialogOpen, setGroupsDialogOpen] = useState(false)

  const { data, isLoading, isError, refetch } = usegetProspectDetails(user?.id, linkedinId)
  console.log(data)

  const handleOpenNotesDialog = () => {
    setNotesDialogOpen(true)
  }

  const handleNotesDialogSuccess = () => {
    refetch() // Refresh prospect details to update notes count and data
  }

  const handleOpenTasksDialog = () => {
    setTasksDialogOpen(true)
  }

  const handleTasksDialogSuccess = () => {
    refetch() // Refresh prospect details to update tasks count and data
  }

  const handleOpenDeepSearchDialog = () => {
    setDeepSearchDialogOpen(true)
  }

  const handleDeepSearchDialogSuccess = () => {
    refetch() // Refresh prospect details to update data
    setDeepSearchDialogOpen(false)
  }

  const handleOpenGroupsDialog = () => {
    setGroupsDialogOpen(true)
  }

  const handleGroupsDialogSuccess = () => {
    refetch() // Refresh prospect details to update groups count and data
  }

  if (isLoading) {
    return (
      <DashboardLayout headerText="Prospect Details">
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <Spinner size="lg" className="mb-4" />
            <p className="text-muted-foreground">Loading prospect details...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (isError || Array.isArray(data) && !data.length) {
    return (
      <DashboardLayout headerText="Prospect Details">
        <div className="flex justify-center items-center py-20">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">
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
        <div className="flex justify-center items-center py-20">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">
                No prospect found with LinkedIn ID: <strong>{linkedinId}</strong>
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout headerText="Prospect Details">
      <GroupsProvider>
        <NotesProvider>
          <TaskProvider>
            <ProspectHeader 
              prospect={data.prospect} 
              onAddNote={handleOpenNotesDialog}
              onCreateTask={handleOpenTasksDialog}
              onAddToDeepResearch={handleOpenDeepSearchDialog}
              onAddToGroup={handleOpenGroupsDialog}
            />
          
          <div className="grid gap-6 px-4 lg:px-6 lg:grid-cols-3 mb-6">
            <CompanyCard company={data.company} />
            
            {/* Optional stats cards can go here in the future */}
            <Card className="lg:col-span-1">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {data.notes?.length || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {data.tasks?.length || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">Tasks</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {data.campaigns?.length || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">Campaigns</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {data.groups?.length || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">Groups</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <TabsPanel
            notes={data.notes}
            tasks={data.tasks}
            enrichment={data.enrichment}
            campaigns={data.campaigns}
            groups={data.groups}
            prospect={data.prospect}
            onAddNote={handleOpenNotesDialog}
            onNotesChanged={handleNotesDialogSuccess}
            onAddTask={handleOpenTasksDialog}
            onTasksChanged={handleTasksDialogSuccess}
            onAddToGroup={handleOpenGroupsDialog}
          />

          {/* ProspectNotesDialog - controlled by ProspectDetails state */}
          {data.prospect && (
            <ProspectNotesDialog
              prospect_id={data.prospect.linkedin_id}
              prospect_name={`${data.prospect.first_name} ${data.prospect.last_name}`.trim()}
              open={notesDialogOpen}
              onOpenChange={setNotesDialogOpen}
              onSuccess={handleNotesDialogSuccess}
            />
          )}

          {/* ProspectTasksDialog - controlled by ProspectDetails state */}
          {data.prospect && (
            <ProspectTasksDialog
              prospect_id={data.prospect.linkedin_id}
              prospect_name={`${data.prospect.first_name} ${data.prospect.last_name}`.trim()}
              open={tasksDialogOpen}
              onOpenChange={setTasksDialogOpen}
              onSuccess={handleTasksDialogSuccess}
            />
          )}

          {/* DeepSearchQueueDialog - controlled by ProspectDetails state */}
          {data.prospect && (
            <DeepSearchQueueDialog
              prospect_ids={[data.prospect.linkedin_id]}
              open={deepSearchDialogOpen}
              onOpenChange={setDeepSearchDialogOpen}
              onSuccess={handleDeepSearchDialogSuccess}
            />
          )}

          {/* HandleGroupsDialog - controlled by ProspectDetails state */}
          {data.prospect && (
            <HandleGroupsDialog
              prospect_ids={[data.prospect.linkedin_id]}
              user_id={data.prospect.user_id}
              open={groupsDialogOpen}
              onOpenChange={setGroupsDialogOpen}
              onSuccess={handleGroupsDialogSuccess}
            />
          )}
          </TaskProvider>
        </NotesProvider>
      </GroupsProvider>
    </DashboardLayout>
  )
}
