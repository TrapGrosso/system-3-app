import * as React from "react"
import { Eye, Calendar, Tag, Bot } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

function PromptPreviewDialog({ open, onOpenChange, prompt }) {
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const formatAgentType = (type) => {
    if (!type) return null
    return type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            {prompt.name}
          </DialogTitle>
          {prompt.description && (
            <DialogDescription>{prompt.description}</DialogDescription>
          )}
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm">
            {prompt.agent_type && (
              <div className="flex items-center gap-1">
                <Bot className="h-4 w-4" />
                <span className="font-medium">Agent:</span>
                <Badge variant="outline">
                  {formatAgentType(prompt.agent_type)}
                </Badge>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Created:</span>
              <span>{formatDate(prompt.created_at)}</span>
            </div>
          </div>

          {/* Tags */}
          {prompt.tags && prompt.tags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span className="font-medium text-sm">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {prompt.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Full Prompt Text */}
          <div className="space-y-2">
            <span className="font-medium text-sm">Prompt Text:</span>
            <div className="bg-muted/50 p-4 rounded-md">
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {prompt.prompt_text}
              </pre>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PromptPreviewDialog
