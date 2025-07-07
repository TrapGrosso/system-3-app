import * as React from "react"
import { useState } from "react"
import { Plus } from "lucide-react"

import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { Button } from "@/components/ui/button"

import { PromptProvider, useAllPrompts } from "@/contexts/PromptContext"
import { useFilteredPrompts } from "@/hooks/use-filtered-prompts"
import PromptFilters from "@/components/prompts/PromptFilters"
import PromptsGrid from "@/components/prompts/PromptsGrid"
import PromptFormDialog from "@/components/dialogs/PromptFormDialog"

function PromptsContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedAgentType, setSelectedAgentType] = useState("")

  // Get prompts data
  const { data: prompts = [], isLoading, error } = useAllPrompts()

  // Filter prompts based on search and filters
  const filteredPrompts = useFilteredPrompts(
    prompts,
    searchTerm,
    selectedTags,
    selectedAgentType
  )

  const handlePromptEdit = (prompt) => {
    // Optional callback for when a prompt is edited
    console.log("Prompt edited:", prompt)
  }

  const handlePromptDuplicate = (prompt) => {
    // Optional callback for when a prompt is duplicated
    console.log("Prompt duplicated:", prompt)
  }

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
          
          <PromptFormDialog
            mode="create"
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Prompt
              </Button>
            }
          />
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
          onPromptEdit={handlePromptEdit}
          onPromptDuplicate={handlePromptDuplicate}
        />
      </div>
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
