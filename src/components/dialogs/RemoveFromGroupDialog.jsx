import * as React from "react"
import { useState } from "react"
import { UsersIcon, Trash2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import DialogWrapper from "@/components/shared/dialog/DialogWrapper"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"
import SpinnerOverlay from "@/components/shared/ui/SpinnerOverlay"

import { useGroups, useProspectGroups } from "@/contexts/GroupsContext"

function RemoveFromGroupDialog({ 
  prospect_id,
  prospect_name = "this prospect",
  open,
  onOpenChange,
  onSuccess
}) {
  // Local state for tracking which group is being removed
  const [removingGroupId, setRemovingGroupId] = useState(null)

  // Get groups context
  const {
    removeFromGroup,
    removeFromAllGroups,
    invalidateProspectGroups,
    isRemovingFromGroup,
    isRemovingFromAllGroups,
  } = useGroups()
  
  // Get prospect groups
  const {
    data: groups = [],
    isLoading: isLoadingGroups,
    isError: isErrorGroups,
    refetch: refetchGroups,
  } = useProspectGroups(prospect_id)

  const handleRemoveFromGroup = async (groupId) => {
    setRemovingGroupId(groupId)
    try {
      await removeFromGroup({
        group_id: groupId,
        prospect_ids: [prospect_id]
      })
      invalidateProspectGroups(prospect_id)
      refetchGroups()
      onSuccess?.()
    } catch (error) {
      // Error handling is done in the context
    } finally {
      setRemovingGroupId(null)
    }
  }

  const handleRemoveFromAllGroups = async () => {
    try {
      await removeFromAllGroups(prospect_id)
      invalidateProspectGroups(prospect_id)
      refetchGroups()
      onSuccess?.()
    } catch (error) {
      // Error handling is done in the context
    }
  }

  const handleOpenChange = (newOpen) => {
    onOpenChange(newOpen)
  }

  const isRemovingOne = isRemovingFromGroup
  const isRemovingAll = isRemovingFromAllGroups
  const isAnyLoading = isRemovingOne || isRemovingAll

  return (
    <DialogWrapper
      open={open}
      onOpenChange={handleOpenChange}
      icon={<UsersIcon className="h-5 w-5" />}
      title={`Remove ${prospect_name} from Groups`}
      description={
        groups.length > 0 
          ? `Remove ${prospect_name} from specific groups or all groups at once.`
          : `${prospect_name} is not currently in any groups.`
      }
      size="md"
    >
      <DialogWrapper.Body className="space-y-4">
        {/* Groups List */}
        <div className="space-y-3 relative">
          {isLoadingGroups ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-8 w-8" />
                </div>
              ))}
            </div>
          ) : isErrorGroups ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-destructive mb-2">Failed to load groups</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refetchGroups()}
              >
                Retry
              </Button>
            </div>
          ) : groups.length === 0 ? (
            <div className="text-center py-8">
              <UsersIcon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-2">Not in any groups</p>
              <p className="text-xs text-muted-foreground">
                {prospect_name} is not currently assigned to any groups
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {groups.map((group) => (
                <div key={group.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/50 transition-colors">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{group.name}</span>
                    </div>
                    {group.description && (
                      <p className="text-xs text-muted-foreground truncate">
                        {group.description}
                      </p>
                    )}
                  </div>
                  <SpinnerButton
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveFromGroup(group.id)}
                    disabled={isAnyLoading}
                    loading={removingGroupId === group.id && isRemovingOne}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove from {group.name}</span>
                  </SpinnerButton>
                </div>
              ))}
            </div>
          )}
        </div>

          {/* Overlay for bulk removal */}
          {isRemovingAll && <SpinnerOverlay />}

        {/* Remove from all groups section */}
        {groups.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-destructive">Bulk Action</h4>
              <SpinnerButton
                variant="destructive"
                onClick={handleRemoveFromAllGroups}
                disabled={isAnyLoading}
                loading={isRemovingAll}
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove from ALL {groups.length} group{groups.length !== 1 ? 's' : ''}
              </SpinnerButton>
            </div>
          </>
        )}
      </DialogWrapper.Body>

      <DialogWrapper.Footer>
        <Button 
          variant="outline" 
          onClick={() => handleOpenChange(false)}
          disabled={isAnyLoading}
        >
          Close
        </Button>
      </DialogWrapper.Footer>
    </DialogWrapper>
  )
}

export default RemoveFromGroupDialog
