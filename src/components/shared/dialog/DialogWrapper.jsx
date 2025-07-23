import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

const SIZE_CONFIG = {
  sm: { width: "sm:max-w-lg", height: "max-h-[80vh]" },
  md: { width: "sm:max-w-xl", height: "max-h-[85vh]" },
  lg: { width: "sm:max-w-3xl", height: "max-h-[90vh]" },
  xl: { width: "sm:max-w-4xl", height: "max-h-[90vh]" },
}

function DialogWrapper({
  children,
  open,
  onOpenChange,
  icon,
  title,
  description,
  size = "lg",
  showCloseButton = true,
  className,
  ...props
}) {
  const sizeConfig = typeof size === "string" ? SIZE_CONFIG[size] : size
  const widthClass = typeof size === "string" ? sizeConfig.width : size.maxWidth || "sm:max-w-lg"
  const heightClass = typeof size === "string" ? sizeConfig.height : size.maxHeight || "max-h-[90vh]"

  return (
    <Dialog open={open} onOpenChange={onOpenChange} {...props}>
      <DialogContent
        className={cn(
          widthClass,
          heightClass,
          "flex flex-col",
          className
        )}
        showCloseButton={showCloseButton}
      >
        {(title || description || icon) && (
          <DialogHeader>
            {title && (
              <DialogTitle className={icon ? "flex items-center gap-2" : ""}>
                {icon}
                {title}
              </DialogTitle>
            )}
            {description && (
              <DialogDescription>
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}
        
        <div className="flex-1 min-h-0 overflow-y-auto">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function DialogWrapperBody({ children, className, ...props }) {
  return (
    <div className={cn("flex-1 overflow-y-auto", className)} {...props}>
      {children}
    </div>
  )
}

function DialogWrapperFooter({ children, className, ...props }) {
  return (
    <DialogFooter className={cn("flex-shrink-0 mt-4", className)} {...props}>
      {children}
    </DialogFooter>
  )
}

DialogWrapper.Body = DialogWrapperBody
DialogWrapper.Footer = DialogWrapperFooter
DialogWrapper.Trigger = DialogTrigger

export default DialogWrapper
