import * as React from "react"
import { useState } from "react"
import { 
  Edit3, 
  Copy, 
  Trash2, 
  MoreVertical, 
  Eye, 
  Calendar,
  Tag,
  Bot
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"

import { usePrompts } from "@/contexts/PromptContext"
import PromptFormDialog from "@/components/dialogs/PromptFormDialog"

function PromptCard({ prompt, onEdit, onDuplicate }) {
  const [showPreview, setShowPreview] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const { deletePrompt, duplicatePrompt, isDeletingPrompt } = usePrompts()

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

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt_text)
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy prompt:", err)
    }
  }

  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate(prompt)
    } else {
      duplicatePrompt(prompt)
    }
  }

  const handleDelete = () => {
    deletePrompt(prompt.id)
    setShowDeleteConfirm(false)
  }

  const truncateText = (text, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <>
      <Card className="group hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold truncate">
                {prompt.name}
              </CardTitle>
              {prompt.description && (
                <CardDescription className="mt-1 line-clamp-2">
                  {prompt.description}
                </CardDescription>
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setShowPreview(true)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyPrompt}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy text
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Prompt Preview */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-mono bg-muted/50 p-3 rounded-md">
              {truncateText(prompt.prompt_text)}
            </p>
            {prompt.prompt_text.length > 150 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(true)}
                className="text-xs"
              >
                View full prompt
              </Button>
            )}
          </div>

          {/* Metadata */}
          <div className="space-y-3">
            {/* Agent Type */}
            {prompt.agent_type && (
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline" className="text-xs">
                  {formatAgentType(prompt.agent_type)}
                </Badge>
              </div>
            )}

            {/* Tags */}
            {prompt.tags && prompt.tags.length > 0 && (
              <div className="flex items-start gap-2">
                <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex flex-wrap gap-1">
                  {prompt.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {prompt.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{prompt.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Created {formatDate(prompt.created_at)}
              </div>
              {prompt.updated_at !== prompt.created_at && (
                <div>
                  Updated {formatDate(prompt.updated_at)}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditDialog(true)}
              className="flex-1"
            >
              <Edit3 className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDuplicate}
              className="flex-1"
            >
              <Copy className="h-4 w-4 mr-1" />
              Duplicate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Prompt</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{prompt.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeletingPrompt}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeletingPrompt}
            >
              {isDeletingPrompt && <Spinner size="sm" className="mr-2" />}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PromptCard
