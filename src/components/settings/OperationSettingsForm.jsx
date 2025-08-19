import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  const [values, setValues] = React.useState(getSchemaDefaults(operation))
  const hasHydratedRef = React.useRef(false)
  const baselineRef = React.useRef(null)

  // Normalize values for stable deep comparison based on schema
  function normalizeForCompare(vals) {
    const out = {}
    const fields = schema?.fields || {}
    const defaults = getSchemaDefaults(operation)
    for (const key of Object.keys(fields)) {
      const def = fields[key] || {}
      const v = vals && Object.prototype.hasOwnProperty.call(vals, key) ? vals[key] : undefined
      const d = defaults && Object.prototype.hasOwnProperty.call(defaults, key) ? defaults[key] : undefined

      switch (def.type) {
        case "flags":
        case "prompts_multi": {
          const arr = Array.isArray(v != null ? v : d) ? (v != null ? v : d) : []
          out[key] = arr.map((x) => String(x)).sort()
          break
        }
        case "enum": {
          const val = v != null ? v : d
          out[key] = val == null ? "" : String(val)
          break
        }
        case "boolean": {
          const val = v != null ? v : d
          out[key] = !!val
          break
        }
        case "int": {
          const val = v != null ? v : d
          let n = typeof val === "number" ? val : parseInt(val, 10)
          out[key] = Number.isFinite(n) ? n : null
          break
        }
        case "object":
        case "group_single": {
          const base = v != null ? v : d
          const id = (base && typeof base === "object" && "id" in base) ? base.id : ""
          out[key] = { id: id == null ? "" : String(id) }
          break
        }
        default: {
          out[key] = v != null ? v : d
          break
        }
      }
    }
    return out
  }

  function deepEqual(a, b) {
    try {
      return JSON.stringify(a) === JSON.stringify(b)
    } catch {
      return false
    }
  }

  // Reset hydration when operation changes
  React.useEffect(() => {
    hasHydratedRef.current = false
    setValues(getSchemaDefaults(operation))
  }, [operation])

  // One-time hydration once defaults finish loading
  React.useEffect(() => {
    if (!isLoadingDefaults && !hasHydratedRef.current) {
      const normalizedVals = initialValues || getSchemaDefaults(operation)
      setValues(normalizedVals)
      baselineRef.current = normalizeForCompare(normalizedVals)
      hasHydratedRef.current = true
    }
  }, [isLoadingDefaults, initialValues, operation])

  // Refresh baseline when initialValues change after hydration (e.g., after save/refetch)
  React.useEffect(() => {
    if (hasHydratedRef.current && !isLoadingDefaults) {
      const base = initialValues || getSchemaDefaults(operation)
      baselineRef.current = normalizeForCompare(base)
    }
  }, [initialValues, isLoadingDefaults, operation])

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

  const isDirty = React.useMemo(() => {
    if (isLoadingDefaults || !hasHydratedRef.current || !baselineRef.current) return false
    return !deepEqual(normalizeForCompare(values), baselineRef.current)
  }, [values, isLoadingDefaults, baselineRef.current])

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="capitalize">{operation.replace(/_/g, " ")}</CardTitle>
        <CardDescription>
          Edit default settings for <strong>{operation}</strong>. Last updated: {updatedAt || "—"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoadingDefaults ? (
          // Skeleton placeholders while defaults are loading
          Object.entries(schema.fields).map(([fieldKey, def]) => (
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
        {isDirty && (
          <SpinnerButton onClick={async () => { await onSave(values); baselineRef.current = false }} loading={isSaving} disabled={isLoadingDefaults}>
            Save
          </SpinnerButton>
        )}
      </CardFooter>
    </Card>
  )
}
