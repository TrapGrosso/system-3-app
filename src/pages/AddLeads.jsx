import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from "@/components/layouts/DashboardLayout"

export default function AddLeads() {
    const { user } = useAuth()

    return (
        <DashboardLayout headerText="Add Leads">
            <div className="px-4 lg:px-6">
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                    <h2 className="text-2xl font-bold mb-4">Lead Management</h2>
                    <p className="text-muted-foreground mb-6">
                        Add and manage your leads from this page.
                    </p>
                    
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Lead Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter lead name"
                                    className="w-full px-3 py-2 border border-input rounded-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <input 
                                    type="email" 
                                    placeholder="Enter email"
                                    className="w-full px-3 py-2 border border-input rounded-md"
                                />
                            </div>
                        </div>
                        
                        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                            Add Lead
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
