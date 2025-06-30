import * as React from "react"
import { useState } from "react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

import { useFetchGroups } from "@/api/dialog-handleGroups/fetchGroups"
import { useAddToGroup } from "@/api/dialog-handleGroups/addToGroup"

function HandleGroupsDialog({ 
  user_id, 
  prospect_ids = [], 
  onSuccess,
  trigger,
  children 
}) {
  const [open, setOpen] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState("")
  
  // Fetch groups
  const { 
    data: groups = [], 
    isLoading: isLoadingGroups, 
    isError: isErrorGroups,
    refetch: refetchGroups 
  } = useFetchGroups(user_id)

  // Add to group mutation
  const addToGroupMutation = useAddToGroup({
    onSuccess: (data) => {
      toast.success(`Successfully added ${data.added} lead${data.added !== 1 ? 's' : ''} to group`)
      if (data.duplicates > 0) {
        toast.info(`${data.duplicates} duplicate${data.duplicates !== 1 ? 's' : ''} were skipped`)
      }
      setOpen(false)
      setSelectedGroupId("")
      onSuccess?.(data)
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add leads to group")
    },
  })

  const handleSubmit = () => {
    if (!selectedGroupId || !prospect_ids.length) return
    
    addToGroupMutation.mutate({
      prospect_ids,
      group_id: selectedGroupId
    })
  }

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSelectedGroupId("")
    }
  }

  const selectedGroup = groups.find(group => group.id === selectedGroupId)
  const isSubmitting = addToGroupMutation.isPending

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add leads to group</DialogTitle>
          <DialogDescription>
            Select a group to add {prospect_ids.length} lead{prospect_ids.length !== 1 ? 's' : ''} to.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {isLoadingGroups ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : isErrorGroups ? (
            <div className="space-y-2">
              <p className="text-sm text-destructive">Failed to load groups</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refetchGroups()}
              >
                Retry
              </Button>
            </div>
          ) : groups.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-2">No groups found</p>
              <Button variant="outline" size="sm" asChild>
                <a href="/groups">Create your first group</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium">Select group</label>
              <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a group..." />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      <div className="flex items-center justify-between w-full">
                        <span className="truncate">{group.name}</span>
                        <Badge variant="secondary" className="ml-2">
                          {group.prospect_count}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedGroup && (
                <p className="text-xs text-muted-foreground">
                  {selectedGroup.description}
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedGroupId || isSubmitting || groups.length === 0}
          >
            {isSubmitting && <Spinner size="sm" className="mr-2" />}
            Add to group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default HandleGroupsDialog
