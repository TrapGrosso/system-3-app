import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { useProspects } from '@/contexts/ProspectsContext'
import { useDeepSearchQueue } from '@/contexts/DeepSearchQueueContext'
import { GroupsProvider } from '@/contexts/GroupsContext'
import { NotesProvider } from '@/contexts/NotesContext'
import { TaskProvider } from '@/contexts/TaskContext'
import { usegetProspectDetails } from '@/api/prospect-details/useGetProspectsDetails'
import { useDeleteEnrichments } from '@/api/prospect-details/deleteEnrichments'
import { toast } from 'sonner'
import ProspectNotesDialog from '@/components/dialogs/ProspectNotesDialog'
import ProspectTasksDialog from '@/components/dialogs/ProspectTasksDialog'
import ProspectVariablesDialog from '@/components/dialogs/ProspectVariablesDialog'
import DeepSearchQueueDialog from '@/components/dialogs/DeepSearchQueueDialog'
import HandleGroupsDialog from '@/components/dialogs/HandleGroupsDialog'
import ChangeCompanyDialog from '@/components/dialogs/changeCompany/ChangeCompanyDialog'
import UpdateCompanyDialog from '@/components/dialogs/UpdateCompanyDialog'
import UpdateProspectDialog from '@/components/dialogs/UpdateProspectDialog'
import { PromptSelectDialog } from '@/components/dialogs/PromptSelectDialog'
import ResolveDeepSearchItem from '@/components/dialogs/ResolveDeepSearchItem'
import {
  ProspectHeader,
  CompanyCard,
  TabsPanel,
} from '@/components/prospect-details'

