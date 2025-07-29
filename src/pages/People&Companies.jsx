import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useProspects } from '@/contexts/ProspectsContext'
import { useCompanies } from '@/contexts/CompaniesContext'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import ProspectsTable from '@/components/people&companies/ProspectsTable'
import CompaniesTable from '@/components/people&companies/CompaniesTable'
import FilterBar from '@/components/people&companies/FilterBar'
import HandleGroupsDialog from '@/components/dialogs/HandleGroupsDialog'
import ProspectNotesDialog from '@/components/dialogs/ProspectNotesDialog'
import ProspectTasksDialog from '@/components/dialogs/ProspectTasksDialog'
import DeepSearchQueueDialog from '@/components/dialogs/DeepSearchQueueDialog'
import ProspectEnrichmentsDialog from '@/components/dialogs/enrichments/ProspectEnrichmentsDialog'
import RemoveFromGroupDialog from '@/components/dialogs/RemoveFromGroupDialog'

function PeopleCompanies() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const { data, total, query, setQuery, resetFilters, isLoading, refetch } = useProspects()
    const { 
        data: companies, 
        total: companiesTotal, 
        query: companiesQuery, 
        setQuery: setCompaniesQuery, 
        resetFilters: resetCompaniesFilters, 
        isLoading: companiesLoading, 
        refetch: refetchCompanies,
        deleteCompany,
        updateCompany
    } = useCompanies()

    // State for HandleGroupsDialog
    const [addGroupOpen, setAddGroupOpen] = useState(false)
    const [prospectIdsForGroup, setProspectIdsForGroup] = useState([])

    // State for ProspectNotesDialog
    const [notesDialogOpen, setNotesDialogOpen] = useState(false)
    const [selectedProspectForNotes, setSelectedProspectForNotes] = useState(null)

    // State for ProspectTasksDialog
    const [tasksDialogOpen, setTasksDialogOpen] = useState(false)
    const [selectedProspectForTasks, setSelectedProspectForTasks] = useState(null)

    // State for DeepSearchQueueDialog
    const [deepSearchDialogOpen, setDeepSearchDialogOpen] = useState(false)
    const [prospectIdsForDeepSearch, setProspectIdsForDeepSearch] = useState([])

    // State for ProspectEnrichmentsDialog
    const [enrichDialogOpen, setEnrichDialogOpen] = useState(false)
    const [prospectIdsForEnrich, setProspectIdsForEnrich] = useState([])

    // State for RemoveFromGroupDialog
    const [removeFromGroupDialogOpen, setRemoveFromGroupDialogOpen] = useState(false)
    const [selectedProspectForRemoval, setSelectedProspectForRemoval] = useState(null)

    // Filter and query handlers for child components
    const handleApplyFilters = (newQuery) => {
        setQuery({ ...newQuery, page: 1 })
    }

    const handleResetFilters = () => {
        resetFilters()
    }

    const handleQueryChange = (queryUpdate) => {
        setQuery(queryUpdate)
    }

    const handleRowClick = (linkedinId) => {
        navigate(`/prospects/${linkedinId}`)
    }

    // Individual prospect action handlers
    const handleAddToGroup = (linkedinId) => {
        setProspectIdsForGroup([linkedinId])
        setAddGroupOpen(true)
    }

    const handleAddToCampaign = (linkedinId) => {
        // TODO: Implement actual API call
        console.log('Add to campaign:', linkedinId)
        alert(`Adding prospect ${linkedinId} to campaign`)
    }

    const handleAddToDeepSearch = (linkedinId) => {
        setProspectIdsForDeepSearch([linkedinId])
        setDeepSearchDialogOpen(true)
    }

    // Notes handler
    const handleAddNote = (linkedinId, prospect) => {
        setSelectedProspectForNotes(prospect)
        setNotesDialogOpen(true)
    }

    // Tasks handler
    const handleCreateTask = (linkedinId, prospect) => {
        setSelectedProspectForTasks(prospect)
        setTasksDialogOpen(true)
    }

    // Bulk action handlers
    const handleBulkAddToGroup = (linkedinIds) => {
        if (!linkedinIds.length) return
        setProspectIdsForGroup(linkedinIds)
        setAddGroupOpen(true)
    }

    const handleBulkAddToCampaign = (linkedinIds) => {
        // TODO: Implement actual API call
        console.log('Bulk add to campaign:', linkedinIds)
        alert(`Adding ${linkedinIds.length} prospects to campaign`)
    }

    const handleBulkAddToDeepSearch = (linkedinIds) => {
        if (!linkedinIds.length) return
        setProspectIdsForDeepSearch(linkedinIds)
        setDeepSearchDialogOpen(true)
    }

    // Create Variables handlers
    const handleCreateVariables = (linkedinId) => {
        setProspectIdsForEnrich([linkedinId])
        setEnrichDialogOpen(true)
    }

    const handleBulkCreateVariables = (linkedinIds) => {
        if (!linkedinIds.length) return
        setProspectIdsForEnrich(linkedinIds)
        setEnrichDialogOpen(true)
    }

    // Remove from group handler
    const handleRemoveFromGroup = (linkedinId, prospect) => {
        setSelectedProspectForRemoval(prospect)
        setRemoveFromGroupDialogOpen(true)
    }

    // Companies query handlers
    const handleCompaniesQueryChange = (queryUpdate) => {
        setCompaniesQuery(queryUpdate)
    }

    // Company action handlers
    const handleBulkDeleteCompanies = (ids) => {
        // TODO: Implement actual API call when deleteCompany is ready
        console.log('Bulk delete companies:', ids)
        alert(`Delete ${ids.length} companies`)
    }

    const handleDeleteCompany = (id) => {
        // TODO: Implement actual API call when deleteCompany is ready
        console.log('Delete company:', id)
        alert(`Delete company ${id}`)
    }

    const handleUpdateCompany = (id) => {
        // TODO: Implement actual API call when updateCompany is ready
        console.log('Update company:', id)
        alert(`Update company ${id}`)
    }

  return (
    <DashboardLayout headerText="Dashboard">
      <div className="px-4 lg:px-6">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">Prospects</h2>
          <p className="text-muted-foreground">View and manage your prospects</p>
        </div>
        
        <FilterBar 
          query={query}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          loading={isLoading}
        />
        <ProspectsTable 
          data={data}
          total={total}
          query={query}
          onQueryChange={handleQueryChange}
          loading={isLoading}
          onRowClick={handleRowClick}
          onAddNote={handleAddNote}
          onCreateTask={handleCreateTask}
          onAddToGroup={handleAddToGroup}
          onAddToCampaign={handleAddToCampaign}
          onAddToDeepSearch={handleAddToDeepSearch}
          onBulkAddToGroup={handleBulkAddToGroup}
          onBulkAddToCampaign={handleBulkAddToCampaign}
          onBulkAddToDeepSearch={handleBulkAddToDeepSearch}
          onCreateVariables={handleCreateVariables}
          onBulkCreateVariables={handleBulkCreateVariables}
          onRemoveFromGroup={handleRemoveFromGroup}
        />

        {/* Companies Section */}
        <div className="mt-8 mb-4">
          <h2 className="text-2xl font-semibold">Companies</h2>
          <p className="text-muted-foreground">View and manage your companies</p>
        </div>

        <CompaniesTable 
          data={companies}
          total={companiesTotal}
          query={companiesQuery}
          onQueryChange={handleCompaniesQueryChange}
          loading={companiesLoading}
          onBulkDelete={handleBulkDeleteCompanies}
          onDelete={handleDeleteCompany}
          onUpdate={handleUpdateCompany}
        />
      </div>
      
      {/* HandleGroupsDialog - controlled by Dashboard state */}
      {!!prospectIdsForGroup.length && <HandleGroupsDialog
        user_id={user?.id}
        prospect_ids={prospectIdsForGroup}
        open={addGroupOpen}
        onOpenChange={setAddGroupOpen}
        onSuccess={() => {
          refetch() // Refresh prospects list after successful group addition
          setAddGroupOpen(false)
          setProspectIdsForGroup([])
        }}
      />}
      
      {/* ProspectNotesDialog - controlled by Dashboard state */}
      {selectedProspectForNotes && (
        <ProspectNotesDialog
          prospect_id={selectedProspectForNotes.linkedin_id}
          prospect_name={`${selectedProspectForNotes.first_name} ${selectedProspectForNotes.last_name}`.trim()}
          open={notesDialogOpen}
          onOpenChange={setNotesDialogOpen}
          onSuccess={() => {
            refetch() // Refresh prospects list to update note count
          }}
        />
      )}
      
      {/* ProspectTasksDialog - controlled by Dashboard state */}
      {selectedProspectForTasks && (
        <ProspectTasksDialog
          prospect_id={selectedProspectForTasks.linkedin_id}
          prospect_name={`${selectedProspectForTasks.first_name} ${selectedProspectForTasks.last_name}`.trim()}
          open={tasksDialogOpen}
          onOpenChange={setTasksDialogOpen}
          onSuccess={() => {
            refetch() // Refresh prospects list to update task count
          }}
        />
      )}
      
      {/* DeepSearchQueueDialog - controlled by Dashboard state */}
      {!!prospectIdsForDeepSearch.length && <DeepSearchQueueDialog
        prospect_ids={prospectIdsForDeepSearch}
        open={deepSearchDialogOpen}
        onOpenChange={setDeepSearchDialogOpen}
        onSuccess={() => {
          refetch() // Refresh prospects list after successful addition
          setDeepSearchDialogOpen(false)
          setProspectIdsForDeepSearch([])
        }}
      />}
      
      {/* ProspectEnrichmentsDialog - controlled by Dashboard state */}
      {!!prospectIdsForEnrich.length && <ProspectEnrichmentsDialog
        user_id={user?.id}
        prospectIds={prospectIdsForEnrich}
        open={enrichDialogOpen}
        onOpenChange={setEnrichDialogOpen}
        onSuccess={() => {
          refetch() // Refresh prospects list after successful variable creation
          setEnrichDialogOpen(false)
          setProspectIdsForEnrich([])
        }}
      />}
      
      {/* RemoveFromGroupDialog - controlled by Dashboard state */}
      {selectedProspectForRemoval && (
        <RemoveFromGroupDialog
          prospect_id={selectedProspectForRemoval.linkedin_id}
          prospect_name={`${selectedProspectForRemoval.first_name} ${selectedProspectForRemoval.last_name}`.trim()}
          open={removeFromGroupDialogOpen}
          onOpenChange={setRemoveFromGroupDialogOpen}
          onSuccess={() => {
            refetch() // Refresh prospects list after successful group removal
            setRemoveFromGroupDialogOpen(false)
            setSelectedProspectForRemoval(null)
          }}
        />
      )}
    </DashboardLayout>
  )
}

export default PeopleCompanies
