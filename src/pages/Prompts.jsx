import * as React from "react"
import { useState, useCallback } from "react"
import { Plus } from "lucide-react"

import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { Button } from "@/components/ui/button"

import { PromptProvider, useAllPrompts, usePrompts } from "@/contexts/PromptContext"
import { useFilteredPrompts } from "@/hooks/use-filtered-prompts"
import PromptFilters from "@/components/prompts/PromptFilters"
import PromptsGrid from "@/components/prompts/PromptsGrid"
import PromptFormDialog from "@/components/dialogs/PromptFormDialog"
import { PromptPreviewDialog } from "@/components/prompts"
import PromptDeleteDialog from "@/components/dialogs/PromptDeleteDialog"

function PromptsContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedAgentType, setSelectedAgentType] = useState("")

  const [dialogType, setDialogType] = useState(null) // 'create' | 'preview' | 'edit' | 'delete'
  const [activePrompt, setActivePrompt] = useState(null) // currently selected prompt

  // Get prompts data
  const { data: prompts = [], isLoading, error } = useAllPrompts()

  // Get prompt mutations from context
  const {
    duplicatePrompt,
    deletePrompt,
    isDeletingPrompt,
  } = usePrompts()

  // Filter prompts based on search and filters
  const filteredPrompts = useFilteredPrompts(
    prompts,
    searchTerm,
    selectedTags,
    selectedAgentType
  )

  const openCreate = useCallback(() => {
    setActivePrompt(null)
    setDialogType("create")
  }, [])

  const openPreview = useCallback((prompt) => {
    setActivePrompt(prompt)
    setDialogType("preview")
  }, [])

  const openEdit = useCallback((prompt) => {
    setActivePrompt(prompt)
    setDialogType("edit")
  }, [])

  const openAskDelete = useCallback((prompt) => {
    setActivePrompt(prompt)
    setDialogType("delete")
  }, [])

  const closeDialog = useCallback(() => {
    setDialogType(null)
    setActivePrompt(null)
  }, [])

  const handleDuplicate = useCallback((prompt) => {
    duplicatePrompt(prompt.id)
  }, [duplicatePrompt])

  const handleDeleteConfirmed = useCallback(() => {
    if (activePrompt) {
      deletePrompt(activePrompt.id)
      closeDialog()
    }
  }, [activePrompt, deletePrompt, closeDialog])

  return (
    <DashboardLayout headerText="Prompts">
      <div className="px-4 lg:px-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Prompt Management</h2>
            <p className="text-muted-foreground">
              Create and manage AI prompts for your campaigns
            </p>
          </div>
          
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Prompt
          </Button>
        </div>

        {/* Filters */}
        <PromptFilters
          prompts={prompts}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          selectedAgentType={selectedAgentType}
          onAgentTypeChange={setSelectedAgentType}
        />

        {/* Results Summary */}
        {!isLoading && prompts.length > 0 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {filteredPrompts.length} of {prompts.length} prompts
            </span>
            {filteredPrompts.length !== prompts.length && (
              <span className="font-medium">
                {prompts.length - filteredPrompts.length} filtered out
              </span>
            )}
          </div>
        )}

        {/* Prompts Grid */}
        <PromptsGrid
          prompts={filteredPrompts}
          isLoading={isLoading}
          error={error}
          onPromptEdit={openEdit}
          onPromptDuplicate={handleDuplicate}
          onPromptPreview={openPreview}
          onPromptAskDelete={openAskDelete}
          onCreatePrompt={openCreate}
        />
      </div>

      {/* Dialogs */}
      <PromptPreviewDialog
        open={dialogType === "preview"}
        onOpenChange={closeDialog}
        prompt={activePrompt}
      />

      <PromptFormDialog
        mode={dialogType === "edit" ? "edit" : "create"}
        prompt={dialogType === "edit" ? activePrompt : null}
        open={dialogType === "create" || dialogType === "edit"}
        onOpenChange={closeDialog}
        onSuccess={closeDialog}
      />

      <PromptDeleteDialog
        open={dialogType === "delete"}
        onOpenChange={closeDialog}
        prompt={activePrompt}
        onConfirm={handleDeleteConfirmed}
        isLoading={isDeletingPrompt}
      />
    </DashboardLayout>
  )
}

export default function Prompts() {
  return (
    <PromptProvider>
      <PromptsContent />
    </PromptProvider>
  )
}
