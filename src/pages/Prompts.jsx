import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from "@/components/layouts/DashboardLayout"

export default function Prompts() {
    const { user } = useAuth()
    const firstName = "Fabio"
    const industry = "Trap"
    const topic = "Rap"

    return (
        <DashboardLayout headerText="Prompts">
            <div className="px-4 lg:px-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">Prompt Management</h2>
                        <p className="text-muted-foreground">Create and manage AI prompts for your campaigns</p>
                    </div>
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                        Create Prompt
                    </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold">LinkedIn Outreach</h3>
                                <p className="text-sm text-muted-foreground">Cold outreach template</p>
                            </div>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span className="text-sm">Type:</span>
                                <span className="text-sm font-medium">Outreach</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Uses:</span>
                                <span className="text-sm font-medium">1,240</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Success Rate:</span>
                                <span className="text-sm font-medium">18.5%</span>
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <p className="text-sm text-muted-foreground">
                                "Hi {firstName}, I noticed you're working in {industry}. I'd love to connect and discuss..."
                            </p>
                        </div>
                        
                        <div className="flex gap-2">
                            <button className="text-sm px-3 py-1 border rounded hover:bg-accent">Edit</button>
                            <button className="text-sm px-3 py-1 border rounded hover:bg-accent">Use</button>
                        </div>
                    </div>
                    
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold">Follow-up Message</h3>
                                <p className="text-sm text-muted-foreground">Second touchpoint</p>
                            </div>
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Draft</span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span className="text-sm">Type:</span>
                                <span className="text-sm font-medium">Follow-up</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Uses:</span>
                                <span className="text-sm font-medium">0</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Last Modified:</span>
                                <span className="text-sm font-medium">Dec 15, 2024</span>
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <p className="text-sm text-muted-foreground">
                                "Hi {firstName}, Following up on my previous message about {topic}..."
                            </p>
                        </div>
                        
                        <div className="flex gap-2">
                            <button className="text-sm px-3 py-1 border rounded hover:bg-accent">Edit</button>
                            <button className="text-sm px-3 py-1 border rounded hover:bg-accent">Test</button>
                        </div>
                    </div>
                    
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold">Product Demo Invite</h3>
                                <p className="text-sm text-muted-foreground">Demo invitation template</p>
                            </div>
                            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Archived</span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span className="text-sm">Type:</span>
                                <span className="text-sm font-medium">Demo</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Uses:</span>
                                <span className="text-sm font-medium">856</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Success Rate:</span>
                                <span className="text-sm font-medium">24.7%</span>
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <p className="text-sm text-muted-foreground">
                                "Hi {firstName}, Would you be interested in a 15-minute demo of our platform..."
                            </p>
                        </div>
                        
                        <div className="flex gap-2">
                            <button className="text-sm px-3 py-1 border rounded hover:bg-accent">View</button>
                            <button className="text-sm px-3 py-1 border rounded hover:bg-accent">Restore</button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
