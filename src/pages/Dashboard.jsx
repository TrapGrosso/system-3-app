import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useProspects } from '@/contexts/ProspectsContext'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import ProspectsTable from '@/components/dashboard/ProspectsTable'
import { Spinner } from '@/components/ui/spinner'
import HandleGroupsDialog from '@/components/dialogs/HandleGroupsDialog'

export default function Dashboard() {
    const { user, signOut } = useAuth()
    const { prospects, isLoading, isError, refetch: refetchProspects } = useProspects()
    const navigate = useNavigate()

    // State for HandleGroupsDialog
    const [addGroupOpen, setAddGroupOpen] = useState(false)
    const [prospectIdsForGroup, setProspectIdsForGroup] = useState([])

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
        // TODO: Implement actual API call
        console.log('Add to deep search queue:', linkedinId)
        alert(`Adding prospect ${linkedinId} to deep search queue`)
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
        // TODO: Implement actual API call
        console.log('Bulk add to deep search queue:', linkedinIds)
        alert(`Adding ${linkedinIds.length} prospects to deep search queue`)
    }

  return (
    <DashboardLayout headerText="Dashboard">
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      
      <div className="px-4 lg:px-6 mt-8">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">Prospects</h2>
          <p className="text-muted-foreground">View and manage your prospects</p>
        </div>
        
        {isLoading && (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        )}
        
        {isError && (
          <div className="text-center py-8">
            <p className="text-destructive">Failed to load prospects. Please try again.</p>
          </div>
        )}
        
        {!isLoading && !isError && (
          <ProspectsTable 
            prospects={prospects} 
            onRowClick={handleRowClick}
            onAddToGroup={handleAddToGroup}
            onAddToCampaign={handleAddToCampaign}
            onAddToDeepSearch={handleAddToDeepSearch}
            onBulkAddToGroup={handleBulkAddToGroup}
            onBulkAddToCampaign={handleBulkAddToCampaign}
            onBulkAddToDeepSearch={handleBulkAddToDeepSearch}
          />
        )}
      </div>
      
      {/* HandleGroupsDialog - controlled by Dashboard state */}
      <HandleGroupsDialog
        user_id={user?.id}
        prospect_ids={prospectIdsForGroup}
        open={addGroupOpen}
        onOpenChange={setAddGroupOpen}
        onSuccess={() => {
          refetchProspects() // Refresh prospects list after successful group addition
          setAddGroupOpen(false)
          setProspectIdsForGroup([])
        }}
      />
    </DashboardLayout>
  )
}
