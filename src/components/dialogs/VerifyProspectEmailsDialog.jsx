import * as React from "react"
import { Send } from "lucide-react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

import DialogWrapper from "@/components/shared/dialog/DialogWrapper"
import { Button } from "@/components/ui/button"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"
import { useAuth } from "@/contexts/AuthContext"
import { useverifyProspectEmails } from "@/api/email/verifyProspectEmails"
import CheckboxMatrix from "@/components/shared/dialog/CheckboxMatrix"
import { SingleSelect } from "@/components/shared/filter/SingleSelect"

function VerifyProspectEmailsDialog({
  open,
  onOpenChange,
  prospect_ids,
  onSuccess,
  trigger,
  children
}) {
  const { user } = useAuth()
  const user_id = user?.id
  const queryClient = useQueryClient()

  const [selectedOptions, setSelectedOptions] = React.useState([])
  const [verificationStatus, setVerificationStatus] = React.useState("all")

  const mutation = useverifyProspectEmails({
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
      options: {
        include_valid: selectedOptions.includes("include_valid"),
        include_already_verified: selectedOptions.includes("include_already_verified"),
        verification_status: verificationStatus || "all"
      }
    })
  }

  const handleOpenChange = (newOpen) => {
    onOpenChange(newOpen)
    if (!newOpen) {
      setSelectedOptions([])
      setVerificationStatus("all")
    }
  }

  const INCLUDE_OPTIONS = [
    { value: "include_valid", label: "Include valid emails" },
    { value: "include_already_verified", label: "Include already verified emails" }
  ]

  const VERIFICATION_STATUS_OPTIONS = [
    { value: "all", label: "All" },
    { value: "valid", label: "Valid" },
    { value: "catch_all", label: "Catch All" },
    { value: "invalid", label: "Invalid" }
  ]

  return (
    <DialogWrapper
      open={open}
      onOpenChange={handleOpenChange}
      icon={<Send className="h-5 w-5" />}
      title="Verify Prospect Emails"
      description={`Configure verification options for ${prospect_ids?.length || 0} prospect${prospect_ids?.length !== 1 ? 's' : ''}.`}
      size="sm"
    >
      {trigger && <DialogWrapper.Trigger asChild>{trigger}</DialogWrapper.Trigger>}
      {children && <DialogWrapper.Trigger asChild>{children}</DialogWrapper.Trigger>}

      <DialogWrapper.Body className="space-y-6">
        <p className="text-sm text-muted-foreground">
          This will process <span className="font-medium">{prospect_ids?.length || 0}</span>{" "}
          prospect{prospect_ids?.length !== 1 ? "s" : ""}.
        </p>

        <CheckboxMatrix
          label="Include options"
          options={INCLUDE_OPTIONS}
          value={selectedOptions}
          onChange={setSelectedOptions}
          disabled={mutation.isPending}
        />

        {selectedOptions.includes("include_already_verified") && (
          <SingleSelect
            value={verificationStatus}
            onValueChange={setVerificationStatus}
            options={VERIFICATION_STATUS_OPTIONS}
            placeholder="Verification status"
            triggerClassName="h-9 min-w-[200px]"
            selectProps={{ disabled: mutation.isPending }}
          />
        )}
      </DialogWrapper.Body>

      <DialogWrapper.Footer>
        <Button
          variant="outline"
          onClick={() => handleOpenChange(false)}
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
          Verify Emails
        </SpinnerButton>
      </DialogWrapper.Footer>
    </DialogWrapper>
  )
}

export default VerifyProspectEmailsDialog
