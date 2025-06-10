import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { ManualInput } from '@/components/leads/ManualInput'
import { CsvUpload } from '@/components/leads/CsvUpload'
import { SubmitSection } from '@/components/leads/SubmitSection'

export default function AddLeads() {
    const { user } = useAuth()
    const [manualUrls, setManualUrls] = useState([])
    const [csvUrls, setCsvUrls] = useState([])
    const [activeTab, setActiveTab] = useState('manual')

    // Combine URLs from both sources and remove duplicates
    const allUrls = [...new Set([...manualUrls, ...csvUrls])]

    const handleSuccess = (data) => {
        // Reset forms after successful submission
        setManualUrls([])
        setCsvUrls([])
        console.log('Success:', data)
    }

    const handleError = (error) => {
        console.error('Error:', error)
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
                            onSuccess={handleSuccess}
                            onError={handleError}
                        />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
