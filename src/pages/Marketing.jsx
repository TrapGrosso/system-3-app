import * as React from "react"
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { useDeepSearchQueue } from '@/contexts/DeepSearchQueueContext'
import { useAllPrompts } from '@/contexts/PromptContext'
import { useGetLogsByAction } from '@/api/log/getLogsByAction'
import { toast } from 'sonner'
import DeepSearchQueueTable from '@/components/marketing/DeepSearchQueueTable'
import { PromptSelectDialog } from '@/components/marketing/PromptSelectDialog'
import { LogTable } from '@/components/add-leads/LogTable'

export default function Marketing() {
    const { user } = useAuth()
    const navigate = useNavigate()
    
    const { 
        queueItems,
        isLoadingQueue,
        deleteProspects,
        updateProspects,
        resolveProspects,
        isUpdatingQueue,
        isDeletingQueue,
        isResolvingQueue,
    } = useDeepSearchQueue()

    const { 
        data: prompts = [], 
        isLoading: isLoadingPrompts, 
    } = useAllPrompts()

    // Dialog state
    const [promptDialogOpen, setPromptDialogOpen] = React.useState(false)
    const [selectedItems, setSelectedItems] = React.useState([])
    const [currentPromptId, setCurrentPromptId] = React.useState(null)
    
    // Tab state
    const [activeTab, setActiveTab] = React.useState('queue')
    
    // Fetch deep search logs
    const { 
        data: logs = [], 
        isLoading: isLoadingLogs, 
        isError: isErrorLogs, 
        error: logsError,
        refetch: refetchLogs
    } = useGetLogsByAction(user.id, 'deep_search')

    // Business logic handlers
    const handleChangePrompt = React.useCallback((queueItemIds) => {
        setSelectedItems(queueItemIds)
        setCurrentPromptId(null)
        setPromptDialogOpen(true)
    }, [])

    const handleRemove = React.useCallback((queueItemIds) => {
        deleteProspects(queueItemIds)
    }, [deleteProspects])

    const handleResolve = React.useCallback((queueItemIds) => {
        resolveProspects(queueItemIds)
    }, [resolveProspects])

    const handleRowClick = React.useCallback((prospectId) => {
        navigate(`/prospects/${prospectId}`)
    }, [navigate])

    const handlePromptConfirm = React.useCallback((newPromptIds) => {
        if (selectedItems.length > 0) {
            // Get prospect IDs from the selected queue items
            const prospectIds = selectedItems.map(queueItemId => {
                const queueItem = queueItems.find(item => item.id === queueItemId)
                return queueItem?.prospect_id || queueItem?.prospect?.linkedin_id
            }).filter(Boolean)
            
            updateProspects(prospectIds, newPromptIds)
            setPromptDialogOpen(false)
            setSelectedItems([])
            setCurrentPromptId(null)
        }
    }, [selectedItems, queueItems, updateProspects])

    const handlePromptCancel = React.useCallback(() => {
        setPromptDialogOpen(false)
        setSelectedItems([])
        setCurrentPromptId(null)
    }, [])

    // Retry handler for logs (placeholder)
    const handleRetry = React.useCallback((logId) => {
        toast.info('Retry functionality not yet implemented')
    }, [])

    return (
        <DashboardLayout headerText="Marketing">
            <div className="px-4 lg:px-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Deep Search Management</CardTitle>
                        <CardDescription>
                            Manage and process your deep search queue items and view processing logs
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="queue">Queue</TabsTrigger>
                                <TabsTrigger value="logs">Logs</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="queue" className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-medium">Deep Search Queue</h3>
                                        <p className="text-muted-foreground text-sm">
                                            Manage and process your deep search queue items
                                        </p>
                                    </div>
                                    <Button 
                                        onClick={() => {
                                            const allQueueItemIds = queueItems.map(item => item.id)
                                            resolveProspects(allQueueItemIds)
                                        }}
                                        disabled={queueItems.length === 0 || isResolvingQueue}
                                    >
                                        {isResolvingQueue ? "Resolving..." : "Resolve Entire Queue"}
                                    </Button>
                                </div>
                                
                                <DeepSearchQueueTable 
                                    queueItems={queueItems}
                                    isLoading={isLoadingQueue}
                                    isResolving={isResolvingQueue}
                                    onChangePrompt={handleChangePrompt}
                                    onRemove={handleRemove}
                                    onResolve={handleResolve}
                                    onRowClick={handleRowClick}
                                />
                            </TabsContent>
                            
                            <TabsContent value="logs" className="space-y-4">
                                <LogTable 
                                    logs={logs}
                                    isLoading={isLoadingLogs}
                                    isError={isErrorLogs}
                                    error={logsError}
                                    onRetry={handleRetry}
                                    isRetryPending={false}
                                />
                            </TabsContent>
                        </Tabs>
                        
                        <Separator />
                    </CardContent>
                </Card>

                <PromptSelectDialog
                    open={promptDialogOpen}
                    onOpenChange={setPromptDialogOpen}
                    prompts={prompts}
                    isLoadingPrompts={isLoadingPrompts}
                    isUpdating={isUpdatingQueue}
                    currentPromptId={currentPromptId}
                    selectedCount={selectedItems.length}
                    onConfirm={handlePromptConfirm}
                    onCancel={handlePromptCancel}
                />
            </div>
        </DashboardLayout>
    )
}
