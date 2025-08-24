import React from 'react'
import { useParams } from 'react-router-dom'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, Search } from 'lucide-react'
import { LoadingScreen } from '@/components/shared/ui/LoadingScreen'
import { useAuth } from '@/contexts/AuthContext'
import { usegetProspectDetails } from '@/api/prospect-details/useGetProspectsDetails'
import { toast } from 'sonner'
import { useDialogs } from '@/contexts/DialogsContext'
import {
  ProspectHeader,
  CompanyCard,
  TabsPanel,
  ProspectStatsGrid,
} from '@/components/prospect-details'

export default function ProspectDetails() {
  const { user } = useAuth()
  const { linkedinId } = useParams()
  

  const { data, isLoading, isError, refetch } = usegetProspectDetails(user?.id, linkedinId)

  const {
    openProspectNotes,
    openProspectTasks,
    openProspectVariables,
    openDeepSearchQueue,
    openHandleGroups,
    openChangeCompany,
    openUpdateCompany,
    openUpdateProspect,
    openPromptSelect,
    openResolveDeepSearchItem,
    openProspectEnrichments,
    openRemoveFromCampaign,
    openAddToCampaign,
    confirm
  } = useDialogs()

  const handleOpenNotesDialog = async () => {
    await openProspectNotes({ prospect: data.prospect })
    refetch()
  }

  const handleOpenTasksDialog = async () => {
    await openProspectTasks({ prospect: data.prospect })
    refetch()
  }

  const handleOpenDeepSearchDialog = async () => {
    await openDeepSearchQueue({ prospect_ids: [data.prospect.linkedin_id] })
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

  // New prospect action handlers
  const handleOpenUpdateProspectDialog = async () => {
    await openUpdateProspect({ prospect: data.prospect })
    refetch()
  }

  const handleOpenPromptSelectDialog = async () => {
    if (data.deep_search?.is_in_queue) {
      await openPromptSelect({ queueItemIds: [data.deep_search.queue_id], selectedCount: 1 })
      refetch()
    }
  }

  const handleOpenResolveDialog = async () => {
    if (data.deep_search?.is_in_queue) {
      await openResolveDeepSearchItem({ queueIds: [data.deep_search.queue_id] })
      refetch()
    }
  }

  // RemoveFromCampaign dialog handlers
  const handleOpenRemoveFromCampaignDialog = async () => {
    await openRemoveFromCampaign({ prospect: data.prospect })
    refetch()
  }

  // AddToCampaign dialog handlers
  const handleOpenAddToCampaignDialog = async () => {
    await openAddToCampaign({ prospect_ids: [data.prospect.linkedin_id] })
    refetch()
  }

  // Enrichments dialog handlers
  const handleOpenEnrichmentsDialog = async () => {
    await openProspectEnrichments({ user_id: user.id, prospectIds: [data.prospect.linkedin_id] })
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
            <ProspectHeader 
              prospect={data.prospect} 
              deepSearch={data.deep_search}
              onUpdateProspect={handleOpenUpdateProspectDialog}
              onUpdateQueuePrompt={handleOpenPromptSelectDialog}
              onResolveDeepSearchItem={handleOpenResolveDialog}
              onAddNote={handleOpenNotesDialog}
              onCreateTask={handleOpenTasksDialog}
              onAddToDeepResearch={handleOpenDeepSearchDialog}
              onAddToGroup={handleOpenGroupsDialog}
              onAddToCampaign={handleOpenAddToCampaignDialog}
              onCreateVariables={handleOpenEnrichmentsDialog}
              onRefetch={refetch}
            />
          
          <div className="grid gap-6 px-4 lg:px-6 lg:grid-cols-3 mb-6">
            <CompanyCard 
              company={data.company} 
              prospect={data.prospect}
              onAddCompany={handleOpenChangeCompanyDialog}
              onEditCompany={handleOpenUpdateCompanyDialog}
              refetchProspectDetails={refetch}
            />
            
            <ProspectStatsGrid
              notes={data.notes}
              tasks={data.tasks}
              campaigns={data.campaigns}
              groups={data.groups}
              variables={data.variables}
              enrichment={data.enrichment}
              deepSearch={data.deep_search}
            />
          </div>

          <TabsPanel
            notes={data.notes}
            tasks={data.tasks}
            enrichment={data.enrichment}
            campaigns={data.campaigns}
            groups={data.groups}
            variables={data.variables}
            logs={data.logs}
            prospect={data.prospect}
            onAddNote={handleOpenNotesDialog}
            onNotesChanged={handleOpenNotesDialog}
            onAddTask={handleOpenTasksDialog}
            onTasksChanged={handleOpenTasksDialog}
            onAddVariable={handleOpenVariablesDialog}
            onVariablesChanged={handleOpenVariablesDialog}
            onAddToGroup={handleOpenGroupsDialog}
            onOpenRemoveFromCampaign={handleOpenRemoveFromCampaignDialog}
            onAddToCampaign={handleOpenAddToCampaignDialog}
            onRefetch={refetch}
          />
    </DashboardLayout>
  )
}
