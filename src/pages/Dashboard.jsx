import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive"
import { SectionCards } from "@/components/dashboard/section-cards"

function Dashboard() {
  return (
    <DashboardLayout headerText="Dashboard">
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
    </DashboardLayout>
  )
}

export default Dashboard
