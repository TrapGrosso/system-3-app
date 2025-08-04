import { useState, useCallback } from "react"

/**
 * Hook for managing delete dialog state and confirmation flow
 * @param {Function} deleteFn - async function(item) → performs deletion
 * @param {Function} [onSuccess] - optional callback after successful delete
 * @returns {
 *   openDialog(item),      // call this to show modal
 *   DeleteDialogProps,     // spread on <DeleteDialog {...DeleteDialogProps} />
 *   currentItem            // the object passed to openDialog
 * }
 */
export default function useDeleteDialog(deleteFn, onSuccess) {
  const [open, setOpen] = useState(false)
  const [currentItem, setItem] = useState(null)
  const [loading, setLoading] = useState(false)

  const openDialog = useCallback((item) => {
    setItem(item)
    setOpen(true)
  }, [])

  const handleConfirm = useCallback(async () => {
    if (!currentItem && deleteFn.length > 0) return // if deleteFn expects an item but none provided
    setLoading(true)
    try {
      await deleteFn(currentItem)
      onSuccess?.(currentItem)
    } finally {
      setLoading(false)
      setOpen(false)
      setItem(null)
    }
  }, [currentItem, deleteFn, onSuccess])

  return {
    openDialog,
    currentItem,
    DeleteDialogProps: {
      open,
      onOpenChange: setOpen,
      onConfirm: handleConfirm,
      isLoading: loading,
    },
  }
}
