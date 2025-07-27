import * as React from "react"
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useDeepSearchQueue } from '@/contexts/DeepSearchQueueContext'
import { useAllPrompts } from '@/contexts/PromptContext'
import { toast } from 'sonner'
import DeepSearchQueueTable from '@/components/marketing/DeepSearchQueueTable'
import { PromptSelectDialog } from '@/components/marketing/PromptSelectDialog'

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
                        <div className="space-y-4">
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
                        </div>
                        
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
