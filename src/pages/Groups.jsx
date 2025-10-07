import * as React from "react"
import { Plus } from "lucide-react"

import { useAuth } from '@/contexts/AuthContext'
import { GroupsProvider, useGroups, useGroupProspects } from '@/contexts/GroupsContext'
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { Button } from "@/components/ui/button"
import { GroupTable, GroupProspectsTable } from "@/components/groups"
import { useDialogs } from "@/contexts/DialogsContext"

function GroupsContent() {
    const { user } = useAuth()
    const [selectedGroup, setSelectedGroup] = React.useState(null)

    const {
        groups,
        isLoadingGroups,
        isErrorGroups,
        deleteGroup,
        emptyGroup,
        removeFromGroup,
        refetchGroups,
        isDeletingGroup,
        isEmptyingGroup,
        isRemovingFromGroup,
    } = useGroups()

    const { confirm, openHandleGroups } = useDialogs()

    // Fetch prospects for selected group
    const {
        data: prospects = [],
        isLoading: isLoadingProspects,
        isError: isErrorProspects,
        refetch: refetchProspects,
    } = useGroupProspects(selectedGroup?.id)

    const handleGroupSelect = (group) => {
        setSelectedGroup(group)
    }

    const handleEmptyGroup = async (group) => {
        const confirmed = await confirm({
            title: 'Empty group',
            description: `Are you sure you want to remove all prospects from "${group.name}"?`,
            confirmLabel: 'Empty',
            cancelLabel: 'Cancel'
        })

        if (!confirmed) {
            return
        }

        try {
            await emptyGroup(group.id)
            // If the emptied group is currently selected, clear selection since it has no prospects
            if (selectedGroup?.id === group.id) {
                setSelectedGroup(null)
            }
            refetchGroups()
        } catch (error) {
            // Error handling is done in the context
        }
    }

    const handleDeleteGroup = async (group) => {
        const confirmed = await confirm({
            title: 'Delete group',
            description: `This will permanently delete the group "${group.name}". This action cannot be undone.`,
            confirmLabel: 'Delete',
            cancelLabel: 'Cancel'
        })

        if (!confirmed) {
            return
        }

        try {
            await deleteGroup(group.id)
            // If the deleted group is currently selected, clear selection
            if (selectedGroup?.id === group.id) {
                setSelectedGroup(null)
            }
            refetchGroups()
        } catch (error) {
            // Error handling is done in the context
        }
    }

    const handleRemoveProspect = async (prospect) => {
        if (!selectedGroup) return

        try {
            await removeFromGroup({
                group_id: selectedGroup.id,
                prospect_ids: [prospect.linkedin_id]
            })
            refetchProspects()
            refetchGroups() // Refresh to update prospect counts
        } catch (error) {
            // Error handling is done in the context
        }
    }

    const handleOpenManageGroups = async () => {
      await openHandleGroups({
        user_id: user?.id,
        prospect_ids: [],
        tab: 'manage'
      })
      // Regardless of create/delete actions, refresh after dialog closes
      refetchGroups()
    }

    return (
        <DashboardLayout headerText="Groups">
            <div className="px-4 lg:px-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">Group Management</h2>
                        <p className="text-muted-foreground">Create, organize and review your prospect groups</p>
                    </div>
                    <Button onClick={handleOpenManageGroups}>
                        <Plus className="h-4 w-4 mr-2" />
                        Manage Groups
                    </Button>
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Groups Table - Takes up 2/3 of the space on xl screens */}
                    <div className="xl:col-span-2">
                        <GroupTable 
                            groups={groups}
                            isLoading={isLoadingGroups}
                            isError={isErrorGroups}
                            onSelect={handleGroupSelect}
                            selectedGroupId={selectedGroup?.id}
                            onEmpty={handleEmptyGroup}
                            onDelete={handleDeleteGroup}
                            onRefetch={refetchGroups}
                            isEmptyingGroup={isEmptyingGroup}
                            isDeletingGroup={isDeletingGroup}
                        />
                    </div>
                    
                    {/* Group Prospects Table - Takes up 1/3 of the space on xl screens */}
                    <div className="xl:col-span-1">
                        {selectedGroup && (
                            <GroupProspectsTable 
                                group={selectedGroup}
                                prospects={prospects}
                                isLoading={isLoadingProspects}
                                isError={isErrorProspects}
                                onRemoveProspect={handleRemoveProspect}
                                onRefetch={refetchProspects}
                                isRemovingFromGroup={isRemovingFromGroup}
                            />
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default function Groups() {
    return (
        <GroupsProvider>
            <GroupsContent />
        </GroupsProvider>
    )
}
