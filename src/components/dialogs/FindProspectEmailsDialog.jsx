import * as React from "react"
import { Send } from "lucide-react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

import DialogWrapper from "@/components/shared/dialog/DialogWrapper"
import { Button } from "@/components/ui/button"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"
import { useAuth } from "@/contexts/AuthContext"
import { usefindProspectEmails } from "@/api/email/findProspectEmails"

function FindProspectEmailsDialog({
  open,
  onOpenChange,
  prospect_ids,
  onSuccess,
}) {
  const { user } = useAuth()
  const user_id = user?.id
  const queryClient = useQueryClient()

  const mutation = usefindProspectEmails({
    onSuccess: (data) => {
      toast.success(data.message || "Prospects processed successfully")
      queryClient.invalidateQueries()
      if (onSuccess) onSuccess(data)
      onOpenChange(false)
    },
    onError: (error) => {
      toast.error(error.message || "Failed to process prospects")
      onOpenChange(false)
    },
  })

  const handleSubmit = () => {
    if (!user_id || !prospect_ids?.length) return
    mutation.mutate({
      user_id,
      prospect_ids,
    })
  }

  return (
    <DialogWrapper
      open={open}
      onOpenChange={onOpenChange}
      icon={<Send className="h-5 w-5" />}
      title="Find Prospect Emails"
      size="sm"
    >
      <DialogWrapper.Body>
        <p className="text-sm text-muted-foreground">
          Only prospects with an associated company will be included. This will
          process <span className="font-medium">{prospect_ids?.length}</span>{" "}
          prospect{prospect_ids?.length !== 1 ? "s" : ""}.
        </p>
      </DialogWrapper.Body>

      <DialogWrapper.Footer>
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={mutation.isPending}
        >
          Cancel
        </Button>
        <SpinnerButton
          loading={mutation.isPending}
          onClick={handleSubmit}
          disabled={!prospect_ids?.length || mutation.isPending}
        >
          <Send className="h-4 w-4 mr-2" />
          Find Emails
        </SpinnerButton>
      </DialogWrapper.Footer>
    </DialogWrapper>
  )
}

export default FindProspectEmailsDialog
