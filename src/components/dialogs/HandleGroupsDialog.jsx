import * as React from "react"
import { useState } from "react"
import { toast } from "sonner"
import { useQueryClient } from '@tanstack/react-query'
import { Trash2 } from "lucide-react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

import { useFetchGroups } from "@/api/dialog-handleGroups/fetchGroups"
import { useAddToGroup } from "@/api/dialog-handleGroups/addToGroup"
import { useCreateGroup } from "@/api/dialog-handleGroups/createGroup"
import { useDeleteGroup } from "@/api/dialog-handleGroups/deleteGroup"

function HandleGroupsDialog({ 
  user_id, 
  prospect_ids = [], 
  onSuccess,
  trigger,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState("")
  const [activeTab, setActiveTab] = useState("add")
  const [groupName, setGroupName] = useState("")
  const [groupDescription, setGroupDescription] = useState("")
  
  // React Query client for cache invalidation
  const queryClient = useQueryClient()
  
  // Determine if this is controlled or uncontrolled
  const isControlled = controlledOpen !== undefined
  const dialogOpen = isControlled ? controlledOpen : internalOpen
  const setDialogOpen = isControlled ? controlledOnOpenChange : setInternalOpen
  
  // Fetch groups
  const { 
    data: groups = [], 
    isLoading: isLoadingGroups, 
    isError: isErrorGroups 
  } = useFetchGroups(user_id)

  // Add to group mutation
  const addToGroupMutation = useAddToGroup({
    onSuccess: (data) => {
      const message = data.message || 'Successfully added leads to group'
      toast.success(message)
      queryClient.invalidateQueries(['fetchGroups', user_id])
      setSelectedGroupId("")
      handleOpenChange(false)
      onSuccess?.(data)
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add leads to group")
    },
  })

  // Create group mutation
  const createGroupMutation = useCreateGroup({
    onSuccess: (data) => {
      const message = data.message || (data.success ? 'Group created successfully' : 'Group created successfully')
      toast.success(message)
      queryClient.invalidateQueries(['fetchGroups', user_id])
      // Auto-select the newly created group
      setSelectedGroupId(data.data.group.id)
      // Clear form
      setGroupName("")
      setGroupDescription("")
      // Switch back to add tab
      setActiveTab("add")
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create group")
    },
  })

  // Delete group mutation
  const deleteGroupMutation = useDeleteGroup({
    onSuccess: (data) => {
      const message = data.message || (data.success ? 'Group deleted successfully' : 'Group deleted successfully')
      toast.success(message)
      queryClient.invalidateQueries(['fetchGroups', user_id])
      // Clear selection if deleted group was selected
      if (data.data.group_id === selectedGroupId) {
        setSelectedGroupId("")
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete group")
    },
  })

  const handleSubmit = () => {
    if (!selectedGroupId || !prospect_ids.length) return
    
    addToGroupMutation.mutate({
      prospect_ids,
      group_id: selectedGroupId
    })
  }

  const handleCreateGroup = () => {
    if (!groupName.trim()) return
    
    createGroupMutation.mutate({
      user_id,
      group_name: groupName.trim(),
      group_description: groupDescription.trim()
    })
  }

  const handleDeleteGroup = (groupId) => {
    deleteGroupMutation.mutate({
      user_id,
      group_id: groupId
    })
  }

  const handleOpenChange = (newOpen) => {
    if (setDialogOpen) {
      setDialogOpen(newOpen)
    }
    if (!newOpen) {
      // Reset all state
      setSelectedGroupId("")
      setGroupName("")
      setGroupDescription("")
      setActiveTab("add")
    }
  }

  const selectedGroup = groups.find(group => group.id === selectedGroupId)
  const isSubmitting = addToGroupMutation.isPending
  const isCreating = createGroupMutation.isPending
  const isDeleting = deleteGroupMutation.isPending

  // Inner component for Add to Group tab
  const AddToGroupTab = () => (
    <div className="space-y-4">
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
            onClick={() => queryClient.invalidateQueries(['fetchGroups', user_id])}
          >
            Retry
          </Button>
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground mb-2">No groups found</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setActiveTab("manage")}
          >
            Create your first group
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="group-select" className="text-sm font-medium">
              Select group
            </Label>
            <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
              <SelectTrigger id="group-select">
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
        </div>
      )}
    </div>
  )

  // Inner component for Manage Groups tab
  const ManageGroupsTab = () => (
    <div className="space-y-4">
      {/* Create Group Form */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Create new group</h4>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="group-name">Group name</Label>
            <Input
              id="group-name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name..."
              disabled={isCreating}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="group-description">Description</Label>
            <Input
              id="group-description"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              placeholder="Enter group description..."
              disabled={isCreating}
            />
          </div>
          <Button 
            onClick={handleCreateGroup}
            disabled={!groupName.trim() || isCreating}
            className="w-full"
          >
            {isCreating && <Spinner size="sm" className="mr-2" />}
            Create Group
          </Button>
        </div>
      </div>

      <Separator />

      {/* Groups List */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Existing groups</h4>
        
        {isLoadingGroups ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        ) : groups.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No groups created yet
          </p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {groups.map((group) => (
              <div key={group.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/50 transition-colors group">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{group.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {group.prospect_count}
                    </Badge>
                  </div>
                  {group.description && (
                    <p className="text-xs text-muted-foreground truncate">
                      {group.description}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeleteGroup(group.id)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete group</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Groups</DialogTitle>
          <DialogDescription>
            {prospect_ids.length > 0 
              ? `Add ${prospect_ids.length} lead${prospect_ids.length !== 1 ? 's' : ''} to a group or manage your groups.`
              : 'Create, manage, and organize your groups.'
            }
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add" disabled={prospect_ids.length === 0}>
              Add to Group
            </TabsTrigger>
            <TabsTrigger value="manage">
              Manage Groups
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="add" className="mt-4">
            <AddToGroupTab />
          </TabsContent>
          
          <TabsContent value="manage" className="mt-4">
            <ManageGroupsTab />
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col gap-3">
          {/* Dialog Action Buttons */}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button 
              variant="outline" 
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting || isCreating || isDeleting}
            >
              Cancel
            </Button>
            {activeTab === "add" && (
              <Button 
                onClick={handleSubmit} 
                disabled={!selectedGroupId || isSubmitting || groups.length === 0}
              >
                {isSubmitting && <Spinner size="sm" className="mr-2" />}
                Add to Group
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default HandleGroupsDialog
