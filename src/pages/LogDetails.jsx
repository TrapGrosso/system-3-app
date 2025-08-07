import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

export default function LogDetails() {
    const { logId } = useParams()

    return (
        <DashboardLayout headerText="Log Details">
            <h1>Showing page for log: {logId}</h1>
        </DashboardLayout>
    )
}