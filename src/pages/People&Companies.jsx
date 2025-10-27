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
    const { data, total, query, setQuery, resetFilters, isLoading, refetch, deleteProspect, isError: ProspectIsError } = useProspects()
    const { 
        data: companies, 
        total: companiesTotal, 
        query: companiesQuery, 
        setQuery: setCompaniesQuery, 
        resetFilters: resetCompaniesFilters, 
        isLoading: companiesLoading, 
        refetch: refetchCompanies,
        isError: CompanyIsError,
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

    // Prospect action fallback handler for backend effects (e.g., after confirmed delete)
    const handleProspectActionFallback = async (action, payload) => {
        switch (action) {
            case 'deleteProspect':
                await deleteProspect([payload.linkedin_id])
                refetch()
                break
            case 'deleteProspectsBulk':
                await deleteProspect(payload) // payload is array of selectedIds
                refetch()
                break
            default:
                console.warn(`Unhandled prospect action fallback: ${action}`, payload)
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
          error={ProspectIsError}
          errorMessage={'Error fetching prospects'}
          onProspectActionFallback={handleProspectActionFallback}
        />

        {/* Companies Section */}
        <div className="mt-8 mb-4">
          <h2 className="text-2xl font-semibold">Companies</h2>
          <p className="text-muted-foreground">View and manage your companies</p>
        </div>

        <CompaniesFilterBar
          query={companiesQuery}
          onApplyFilters={setCompaniesQuery}
          onResetFilters={resetCompaniesFilters}
          loading={companiesLoading}
        />
        <CompaniesTable 
          data={companies}
          total={companiesTotal}
          query={companiesQuery}
          onQueryChange={handleCompaniesQueryChange}
          loading={companiesLoading}
          error={CompanyIsError}
          errorMessage={'Error fetching companies'}
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
