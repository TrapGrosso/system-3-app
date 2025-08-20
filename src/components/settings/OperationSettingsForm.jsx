import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { SingleSelect } from "@/components/shared/filter/SingleSelect"
import CheckboxMatrix from "@/components/shared/dialog/CheckboxMatrix"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"
import { OPERATION_SCHEMAS, getSchemaDefaults } from "@/components/settings/operationSettingsSchema"
import GroupSingleSelect from "@/components/shared/dialog/GroupSingleSelect"
import PromptMultiSelect from "@/components/shared/dialog/PromptMultiSelect"

/**
 * Form for editing a single operation's default settings.
 */
export default function OperationSettingsForm({
  operation,
  initialValues,
  onSave,
  isSaving,
  updatedAt,
  isLoadingDefaults
}) {
  const schema = OPERATION_SCHEMAS[operation]

  const [values, setValues] = React.useState(initialValues)
  const [dirty, setDirty] = React.useState(false)

  React.useEffect(() => {
    if (!isLoadingDefaults || !isSaving) {
      setValues(initialValues)
      setDirty(false)
    }
  }, [operation, initialValues, isLoadingDefaults])

  const handleChange = (field, value) => {
    setValues(prev => ({ ...prev, [field]: value }))
    setDirty(true)
  }

  const renderField = (fieldKey, def) => {
    switch (def.type) {
      case "flags":
        return (
          <CheckboxMatrix
            key={fieldKey}
            label={fieldKey}
            options={def.options}
            value={values[fieldKey] || []}
            onChange={(val) => handleChange(fieldKey, val)}
            columns="grid-cols-1 sm:grid-cols-2"
          />
        )
      case "enum":
        return (
          <div key={fieldKey} className="space-y-1">
            <Label>{fieldKey}</Label>
            <SingleSelect
              value={values[fieldKey]}
              onValueChange={(val) => handleChange(fieldKey, val)}
              options={def.options}
              placeholder={`Select ${fieldKey}`}
            />
          </div>
        )
      case "boolean":
        const humanize = (s) => s.replace(/_/g, " ").toLowerCase()
        return (
          <div key={fieldKey} className="flex items-center space-x-2">
            <Checkbox
              checked={!!values[fieldKey]}
              onCheckedChange={(val) => handleChange(fieldKey, !!val)}
            />
            <Label className="capitalize cursor-pointer">{def.label || humanize(fieldKey)}</Label>
          </div>
        )
      case "int":
        return (
          <div key={fieldKey} className="space-y-1">
            <Label>{fieldKey}</Label>
            <Input
              type="number"
              value={values[fieldKey] ?? def.default}
              onChange={(e) => handleChange(fieldKey, parseInt(e.target.value, 10))}
              min={0}
            />
          </div>
        )
      case "object":
        return (
          <div key={fieldKey} className="space-y-1">
            <Label>{fieldKey} (object reference)</Label>
            <Input
              value={values[fieldKey]?.id || ""}
              onChange={(e) => handleChange(fieldKey, { id: e.target.value })}
              placeholder="Enter group id"
            />
          </div>
        )
      case "group_single":
        return (
          <div key={fieldKey} className="space-y-1">
            <Label>{fieldKey}</Label>
            <GroupSingleSelect
              value={values[fieldKey]?.id || ""}
              onChange={(id) => handleChange(fieldKey, { id })}
            />
          </div>
        )
      case "prompts_multi":
        return (
          <div key={fieldKey} className="space-y-1">
            <Label>{fieldKey}</Label>
            <PromptMultiSelect
              value={values[fieldKey] || []}
              type={def.promptType || "all"}
              onChange={(val) => handleChange(fieldKey, val)}
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="capitalize">{operation.replace(/_/g, " ")}</CardTitle>
        <CardDescription>
          Edit default settings for <strong>{operation}</strong>. Last updated: {updatedAt || "—"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoadingDefaults || isSaving ? (
          // Skeleton placeholders while defaults are loading
          Object.entries(schema.fields).map(([fieldKey]) => (
            <div key={fieldKey} className="space-y-1">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-9 w-full bg-muted animate-pulse rounded" />
            </div>
          ))
        ) : (
          Object.entries(schema.fields).map(([fieldKey, def]) => renderField(fieldKey, def))
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {dirty && (
          <SpinnerButton
            onClick={async () => {
              await onSave(values)
              setDirty(false)
            }}
            loading={isSaving}
            disabled={isLoadingDefaults}
          >
            Save
          </SpinnerButton>
        )}
      </CardFooter>
    </Card>
  )
}
