import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { SingleSelect } from "@/components/shared/filter/SingleSelect"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"
import GroupSingleSelect from "@/components/shared/dialog/GroupSingleSelect"
import PromptMultiSelect from "@/components/shared/dialog/PromptMultiSelect"
import { StatusSelect } from "@/components/ui/StatusSelect"

/**
 * Pure schema-driven settings form component.
 * Renders UI from a schema and emits updates via callbacks.
 * 
 * @param {Object} schema - The schema object with sections and fields
 * @param {Function} onSchemaChange - Called with updated schema when values change
 * @param {Function} onValuesChange - Called with flat values object when values change
 * @param {Function} onSubmit - Called when Save is clicked
 * @param {string} title - Card title
 * @param {string} description - Card description
 * @param {string} updatedAt - Display string for last update
 * @param {boolean} isLoading - Show skeleton loaders
 * @param {boolean} isSaving - Disable controls and show spinner
 * @param {boolean} showSubmit - Show/hide the Save button
 * @param {boolean} trackDirty - Enable dirty tracking (value vs default)
 * @param {string} submitLabel - Label for submit button
 */
export default function DynamicSettingsForm({
  schema,
  onSchemaChange,
  onValuesChange,
  onSubmit,
  title = "Settings",
  description,
  updatedAt,
  isLoading = false,
  isSaving = false,
  showSubmit = true,
  trackDirty = true,
  submitLabel = "Save"
}) {
  // Get type-based empty value
  const getTypeBasedEmpty = (type) => {
    switch (type) {
      case "boolean": return false
      case "int": return 0
      case "string": return ""
      case "string_enum": return ""
      case "string_multi": return []
      default: return null
    }
  }

  // Resolve current value for a field
  const resolveFieldValue = (field) => {
    return field.value ?? field.default ?? getTypeBasedEmpty(field.type)
  }

  // Build a flat values map from current schema
  const getValuesMap = () => {
    const values = {}
    if (!schema?.sections) return values
    
    for (const section of schema.sections) {
      for (const field of section.fields || []) {
        values[field.key] = resolveFieldValue(field)
      }
    }
    return values
  }

  // Check if a field should be visible
  const isFieldVisible = (field, valuesMap) => {
    if (!field.visibleWhen) return true
    const { field: depKey, equals } = field.visibleWhen
    return valuesMap[depKey] === equals
  }

  // Handle field change
  const handleChange = (fieldKey, newValue) => {
    if (!schema?.sections) return

    // Clone schema and update the field's value
    const nextSchema = {
      ...schema,
      sections: schema.sections.map(section => ({
        ...section,
        fields: section.fields.map(field =>
          field.key === fieldKey
            ? { ...field, value: newValue }
            : field
        )
      }))
    }

    // Emit updated schema
    onSchemaChange?.(nextSchema)

    // Also emit flat values
    const nextValues = {}
    for (const section of nextSchema.sections) {
      for (const field of section.fields || []) {
        nextValues[field.key] = resolveFieldValue(field)
      }
    }
    onValuesChange?.(nextValues)
  }

  // Check if form is dirty (any value differs from default)
  const isDirty = () => {
    if (!trackDirty || !schema?.sections) return false
    
    for (const section of schema.sections) {
      for (const field of section.fields || []) {
        const currentValue = field.value ?? getTypeBasedEmpty(field.type)
        const defaultValue = field.default ?? getTypeBasedEmpty(field.type)
        
        // Deep comparison for arrays
        if (Array.isArray(currentValue) && Array.isArray(defaultValue)) {
          if (JSON.stringify(currentValue) !== JSON.stringify(defaultValue)) {
            return true
          }
        } else if (currentValue !== defaultValue) {
          return true
        }
      }
    }
    return false
  }

  // Humanize field key for labels
  const humanize = (str) => {
    return str
      .replace(/_/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase())
  }

  // Render a single field based on its UI type
  const renderField = (field, valuesMap) => {
    if (!isFieldVisible(field, valuesMap)) return null

    const currentValue = resolveFieldValue(field)
    const fieldLabel = field.label || humanize(field.key)

    switch (field.ui) {
      case "checkbox":
        return (
          <label
            key={field.key}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Checkbox
              checked={!!currentValue}
              onCheckedChange={(val) => handleChange(field.key, !!val)}
              disabled={isLoading || isSaving}
            />
            <span className="text-sm">
              {fieldLabel}
            </span>
            {field.description && (
              <span className="text-xs text-muted-foreground ml-1">
                ({field.description})
              </span>
            )}
          </label>
        )

      case "number":
        return (
          <div key={field.key} className="space-y-1">
            <Label>{fieldLabel}</Label>
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
            <Input
              type="number"
              value={currentValue ?? ""}
              onChange={(e) => {
                const val = e.target.value === "" ? 0 : parseInt(e.target.value, 10)
                handleChange(field.key, val)
              }}
              min={0}
              placeholder={field.placeholder}
              disabled={isLoading || isSaving}
            />
          </div>
        )

      case "text":
        return (
          <div key={field.key} className="space-y-1">
            <Label>{fieldLabel}</Label>
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
            <Input
              type="text"
              value={currentValue ?? ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              disabled={isLoading || isSaving}
            />
          </div>
        )

      case "select":
        return (
          <div key={field.key} className="space-y-1">
            <Label>{fieldLabel}</Label>
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
            <SingleSelect
              value={currentValue}
              onValueChange={(val) => handleChange(field.key, val)}
              options={field.options || []}
              placeholder={field.placeholder || `Select ${fieldLabel}`}
              disabled={isLoading || isSaving}
            />
          </div>
        )

      case "group_single":
        return (
          <div key={field.key} className="space-y-1">
            <Label>{fieldLabel}</Label>
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
            <GroupSingleSelect
              value={currentValue || ""}
              onChange={(id) => handleChange(field.key, id || "")}
              disabled={isLoading || isSaving}
            />
          </div>
        )

      case "prompts_multi":
        return (
          <div key={field.key} className="space-y-1">
            <Label>{fieldLabel}</Label>
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
            <PromptMultiSelect
              value={currentValue || []}
              type={field.promptType || "all"}
              onChange={(val) => handleChange(field.key, val)}
              disabled={isLoading || isSaving}
            />
          </div>
        )

      case "status_single":
        return (
          <div key={field.key} className="space-y-1">
            <Label>{fieldLabel}</Label>
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
            <StatusSelect
              selectedId={currentValue || ""}
              allowClear
              onChange={(s) => handleChange(field.key, s?.id || "")}
              disabled={isLoading || isSaving}
            />
          </div>
        )

      default:
        return null
    }
  }

  // Render skeleton for a field
  const renderSkeleton = (field) => (
    <div key={field.key} className="space-y-1">
      <div className="h-4 w-24 bg-muted animate-pulse rounded" />
      <div className="h-9 w-full bg-muted animate-pulse rounded" />
    </div>
  )

  const valuesMap = getValuesMap()
  const dirty = isDirty()

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {updatedAt && (
          <CardDescription className="text-xs">
            Last updated: {updatedAt}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {!schema?.sections || schema.sections.length === 0 ? (
          <p className="text-sm text-muted-foreground">No settings available.</p>
        ) : (
          schema.sections.map((section) => (
            <div key={section.id || section.title} className="space-y-4">
              {section.title && (
                <div className="border-b pb-2">
                  <h3 className="text-sm font-semibold">{section.title}</h3>
                  {section.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {section.description}
                    </p>
                  )}
                </div>
              )}
              <div className="space-y-3">
                {(section.fields || []).map((field) =>
                  isLoading || isSaving
                    ? renderSkeleton(field)
                    : renderField(field, valuesMap)
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>

      {showSubmit && (
        <CardFooter className="flex justify-end gap-2">
          {(!trackDirty || dirty) && (
            <SpinnerButton
              onClick={() => {
                const values = getValuesMap()
                onSubmit?.(values)
              }}
              loading={isSaving}
              disabled={isLoading}
            >
              {submitLabel}
            </SpinnerButton>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
