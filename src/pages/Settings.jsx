import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import OperationSection from "@/components/settings/OperationSection"
import { OPERATION_SCHEMAS } from "@/components/settings/operationSettingsSchema"

export default function Settings() {
  const operations = Object.keys(OPERATION_SCHEMAS)

  return (
    <DashboardLayout>
      <div className="px-4">
        <h1 className="text-2xl font-bold mb-6">Operation Default Settings</h1>
        <Tabs defaultValue={operations[0]} className="w-full">
          <TabsList className="flex flex-wrap gap-2 mb-4">
            {operations.map((op) => (
              <TabsTrigger key={op} value={op} className="capitalize">
                {op.replace(/_/g, " ")}
              </TabsTrigger>
            ))}
          </TabsList>
          {operations.map((op) => (
            <TabsContent key={op} value={op}>
              <OperationSection operation={op} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
