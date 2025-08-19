import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { SingleSelect } from "@/components/shared/filter/SingleSelect"
import CheckboxMatrix from "@/components/shared/dialog/CheckboxMatrix"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"
import { OPERATION_SCHEMAS, getSchemaDefaults } from "@/utils/operationSettingsSchema"

/**
 * Form for editing a single operation's default settings.
 */
export default function OperationSettingsForm({
  operation,
  initialValues,
  onSave,
  onReset,
  isSaving,
  updatedAt
}) {
  const schema = OPERATION_SCHEMAS[operation]
  const [values, setValues] = React.useState(initialValues || getSchemaDefaults(operation))

  React.useEffect(() => {
    setValues(initialValues || getSchemaDefaults(operation))
  }, [initialValues, operation])

  const handleChange = (field, value) => {
    setValues(prev => ({ ...prev, [field]: value }))
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
        return (
          <div key={fieldKey} className="flex items-center space-x-2">
            <Checkbox
              checked={!!values[fieldKey]}
              onCheckedChange={(val) => handleChange(fieldKey, !!val)}
            />
            <Label>{fieldKey}</Label>
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
        {Object.entries(schema.fields).map(([fieldKey, def]) => renderField(fieldKey, def))}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => onReset(getSchemaDefaults(operation))} disabled={isSaving}>
          Reset
        </Button>
        <SpinnerButton onClick={() => onSave(values)} loading={isSaving}>
          Save
        </SpinnerButton>
      </CardFooter>
    </Card>
  )
}
