import * as React from "react"
import { FileText, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import PromptCard from "./PromptCard"
import PromptFormDialog from "@/components/dialogs/PromptFormDialog"

function PromptsGrid({ 
  prompts = [], 
  isLoading = false, 
  error = null,
  onPromptEdit,
  onPromptDuplicate 
}) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-destructive/10 p-3 mb-4">
          <FileText className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Failed to load prompts</h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          {error.message || "There was an error loading your prompts. Please try again."}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try again
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <PromptCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (!prompts.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No prompts found</h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          You haven't created any prompts yet. Create your first prompt to get started with AI-powered campaigns.
        </p>
        <PromptFormDialog
          mode="create"
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create your first prompt
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          onEdit={onPromptEdit}
          onDuplicate={onPromptDuplicate}
        />
      ))}
    </div>
  )
}

function PromptCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Content */}
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 flex-1" />
      </div>
    </div>
  )
}

export default PromptsGrid
