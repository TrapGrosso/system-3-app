import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

export default function CampaignDetails() {
    const { campaignId } = useParams()

    return (
        <DashboardLayout>
            <h1>Rendering campaign details for campaign: {campaignId}</h1>
        </DashboardLayout>
    )
}