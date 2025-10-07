import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { GetHelpForm } from "@/components/get-help/GetHelpForm"

export function GetHelp() {
    return (
        <DashboardLayout headerText="Get Help">
            <GetHelpForm />
        </DashboardLayout>
    )
}
