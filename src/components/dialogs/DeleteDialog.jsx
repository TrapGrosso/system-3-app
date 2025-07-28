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
}) {
  const defaultDescription = itemName
    ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
    : null

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
          onClick={onConfirm}
          disabled={isLoading}
        >
          {confirmLabel}
        </SpinnerButton>
      </DialogWrapper.Footer>
    </DialogWrapper>
  )
}

export default DeleteDialog
