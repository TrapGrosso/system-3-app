import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import AddLeadsSettings from "@/components/settings/sections/AddLeadsSettings"
import CreateVariablesWithAiSettings from "@/components/settings/sections/CreateVariablesWithAiSettings"
import FindEmailsClearoutSettings from "@/components/settings/sections/FindEmailsClearoutSettings"
import ResolveDeepSearchQueueSettings from "@/components/settings/sections/ResolveDeepSearchQueueSettings"
import SearchCompanyWithAiSettings from "@/components/settings/sections/SearchCompanyWithAiSettings"
import VerifyEmailsClearoutSettings from "@/components/settings/sections/VerifyEmailsClearoutSettings"

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="px-4">
        <h1 className="text-2xl font-bold mb-6">Operation Default Settings</h1>
        <div className="space-y-6">
          <AddLeadsSettings />
          <CreateVariablesWithAiSettings />
          <FindEmailsClearoutSettings />
          <ResolveDeepSearchQueueSettings />
          <SearchCompanyWithAiSettings />
          <VerifyEmailsClearoutSettings />
        </div>
      </div>
    </DashboardLayout>
  )
}
