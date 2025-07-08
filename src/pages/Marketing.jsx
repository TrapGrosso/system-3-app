import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { Button } from "@/components/ui/button"
import { useDeepSearchQueue } from '@/contexts/DeepSearchQueueContext'
import DeepSearchQueueTable from '@/components/marketing/DeepSearchQueueTable'

export default function Marketing() {
    const { user } = useAuth()
    const { resolveAll } = useDeepSearchQueue()

    return (
        <DashboardLayout headerText="Marketing">
            <div className="px-4 lg:px-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Deep Search Queue</h2>
                        <p className="text-muted-foreground">
                            Manage and process your deep search queue items
                        </p>
                    </div>
                    <Button onClick={resolveAll}>
                        Resolve Entire Queue
                    </Button>
                </div>
                
                <DeepSearchQueueTable />
            </div>
        </DashboardLayout>
    )
}
