import * as React from "react"
import { useState } from "react"
import { Trash2 } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import DialogWrapper from "@/components/shared/dialog/DialogWrapper"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"
import FormField from "@/components/shared/ui/FormField"
import GroupSingleSelect from "@/components/shared/dialog/GroupSingleSelect"

import { useGroups } from "@/contexts/GroupsContext"

function HandleGroupsDialog({ 
  user_id, 
  prospect_ids = [], 
  onSuccess,
  trigger,
  children,
  open,
  onOpenChange
}) {
  const [selectedGroupId, setSelectedGroupId] = useState("")
  const [activeTab, setActiveTab] = useState("add")
  const [groupName, setGroupName] = useState("")
  const [groupDescription, setGroupDescription] = useState("")
  
  // Get groups context
  const {
    groups,
    isLoadingGroups,
    isErrorGroups,
    createGroup,
    deleteGroup,
    addToGroup,
    refetchGroups,
    getGroupById,
  } = useGroups()
  
  const handleSubmit = () => {
    if (!selectedGroupId || !prospect_ids.length) return
    
    addToGroup.mutate({
      prospect_ids,
      group_id: selectedGroupId,
      user_id
    }, {
      onSuccess: (data) => {
        setSelectedGroupId("")
        onOpenChange(false)
        onSuccess?.(data)
      }
    })
  }

  const handleCreateGroup = () => {
    if (!groupName.trim()) return
    
    createGroup.mutate({
      user_id,
      group_name: groupName.trim(),
      group_description: groupDescription.trim()
    }, {
      onSuccess: (data) => {
        // Auto-select the newly created group
        setSelectedGroupId(data.data.group.id)
        // Clear form
        setGroupName("")
        setGroupDescription("")
        // Switch back to add tab
        setActiveTab("add")
      }
    })
  }

  const handleDeleteGroup = (groupId) => {
    deleteGroup.mutate({
      user_id,
      group_id: groupId
    }, {
      onSuccess: (data) => {
        // Clear selection if deleted group was selected
        if (data.data.group_id === selectedGroupId) {
          setSelectedGroupId("")
        }
      }
    })
  }

  const handleOpenChange = (newOpen) => {
    onOpenChange(newOpen)
    if (!newOpen) {
      // Reset all state
      setSelectedGroupId("")
      setGroupName("")
      setGroupDescription("")
      setActiveTab("add")
    }
  }

  const selectedGroup = getGroupById(selectedGroupId)
  const isSubmitting = addToGroup.isPending
  const isCreating = createGroup.isPending
  const isDeleting = deleteGroup.isPending


  return (
    <DialogWrapper 
      open={open} 
      onOpenChange={handleOpenChange}
      title="Manage Groups"
      description={
        prospect_ids.length > 0 
          ? `Add ${prospect_ids.length} lead${prospect_ids.length !== 1 ? 's' : ''} to a group or manage your groups.`
          : 'Create, manage, and organize your groups.'
      }
      size="md"
    >
      {(trigger || children) && <DialogWrapper.Trigger asChild>{trigger || children}</DialogWrapper.Trigger>}
      
      <DialogWrapper.Body>
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
            <GroupSingleSelect
              value={selectedGroupId}
              onChange={setSelectedGroupId}
              onCreateFirstGroupClick={() => setActiveTab("manage")}
            />
            {selectedGroup && (
              <p className="text-xs text-muted-foreground mt-2">
                {selectedGroup.description}
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="manage" className="mt-4">
            <ManageGroupsTab 
              groupName={groupName}
              setGroupName={setGroupName}
              groupDescription={groupDescription}
              setGroupDescription={setGroupDescription}
              handleCreateGroup={handleCreateGroup}
              isCreating={isCreating}
              isLoadingGroups={isLoadingGroups}
              groups={groups}
              handleDeleteGroup={handleDeleteGroup}
              isDeleting={isDeleting}
            />
          </TabsContent>
        </Tabs>
      </DialogWrapper.Body>

      <DialogWrapper.Footer>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <SpinnerButton 
            variant="outline" 
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting || isCreating || isDeleting}
          >
            Cancel
          </SpinnerButton>
          {activeTab === "add" && (
            <SpinnerButton 
              onClick={handleSubmit} 
              disabled={!selectedGroupId || isSubmitting || groups.length === 0}
              loading={isSubmitting}
            >
              Add to Group
            </SpinnerButton>
          )}
        </div>
      </DialogWrapper.Footer>
    </DialogWrapper>
  )
}

// Component for Manage Groups tab
const ManageGroupsTab = ({ 
  groupName, 
  setGroupName, 
  groupDescription, 
  setGroupDescription, 
  handleCreateGroup, 
  isCreating, 
  isLoadingGroups, 
  groups, 
  handleDeleteGroup, 
  isDeleting 
}) => (
  <div className="space-y-4">
    {/* Create Group Form */}
    <div className="space-y-3">
      <h4 className="text-sm font-medium">Create new group</h4>
      <div>
        <FormField
          id="group-name"
          label="Group name"
          value={groupName}
          onChange={setGroupName}
          placeholder="Enter group name..."
          required
          disabled={isCreating}
          maxLength={60}
        />
        <FormField
          id="group-description"
          label="Description"
          type="textarea"
          rows={2}
          value={groupDescription}
          onChange={setGroupDescription}
          placeholder="Enter group description..."
          disabled={isCreating}
          maxLength={200}
        />
        <SpinnerButton 
          onClick={handleCreateGroup}
          disabled={!groupName.trim() || isCreating}
          loading={isCreating}
          className="w-full"
        >
          Create Group
        </SpinnerButton>
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
              <SpinnerButton
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDeleteGroup(group.id)}
                disabled={isDeleting}
                loading={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete group</span>
              </SpinnerButton>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)

export default HandleGroupsDialog
