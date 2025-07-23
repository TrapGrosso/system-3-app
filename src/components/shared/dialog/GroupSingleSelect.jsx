import * as React from "react"
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
import { Label } from "@/components/ui/label"

import { useGroups } from "@/contexts/GroupsContext"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"

function GroupSingleSelect({ value, onChange, onCreateFirstGroupClick }) {
  const { groups, isLoadingGroups, isErrorGroups, refetchGroups } = useGroups()

  if (isLoadingGroups) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (isErrorGroups) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-destructive">Failed to load groups</p>
        <SpinnerButton 
          variant="outline" 
          size="sm" 
          onClick={() => refetchGroups()}
        >
          Retry
        </SpinnerButton>
      </div>
    )
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground mb-2">No groups found</p>
        <SpinnerButton 
          variant="outline" 
          size="sm" 
          onClick={onCreateFirstGroupClick}
        >
          Create your first group
        </SpinnerButton>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="group-select" className="text-sm font-medium">
          Select group
        </Label>
        <Select value={value} onValueChange={onChange}>
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
      </div>
    </div>
  )
}

export default GroupSingleSelect
