import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { useFetchProspects } from '@/api/dashboard/fetchProspects'
import ProspectsTable from '@/components/dashboard/ProspectsTable'
import { Spinner } from '@/components/ui/spinner'

export default function Dashboard() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()

    const { data: prospects = [], isLoading, isError } = useFetchProspects(user?.id)

    const handleLogout = async () => {
        await signOut()
    }

    const handleRowClick = (linkedinId) => {
        navigate(`/prospects/${linkedinId}`)
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
        
        {!isLoading && !isError && <ProspectsTable prospects={prospects} onRowClick={handleRowClick} />}
      </div>
    </DashboardLayout>
  )
}