export default function ProspectDetails() {
  const { user } = useAuth()
  const { linkedinId } = useParams()
  const navigate = useNavigate()
  const { deleteProspect } = useProspects()
  const { deleteProspects: deleteQueueItem } = useDeepSearchQueue()
  
  const [notesDialogOpen, setNotesDialogOpen] = useState(false)
  const [tasksDialogOpen, setTasksDialogOpen] = useState(false)
  const [variablesDialogOpen, setVariablesDialogOpen] = useState(false)
  const [deepSearchDialogOpen, setDeepSearchDialogOpen] = useState(false)
  const [groupsDialogOpen, setGroupsDialogOpen] = useState(false)
  const [changeCompanyDialogOpen, setChangeCompanyDialogOpen] = useState(false)
  const [updateCompanyDialogOpen, setUpdateCompanyDialogOpen] = useState(false)
  const [updateProspectDialogOpen, setUpdateProspectDialogOpen] = useState(false)
  const [promptSelectDialogOpen, setPromptSelectDialogOpen] = useState(false)
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false)

  const { data, isLoading, isError, refetch } = usegetProspectDetails(user?.id, linkedinId)

  const deleteEnrichments = useDeleteEnrichments({
    onSuccess: (data) => {
      toast.success(data.message || 'Enrichment(s) deleted successfully')
      refetch() // Refresh prospect details to update enrichment data
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete enrichment(s)')
    },
  })

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

  const handleOpenVariablesDialog = () => {
    setVariablesDialogOpen(true)
  }

  const handleVariablesDialogSuccess = () => {
    refetch() // Refresh prospect details to update variables count and data
  }

  const handleGroupsDialogSuccess = () => {
    refetch() // Refresh prospect details to update groups count and data
  }

  const handleOpenChangeCompanyDialog = () => {
    setChangeCompanyDialogOpen(true)
  }

  const handleChangeCompanyDialogSuccess = () => {
    refetch() // Refresh prospect details to update company data
    setChangeCompanyDialogOpen(false)
  }

  const handleOpenUpdateCompanyDialog = () => {
    setUpdateCompanyDialogOpen(true)
  }

  const handleUpdateCompanyDialogSuccess = () => {
    refetch() // Refresh prospect details to update company data
    setUpdateCompanyDialogOpen(false)
  }

  const handleDeleteEnrichment = (enrichmentId) => {
    deleteEnrichments.mutate({
      user_id: user.id,
      enrichment_ids: [enrichmentId]
    })
  }

  // New prospect action handlers
  const handleOpenUpdateProspectDialog = () => {
    setUpdateProspectDialogOpen(true)
  }

  const handleUpdateProspectDialogSuccess = () => {
    refetch() // Refresh prospect details to update prospect data
    setUpdateProspectDialogOpen(false)
  }

  const handleDeleteProspect = async () => {
    try {
      await deleteProspect(data.prospect.linkedin_id)
      navigate('/dashboard')
    } catch (error) {
      // Error handling is done in the context layer via toast
      console.error('Failed to delete prospect:', error)
    }
  }

  const handleOpenPromptSelectDialog = () => {
    setPromptSelectDialogOpen(true)
  }

  const handlePromptSelectDialogSuccess = () => {
    refetch() // Refresh prospect details to update queue data
    setPromptSelectDialogOpen(false)
  }

  const handleOpenResolveDialog = () => {
    setResolveDialogOpen(true)
  }

  const handleResolveDialogSuccess = () => {
    refetch() // Refresh prospect details to update data
    setResolveDialogOpen(false)
  }

  const handleRemoveFromQueue = async () => {
    try {
      await deleteQueueItem(data.deep_search.queue_id)
      refetch() // Refresh prospect details to update queue status
    } catch (error) {
      // Error handling is done in the context layer via toast
      console.error('Failed to remove from queue:', error)
    }
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
              deepSearch={data.deep_search}
              onUpdateProspect={handleOpenUpdateProspectDialog}
              onDeleteProspect={handleDeleteProspect}
              onUpdateQueuePrompt={handleOpenPromptSelectDialog}
              onRemoveFromQueue={handleRemoveFromQueue}
              onResolveDeepSearchItem={handleOpenResolveDialog}
              onAddNote={handleOpenNotesDialog}
              onCreateTask={handleOpenTasksDialog}
              onAddToDeepResearch={handleOpenDeepSearchDialog}
              onAddToGroup={handleOpenGroupsDialog}
            />
          
          <div className="grid gap-6 px-4 lg:px-6 lg:grid-cols-3 mb-6">
            <CompanyCard 
              company={data.company} 
              prospect={data.prospect}
              onAddCompany={handleOpenChangeCompanyDialog}
              onEditCompany={handleOpenUpdateCompanyDialog}
              refetchProspectDetails={refetch}
            />
            
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
            variables={data.variables}
            prospect={data.prospect}
            onAddNote={handleOpenNotesDialog}
            onNotesChanged={handleNotesDialogSuccess}
            onAddTask={handleOpenTasksDialog}
            onTasksChanged={handleTasksDialogSuccess}
            onAddVariable={handleOpenVariablesDialog}
            onVariablesChanged={handleVariablesDialogSuccess}
            onAddToGroup={handleOpenGroupsDialog}
            onDeleteEnrichment={handleDeleteEnrichment}
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

          {/* ProspectVariablesDialog - controlled by ProspectDetails state */}
          {data.prospect && (
            <ProspectVariablesDialog
              prospect_id={data.prospect.linkedin_id}
              prospect_name={`${data.prospect.first_name} ${data.prospect.last_name}`.trim()}
              open={variablesDialogOpen}
              onOpenChange={setVariablesDialogOpen}
              onSuccess={handleVariablesDialogSuccess}
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

          {/* ChangeCompanyDialog - controlled by ProspectDetails state */}
          {data.prospect && (
            <ChangeCompanyDialog
              prospectId={data.prospect.linkedin_id}
              open={changeCompanyDialogOpen}
              onOpenChange={setChangeCompanyDialogOpen}
              onSuccess={handleChangeCompanyDialogSuccess}
            />
          )}

          {/* UpdateCompanyDialog - controlled by ProspectDetails state */}
          {data.company && (
            <UpdateCompanyDialog
              open={updateCompanyDialogOpen}
              onOpenChange={setUpdateCompanyDialogOpen}
              company={data.company}
              onSuccess={handleUpdateCompanyDialogSuccess}
            />
          )}

          {/* UpdateProspectDialog - controlled by ProspectDetails state */}
          {data.prospect && (
            <UpdateProspectDialog
              open={updateProspectDialogOpen}
              onOpenChange={setUpdateProspectDialogOpen}
              prospect={data.prospect}
              onSuccess={handleUpdateProspectDialogSuccess}
            />
          )}

          {/* PromptSelectDialog - controlled by ProspectDetails state */}
          {data.deep_search?.is_in_queue && (
            <PromptSelectDialog
              open={promptSelectDialogOpen}
              onOpenChange={setPromptSelectDialogOpen}
              queueItemIds={[data.deep_search.queue_id]}
              onSuccess={handlePromptSelectDialogSuccess}
            />
          )}

          {/* ResolveDeepSearchItem - controlled by ProspectDetails state */}
          {data.deep_search?.is_in_queue && (
            <ResolveDeepSearchItem
              queueIds={[data.deep_search.queue_id]}
              open={resolveDialogOpen}
              onOpenChange={setResolveDialogOpen}
              onSuccess={handleResolveDialogSuccess}
            />
          )}
          </TaskProvider>
        </NotesProvider>
      </GroupsProvider>
    </DashboardLayout>
  )
}
