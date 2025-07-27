import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useAddLeads } from '@/api/add-leads/addLeads'
import { useRetryAddLeads } from '@/api/add-leads/retryAddLeads'
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { ManualInput } from '@/components/add-leads/ManualInput'
import { CsvUpload } from '@/components/add-leads/CsvUpload'
import { SubmitSection } from '@/components/add-leads/SubmitSection'
import { toast } from 'sonner'
import SubmitLeadsDialog from '@/components/dialogs/SubmitLeadsDialog'

export default function AddLeads() {
    const { user } = useAuth()
    const [manualUrls, setManualUrls] = useState([])
    const [csvUrls, setCsvUrls] = useState([])
    const [activeTab, setActiveTab] = useState('manual')
    const [submitDialogOpen, setSubmitDialogOpen] = useState(false)

    // Combine URLs from both sources and remove duplicates
    const allUrls = [...new Set([...manualUrls, ...csvUrls])]

    // Move the useAddLeads hook here
    const { mutate: submitLeads, isPending } = useAddLeads({
        onSuccess: (data) => {
            toast.success(data.message || 'Leads submitted successfully')
            setManualUrls([])
            setCsvUrls([])
        },
        onError: (error) => {
            toast.error(error?.message || 'Failed to submit leads')
        }
    })

    // Retry leads hook
    const { mutate: retryAddLeads, isPending: isRetryPending } = useRetryAddLeads({
        onSuccess: (data) => {
            toast.success(data.message || 'Retry submitted successfully')
        },
        onError: (error) => {
            toast.error(error?.message || 'Failed to submit retry')
        }
    })

    const handleSubmitDialogConfirm = ({ urls, options }) => {
        if (urls.length === 0) return
        
        const leads = urls.map(url => url.trim())
        
        const payload = {
            user_id: user.id,
            leads,
            options
        }
        
        submitLeads(payload)
        setSubmitDialogOpen(false)
    }

    return (
        <DashboardLayout headerText="Add Leads">
            <div className="px-4 lg:px-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Add LinkedIn Leads</CardTitle>
                        <CardDescription>
                            Import LinkedIn profile and company URLs manually or via CSV upload. 
                            All URLs will be processed and validated on the backend.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="manual">Manual Input</TabsTrigger>
                                <TabsTrigger value="csv">CSV Upload</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="manual" className="space-y-4">
                                <ManualInput 
                                    onUrlsChange={setManualUrls}
                                    initialValue=""
                                />
                            </TabsContent>
                            
                            <TabsContent value="csv" className="space-y-4">
                                <CsvUpload 
                                    onDataChange={setCsvUrls}
                                />
                            </TabsContent>
                        </Tabs>
                        
                        <Separator />
                        
                        <SubmitSection 
                            urls={allUrls}
                            onSubmit={() => setSubmitDialogOpen(true)}
                            isPending={isPending || isRetryPending}
                        />
                        
                        <SubmitLeadsDialog
                            open={submitDialogOpen}
                            onOpenChange={setSubmitDialogOpen}
                            urls={allUrls}
                            onConfirm={handleSubmitDialogConfirm}
                            isPending={isPending || isRetryPending}
                        />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
