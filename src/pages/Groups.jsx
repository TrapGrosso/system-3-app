import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from "@/components/layouts/DashboardLayout"

export default function Groups() {
    const { user } = useAuth()

    return (
        <DashboardLayout headerText="Groups">
            <div className="flex justify-center items-center">
                <h1>Groups Placeholder</h1>
            </div>
        </DashboardLayout>
    )
}
