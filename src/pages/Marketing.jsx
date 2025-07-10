import * as React from "react"
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { Button } from "@/components/ui/button"
import { useDeepSearchQueue } from '@/contexts/DeepSearchQueueContext'
import { useAllPrompts } from '@/contexts/PromptContext'
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

    // Business logic handlers
    const handleChangePrompt = React.useCallback((items, currentPrompt = null) => {
        setSelectedItems(items)
        setCurrentPromptId(currentPrompt)
        setPromptDialogOpen(true)
    }, [])

    const handleRemove = React.useCallback((items) => {
        deleteProspects(items)
    }, [deleteProspects])

    const handleResolve = React.useCallback((items) => {
        resolveProspects(items)
    }, [resolveProspects])

    const handleRowClick = React.useCallback((prospectId) => {
        navigate(`/prospects/${prospectId}`)
    }, [navigate])

    const handlePromptConfirm = React.useCallback((newPromptId) => {
        if (selectedItems.length > 0) {
            const prospectIds = selectedItems.map(item => item.prospect_id)
            updateProspects(prospectIds, newPromptId)
            setPromptDialogOpen(false)
            setSelectedItems([])
            setCurrentPromptId(null)
        }
    }, [selectedItems, updateProspects])

    const handlePromptCancel = React.useCallback(() => {
        setPromptDialogOpen(false)
        setSelectedItems([])
        setCurrentPromptId(null)
    }, [])

    return (
        <DashboardLayout headerText="Marketing">
            <div className="px-4 lg:px-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Deep Search Queue</h2>
                        <p className="text-muted-foreground">
                            Manage and process your deep search queue items
                        </p>
                    </div>
                    <Button 
                        onClick={() => {
                            const allItems = queueItems.map(({ prospect_id, prompt_id }) => ({
                                prospect_id,
                                prompt_id,
                            }))
                            resolveProspects(allItems)
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
