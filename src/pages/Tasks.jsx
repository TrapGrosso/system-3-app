import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from "@/components/layouts/DashboardLayout"

export default function Tasks() {
    const { user } = useAuth()

    return (
        <DashboardLayout headerText="Tasks">
            <div className="px-4 lg:px-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">Task Management</h2>
                        <p className="text-muted-foreground">Organize and track your tasks and to-dos</p>
                    </div>
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                        Create Task
                    </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold">Follow up with John Doe</h3>
                                <p className="text-sm text-muted-foreground">High Priority</p>
                            </div>
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Urgent</span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span className="text-sm">Due:</span>
                                <span className="text-sm font-medium">Today, 3:00 PM</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Assigned to:</span>
                                <span className="text-sm font-medium">Sales Team</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Status:</span>
                                <span className="text-sm font-medium">In Progress</span>
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            <button className="text-sm px-3 py-1 border rounded hover:bg-accent">Edit</button>
                            <button className="text-sm px-3 py-1 border rounded hover:bg-accent">Complete</button>
                        </div>
                    </div>
                    
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold">Prepare campaign proposal</h3>
                                <p className="text-sm text-muted-foreground">Medium Priority</p>
                            </div>
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pending</span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span className="text-sm">Due:</span>
                                <span className="text-sm font-medium">Dec 20, 2024</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Assigned to:</span>
                                <span className="text-sm font-medium">Marketing Team</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Status:</span>
                                <span className="text-sm font-medium">Not Started</span>
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            <button className="text-sm px-3 py-1 border rounded hover:bg-accent">Edit</button>
                            <button className="text-sm px-3 py-1 border rounded hover:bg-accent">Start</button>
                        </div>
                    </div>
                    
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold">Review lead database</h3>
                                <p className="text-sm text-muted-foreground">Low Priority</p>
                            </div>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Completed</span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span className="text-sm">Completed:</span>
                                <span className="text-sm font-medium">Dec 10, 2024</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Assigned to:</span>
                                <span className="text-sm font-medium">Data Team</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Duration:</span>
                                <span className="text-sm font-medium">2 hours</span>
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            <button className="text-sm px-3 py-1 border rounded hover:bg-accent">View Details</button>
                            <button className="text-sm px-3 py-1 border rounded hover:bg-accent">Archive</button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
