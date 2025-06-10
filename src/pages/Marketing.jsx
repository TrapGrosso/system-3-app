import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from "@/components/layouts/DashboardLayout"

export default function Marketing() {
    const { user } = useAuth()

    return (
        <DashboardLayout headerText="Marketing">
            <div className="px-4 lg:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                        <h3 className="text-lg font-semibold mb-2">Campaign Performance</h3>
                        <p className="text-3xl font-bold text-primary">24.5%</p>
                        <p className="text-sm text-muted-foreground">Conversion Rate</p>
                    </div>
                    
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                        <h3 className="text-lg font-semibold mb-2">Total Reach</h3>
                        <p className="text-3xl font-bold text-primary">12.4K</p>
                        <p className="text-sm text-muted-foreground">People Reached</p>
                    </div>
                    
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                        <h3 className="text-lg font-semibold mb-2">ROI</h3>
                        <p className="text-3xl font-bold text-primary">3.2x</p>
                        <p className="text-sm text-muted-foreground">Return on Investment</p>
                    </div>
                </div>
                
                <div className="mt-6">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                        <h2 className="text-2xl font-bold mb-4">Marketing Analytics</h2>
                        <p className="text-muted-foreground mb-6">
                            Track your marketing performance and optimize your campaigns.
                        </p>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 border rounded-lg">
                                <div>
                                    <h4 className="font-medium">Email Campaign #1</h4>
                                    <p className="text-sm text-muted-foreground">Sent 2 days ago</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">18.2% CTR</p>
                                    <p className="text-sm text-muted-foreground">1,240 opens</p>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center p-4 border rounded-lg">
                                <div>
                                    <h4 className="font-medium">Social Media Campaign</h4>
                                    <p className="text-sm text-muted-foreground">Active</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">5.8% Engagement</p>
                                    <p className="text-sm text-muted-foreground">3,450 impressions</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
