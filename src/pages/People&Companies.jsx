import { useAuth } from '@/contexts/AuthContext'
import { useProspects } from '@/contexts/ProspectsContext'
import { useCompanies } from '@/contexts/CompaniesContext'
import { useDialogs } from '@/contexts/DialogsContext'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import ProspectsTable from '@/components/people&companies/ProspectsTable'
import CompaniesTable from '@/components/people&companies/CompaniesTable'
import FilterBar from '@/components/people&companies/FilterBar'
import CompaniesFilterBar from '@/components/people&companies/CompaniesFilterBar'

function PeopleCompanies() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const { data, total, query, setQuery, resetFilters, isLoading, refetch, deleteProspect } = useProspects()
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

    // Use dialogs context instead of local state
    const { confirm, open } = useDialogs()

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

    // Individual prospect action handlers using dialogs context
    const handleAddToGroup = async (linkedinId) => {
        await open('handleGroups', { user_id: user?.id, prospect_ids: [linkedinId] })
        refetch()
    }

    const handleAddToCampaign = async (linkedinId) => {
        await open('addToCampaign', { prospect_ids: [linkedinId] })
        refetch()
    }

    const handleAddToDeepSearch = async (linkedinId) => {
        await open('deepSearchQueue', { prospect_ids: [linkedinId] })
        refetch()
    }

    // Notes handler
    const handleAddNote = async (linkedinId, prospect) => {
      console.log(prospect)
        await open('prospectNotes', { prospect })
        refetch()
    }

    // Tasks handler
    const handleCreateTask = async (linkedinId, prospect) => {
        await open('prospectTasks', { prospect })
        refetch()
    }

    // Find Prospect Emails handlers
    const handleFindEmails = async (linkedinId) => {
        await open('findProspectEmails', { prospect_ids: [linkedinId] })
        refetch()
    }

    const handleBulkFindEmails = async (linkedinIds) => {
        if (!linkedinIds.length) return
        await open('findProspectEmails', { prospect_ids: linkedinIds })
        refetch()
    }

    // Verify Prospect Emails handlers
    const handleVerifyEmails = async (linkedinId) => {
        await open('verifyProspectEmails', { prospect_ids: [linkedinId] })
        refetch()
    }

    const handleBulkVerifyEmails = async (linkedinIds) => {
        if (!linkedinIds.length) return
        await open('verifyProspectEmails', { prospect_ids: linkedinIds })
        refetch()
    }

    // Bulk action handlers
    const handleBulkAddToGroup = async (linkedinIds) => {
        if (!linkedinIds.length) return
        await open('handleGroups', { user_id: user?.id, prospect_ids: linkedinIds })
        refetch()
    }

    const handleBulkAddToCampaign = async (linkedinIds) => {
        if (!linkedinIds.length) return
        await open('addToCampaign', { prospect_ids: linkedinIds })
        refetch()
    }

    const handleBulkAddToDeepSearch = async (linkedinIds) => {
        if (!linkedinIds.length) return
        await open('deepSearchQueue', { prospect_ids: linkedinIds })
        refetch()
    }

    // Create Variables handlers
    const handleCreateVariables = async (linkedinId) => {
        await open('prospectEnrichments', { user_id: user?.id, prospectIds: [linkedinId] })
        refetch()
    }

    const handleBulkCreateVariables = async (linkedinIds) => {
        if (!linkedinIds.length) return
        await open('prospectEnrichments', { user_id: user?.id, prospectIds: linkedinIds })
        refetch()
    }

    // Remove from group handler
    const handleRemoveFromGroup = async (linkedinId, prospect) => {
        await open('removeFromGroup', { prospect })
        refetch()
    }

    // Remove from campaign handler (single only)
    const handleRemoveFromCampaign = async (linkedinId, prospect) => {
        await open('removeFromCampaign', { prospect })
        refetch()
    }

    // Companies query handlers
    const handleCompaniesQueryChange = (queryUpdate) => {
        setCompaniesQuery(queryUpdate)
    }

    // Company action handlers using dialogs context
    const handleBulkDeleteCompanies = async (ids) => {
        if (!ids.length) return
        if (await confirm({ 
            title: 'Delete Companies', 
            description: `Are you sure you want to delete ${ids.length} companies? This action cannot be undone.`,
            confirmLabel: `Delete ${ids.length}`,
            size: 'md'
        })) {
            await deleteCompany(ids)
            refetchCompanies()
        }
    }

    const handleDeleteCompany = async (company) => {
        if (await confirm({ 
            title: 'Delete Company', 
            description: `Are you sure you want to delete "${company.name}"? This action cannot be undone.`,
            confirmLabel: 'Delete'
        })) {
            await deleteCompany([company.linkedin_id])
            refetchCompanies()
        }
    }

    const handleUpdateCompany = async (company) => {
        await open('updateCompany', { company })
        refetchCompanies()
    }

    // Prospect action handlers using dialogs context
    const handleUpdateProspect = async (prospect) => {
        await open('updateProspect', { prospect })
        refetch()
    }

    const handleBulkDeleteProspects = async (ids) => {
        if (!ids.length) return
        if (await confirm({ 
            title: 'Delete Prospects', 
            description: `Are you sure you want to delete ${ids.length} prospects? This action cannot be undone.`,
            confirmLabel: `Delete ${ids.length}`,
            size: 'md'
        })) {
            await deleteProspect(ids)
            refetch()
        }
    }

    const handleDeleteProspect = async (prospect) => {
        if (await confirm({ 
            title: 'Delete Prospect', 
            description: `Are you sure you want to delete "${prospect.first_name} ${prospect.last_name}"? This action cannot be undone.`,
            confirmLabel: 'Delete'
        })) {
            await deleteProspect([prospect.linkedin_id])
            refetch()
        }
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
          onRemoveFromCampaign={handleRemoveFromCampaign}
          onUpdate={handleUpdateProspect}
          onDelete={handleDeleteProspect}
          onBulkDelete={handleBulkDeleteProspects}
          onFindEmails={handleFindEmails}
          onBulkFindEmails={handleBulkFindEmails}
          onVerifyEmails={handleVerifyEmails}
          onBulkVerifyEmails={handleBulkVerifyEmails}
        />

        {/* Companies Section */}
        <div className="mt-8 mb-4">
          <h2 className="text-2xl font-semibold">Companies</h2>
          <p className="text-muted-foreground">View and manage your companies</p>
        </div>

        <CompaniesFilterBar
          query={companiesQuery}
          onApplyFilters={(q) => setCompaniesQuery({ ...q, page: 1 })}
          onResetFilters={resetCompaniesFilters}
          loading={companiesLoading}
        />
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
      {/* All dialogs are now handled by DialogsProvider */}
    </DashboardLayout>
  )
}

export default PeopleCompanies
