import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useAddLeads } from '@/api/add-leads/useAddLeads'
import { useFetchAddLeadLogs } from '@/api/add-leads/fetchAddLeadLogs'
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { ManualInput } from '@/components/add-leads/ManualInput'
import { CsvUpload } from '@/components/add-leads/CsvUpload'
import { SubmitSection } from '@/components/add-leads/SubmitSection'
import { LogTable } from '@/components/add-leads/LogTable'

export default function AddLeads() {
    const { user } = useAuth()
    const [manualUrls, setManualUrls] = useState([])
    const [csvUrls, setCsvUrls] = useState([])
    const [activeTab, setActiveTab] = useState('manual')

    // Combine URLs from both sources and remove duplicates
    const allUrls = [...new Set([...manualUrls, ...csvUrls])]

    // Move the useAddLeads hook here
    const { mutate: submitLeads, isPending, isSuccess, isError, error, data } = useAddLeads({
        onSuccess: (data) => {
            // Reset forms after successful submission
            setManualUrls([])
            setCsvUrls([])
            console.log('Success:', data)
        },
        onError: (error) => {
            console.error('Error:', error)
        }
    })

    // Fetch add lead logs
    const { 
        data: logs = [], 
        isLoading: isLoadingLogs, 
        isError: isErrorLogs, 
        error: logsError 
    } = useFetchAddLeadLogs(user.id)

    const handleSubmit = (urls) => {
        if (urls.length === 0) return
        
        const leads = urls.map(url => ({
            url: url.trim()
        }))
        
        const payload = {
            user_id: user.id,
            leads
        }
        
        submitLeads(payload)
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
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="manual">Manual Input</TabsTrigger>
                                <TabsTrigger value="csv">CSV Upload</TabsTrigger>
                                <TabsTrigger value="logs">Logs</TabsTrigger>
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
                            
                            <TabsContent value="logs" className="space-y-4">
                                <LogTable 
                                    logs={logs}
                                    isLoading={isLoadingLogs}
                                    isError={isErrorLogs}
                                    error={logsError}
                                />
                            </TabsContent>
                        </Tabs>
                        
                        <Separator />
                        
                        <SubmitSection 
                            urls={allUrls}
                            onSubmit={handleSubmit}
                            isPending={isPending}
                            isSuccess={isSuccess}
                            isError={isError}
                            error={error}
                            data={data}
                        />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
