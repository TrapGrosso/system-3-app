import * as React from "react"
import { useState } from "react"
import { toast } from "sonner"

import { usePrompts } from "@/contexts/PromptContext"
import PromptFormDialog from "@/components/dialogs/PromptFormDialog"
import PromptCardBody from "./PromptCardBody"
import PromptPreviewDialog from "./PromptPreviewDialog"
import PromptDeleteDialog from "./PromptDeleteDialog"

function PromptCard({ prompt, onEdit, onDuplicate }) {
  const [showPreview, setShowPreview] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const { deletePrompt, duplicatePrompt, isDeletingPrompt } = usePrompts()

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt_text)
      toast.success("Copied to clipboard")
    } catch (err) {
      console.error("Failed to copy prompt:", err)
      toast.error("Failed to copy prompt")
    }
  }

  const handleDuplicate = () => {
      duplicatePrompt(prompt.id)
  }

  const handleDelete = () => {
    deletePrompt(prompt.id)
    setShowDeleteConfirm(false)
  }

  return (
    <>
      <PromptCardBody
        prompt={prompt}
        onEdit={() => setShowEditDialog(true)}
        onDuplicate={handleDuplicate}
        onCopy={handleCopyPrompt}
        onPreview={() => setShowPreview(true)}
        onAskDelete={() => setShowDeleteConfirm(true)}
      />

      <PromptPreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        prompt={prompt}
      />

      <PromptDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        prompt={prompt}
        onConfirm={handleDelete}
        isLoading={isDeletingPrompt}
      />

      {/* Edit Dialog */}
      <PromptFormDialog
        mode="edit"
        prompt={prompt}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={() => {
          setShowEditDialog(false)
          onEdit?.(prompt)
        }}
      />
    </>
  )
}

export default PromptCard
