import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from "@/components/layouts/DashboardLayout"

export default function Campaigns() {
    const { user } = useAuth()

    return (
        <DashboardLayout headerText="Campaigns">
            <div className="px-4 lg:px-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">Campaign Management</h2>
                        <p className="text-muted-foreground">Create and manage your marketing campaigns</p>
                    </div>
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                        Create Campaign
                    </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold">Summer Sale 2024</h3>
                                <p className="text-sm text-muted-foreground">Email Campaign</p>
                            </div>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span className="text-sm">Opens:</span>
                                <span className="text-sm font-medium">2,340</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Clicks:</span>
                                <span className="text-sm font-medium">456</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Conversions:</span>
                                <span className="text-sm font-medium">89</span>
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            <button className="text-sm px-3 py-1 border rounded hover:bg-accent">Edit</button>
                            <button className="text-sm px-3 py-1 border rounded hover:bg-accent">View Report</button>
                        </div>
                    </div>
                    
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold">Product Launch</h3>
                                <p className="text-sm text-muted-foreground">Social Media Campaign</p>
                            </div>
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Scheduled</span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span className="text-sm">Start Date:</span>
                                <span className="text-sm font-medium">Dec 15, 2024</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Budget:</span>
                                <span className="text-sm font-medium">$5,000</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Target Audience:</span>
                                <span className="text-sm font-medium">Tech Enthusiasts</span>
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            <button className="text-sm px-3 py-1 border rounded hover:bg-accent">Edit</button>
                            <button className="text-sm px-3 py-1 border rounded hover:bg-accent">Preview</button>
                        </div>
                    </div>
                    
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold">Holiday Promotion</h3>
                                <p className="text-sm text-muted-foreground">Multi-channel Campaign</p>
                            </div>
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Completed</span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span className="text-sm">Total Reach:</span>
                                <span className="text-sm font-medium">15,670</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Engagement:</span>
                                <span className="text-sm font-medium">8.4%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">ROI:</span>
                                <span className="text-sm font-medium">245%</span>
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            <button className="text-sm px-3 py-1 border rounded hover:bg-accent">View Report</button>
                            <button className="text-sm px-3 py-1 border rounded hover:bg-accent">Duplicate</button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
