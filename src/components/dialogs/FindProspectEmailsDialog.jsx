import * as React from "react"
import { Send } from "lucide-react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

import DialogWrapper from "@/components/shared/dialog/DialogWrapper"
import { Button } from "@/components/ui/button"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"
import { useAuth } from "@/contexts/AuthContext"
import { usefindProspectEmails } from "@/api/email/findProspectEmails"
import CheckboxMatrix from "@/components/shared/dialog/CheckboxMatrix"

function FindProspectEmailsDialog({
  open,
  onOpenChange,
  prospect_ids,
  onSuccess,
}) {
  const { user } = useAuth()
  const user_id = user?.id
  const queryClient = useQueryClient()

  const [selectedOptions, setSelectedOptions] = React.useState([])

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
    const options = {
      retry_not_found: selectedOptions.includes("retry_not_found"),
      verify_emails: selectedOptions.includes("verify_emails"),
    }
    if (options.verify_emails) {
      options.include_valid = selectedOptions.includes("include_valid")
    }
    mutation.mutate({
      user_id,
      prospect_ids,
      options
    })
  }

  const handleOpenChange = (newOpen) => {
    onOpenChange(newOpen)
    if (!newOpen) {
      setSelectedOptions([])
    }
  }

  const FIND_OPTIONS = [
    { value: "retry_not_found", label: "Retry emails previously marked as not found" },
    { value: "verify_emails", label: "Verify emails after finding" }
  ]
  const VERIFY_INCLUDE_OPTIONS = [
    { value: "include_valid", label: "Include emails already valid" }
  ]

  return (
    <DialogWrapper
      open={open}
      onOpenChange={handleOpenChange}
      icon={<Send className="h-5 w-5" />}
      title="Find Prospect Emails"
      size="sm"
    >
      <DialogWrapper.Body className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Only prospects with an associated company will be included. This will
          process <span className="font-medium">{prospect_ids?.length}</span>{" "}
          prospect{prospect_ids?.length !== 1 ? "s" : ""}.
        </p>
        
        <CheckboxMatrix
          label="Options"
          options={FIND_OPTIONS}
          value={selectedOptions}
          onChange={setSelectedOptions}
          disabled={mutation.isPending}
        />

        {selectedOptions.includes("verify_emails") && (
          <CheckboxMatrix
            label="Verify include options"
            options={VERIFY_INCLUDE_OPTIONS}
            value={selectedOptions}
            onChange={setSelectedOptions}
            disabled={mutation.isPending}
          />
        )}
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
