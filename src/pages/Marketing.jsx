import * as React from "react"
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useDeepSearchQueue } from '@/contexts/DeepSearchQueueContext'
import DeepSearchQueueTable from '@/components/marketing/DeepSearchQueueTable'
import { PromptSelectDialog } from '@/components/dialogs/PromptSelectDialog'
import { ResolveDeepSearchItem } from '@/components/dialogs'

export default function Marketing() {
    const navigate = useNavigate()
    
    const { 
        queueItems,
        isLoadingQueue,
        deleteProspects,
        resolveProspects,
        isDeletingQueue,
        isResolvingQueue,
    } = useDeepSearchQueue()

    // Dialog state
    const [promptDialogOpen, setPromptDialogOpen] = React.useState(false)
    const [resolveDialogOpen, setResolveDialogOpen] = React.useState(false)
    const [selectedQueueItemIds, setSelectedQueueItemIds] = React.useState([])
    
    // Business logic handlers
    const handleChangePrompt = React.useCallback((queueItemIds) => {
        setSelectedQueueItemIds(queueItemIds)
        setPromptDialogOpen(true)
    }, [])

    const handleRemove = React.useCallback((queueItemIds) => {
        deleteProspects(queueItemIds)
    }, [deleteProspects])

    const handleResolve = React.useCallback((queueItemIds) => {
        setSelectedQueueItemIds(queueItemIds)
        setResolveDialogOpen(true)
    }, [])

    const handleResolveEntireQueue = React.useCallback(() => {
        const allQueueItemIds = queueItems.map(item => item.id)
        setSelectedQueueItemIds(allQueueItemIds)
        setResolveDialogOpen(true)
    }, [queueItems])

    const handleResolveSuccess = React.useCallback(() => {
        setSelectedQueueItemIds([])
    }, [])

    const handleRowClick = React.useCallback((prospectId) => {
        navigate(`/prospects/${prospectId}`)
    }, [navigate])

    return (
        <DashboardLayout headerText="Marketing">
            <div className="px-4 lg:px-6 space-y-6">
                <Card>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-medium">Deep Search Queue</h3>
                                    <p className="text-muted-foreground text-sm">
                                        Manage and process your deep search queue items
                                    </p>
                                </div>
                                <Button 
                                    onClick={handleResolveEntireQueue}
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
                        </div>
                        
                        <Separator />
                    </CardContent>
                </Card>

                <PromptSelectDialog
                    open={promptDialogOpen}
                    onOpenChange={setPromptDialogOpen}
                    queueItemIds={selectedQueueItemIds}
                    selectedCount={selectedQueueItemIds.length}
                />

                <ResolveDeepSearchItem
                    open={resolveDialogOpen}
                    onOpenChange={setResolveDialogOpen}
                    queueIds={selectedQueueItemIds}
                    onSuccess={handleResolveSuccess}
                />
            </div>
        </DashboardLayout>
    )
}
