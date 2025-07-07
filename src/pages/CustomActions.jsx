import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from "@/components/layouts/DashboardLayout"

export default function CustomActions() {
    const { user } = useAuth()

    return (
        <DashboardLayout headerText="Custom Actions">
            <div className="px-4 lg:px-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">Custom Actions</h2>
                        <p className="text-muted-foreground">Create and manage automated actions and workflows</p>
                    </div>
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                        Create Action
                    </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold">Auto Lead Scoring</h3>
                                <p className="text-sm text-muted-foreground">Automatically score new leads</p>
                            </div>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span className="text-sm">Trigger:</span>
                                <span className="text-sm font-medium">New Lead Added</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Executed:</span>
                                <span className="text-sm font-medium">2,340 times</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Success Rate:</span>
                                <span className="text-sm font-medium">98.5%</span>
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <p className="text-sm text-muted-foreground">
                                Analyzes company size, industry, and role to assign lead scores automatically.
                            </p>
                        </div>
                        
                        <div className="flex gap-2">
                            <button className="text-sm px-3 py-1 border rounded hover:bg-accent">Edit</button>
                            <button className="text-sm px-3 py-1 border rounded hover:bg-accent">View Logs</button>
                        </div>
                    </div>
                    
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold">Weekly Report Email</h3>
                                <p className="text-sm text-muted-foreground">Send weekly performance reports</p>
                            </div>
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Scheduled</span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span className="text-sm">Trigger:</span>
                                <span className="text-sm font-medium">Every Monday 9 AM</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Recipients:</span>
                                <span className="text-sm font-medium">5 team members</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Next Run:</span>
                                <span className="text-sm font-medium">Dec 16, 2024</span>
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <p className="text-sm text-muted-foreground">
                                Compiles and sends weekly performance metrics to the sales team.
                            </p>
                        </div>
                        
                        <div className="flex gap-2">
                            <button className="text-sm px-3 py-1 border rounded hover:bg-accent">Edit</button>
                            <button className="text-sm px-3 py-1 border rounded hover:bg-accent">Run Now</button>
                        </div>
                    </div>
                    
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold">Slack Notifications</h3>
                                <p className="text-sm text-muted-foreground">Notify team of high-value leads</p>
                            </div>
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Paused</span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span className="text-sm">Trigger:</span>
                                <span className="text-sm font-medium">Lead Score &gt; 80</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Channel:</span>
                                <span className="text-sm font-medium">#sales-alerts</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Last Triggered:</span>
                                <span className="text-sm font-medium">Dec 10, 2024</span>
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <p className="text-sm text-muted-foreground">
                                Sends Slack notifications when high-value leads are identified.
                            </p>
                        </div>
                        
                        <div className="flex gap-2">
                            <button className="text-sm px-3 py-1 border rounded hover:bg-accent">Resume</button>
                            <button className="text-sm px-3 py-1 border rounded hover:bg-accent">Edit</button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
