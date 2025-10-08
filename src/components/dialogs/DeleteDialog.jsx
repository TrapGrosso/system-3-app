import * as React from "react"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import DialogWrapper from "@/components/shared/dialog/DialogWrapper"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"

function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  title = "Delete Item",
  description,
  itemName,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  confirmVariant = "destructive",
  icon = <Trash2 className="h-5 w-5" />,
  size = "sm",
  children,
  closeDelayRange = [400, 600], // Optional enhancement: custom delay range
}) {
  const defaultDescription = itemName
    ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
    : null

  const handleConfirm = async () => {
    try {
      // Call the onConfirm callback and wait for it to complete if it returns a promise
      const result = onConfirm?.()
      if (result && typeof result.then === 'function') {
        await result
      }
      
      // Calculate random delay within the specified range
      const [minDelay, maxDelay] = closeDelayRange
      const delay = minDelay + Math.floor(Math.random() * (maxDelay - minDelay + 1))
      
      // Close the dialog after the delay
      setTimeout(() => {
        onOpenChange(false)
      }, delay)
    } catch (error) {
      // If there's an error, we still want to close the dialog after the delay
      const [minDelay, maxDelay] = closeDelayRange
      const delay = minDelay + Math.floor(Math.random() * (maxDelay - minDelay + 1))
      
      setTimeout(() => {
        onOpenChange(false)
      }, delay)
      
      // Re-throw the error for the caller to handle
      throw error
    }
  }

  return (
    <DialogWrapper
      open={open}
      onOpenChange={onOpenChange}
      icon={icon}
      title={title}
      description={description ?? defaultDescription}
      size={size}
    >
      {/* Optional extra body content */}
      {children && <DialogWrapper.Body>{children}</DialogWrapper.Body>}

      <DialogWrapper.Footer className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isLoading}
        >
          {cancelLabel}
        </Button>
        <SpinnerButton
          loading={isLoading}
          variant={confirmVariant}
          onClick={handleConfirm}
          disabled={isLoading}
        >
          {confirmLabel}
        </SpinnerButton>
      </DialogWrapper.Footer>
    </DialogWrapper>
  )
}

export default DeleteDialog
