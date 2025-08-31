import React, { useState, useMemo } from 'react'
import { decodeOneOfText, encodeOneOfText } from './oneOfText'
import { decodeDateRange, encodeDateRange } from './dateRange'
import { parseCsv, toCsv } from './csv'

/**
 * Creates a set of staged bindings for filter components.
 * This hook simplifies state management for filter bars by providing
 * a unified way to handle input changes, apply filters, and reset them.
 *
 * @param {object} initialQuery The initial query object from the context (e.g., from useProspects().query).
 * @param {object} schema An object defining the filter fields and their types.
 *   Each key in the schema corresponds to a filter parameter.
 *   Value is an object with `kind` (e.g., 'input', 'singleSelect', 'multiCsv', 'pair', 'dateRange', 'oneOf')
 *   and optional `defaultValue`, `fromKey`, `toKey`, `valueKey`, `labelKey`.
 * @param {function} onApplyFilters Callback function to apply filters, receives the new query object.
 * @param {function} onResetFilters Callback function to reset filters.
 * @returns {object} An object containing:
 *   - `staged`: An object with individual binding objects for each filter field.
 *     Each binding object has `value` and `set` (a function to update the staged value).
 *   - `apply`: A function to apply the staged filters to the parent component.
 *   - `reset`: A function to reset all staged filters to their initial state.
 */
export const makeStagedBindings = (initialQuery, schema, onApplyFilters, onResetFilters) => {
  const toOneOfKeys = (opts) => (Array.isArray(opts) ? opts.map(o => typeof o === 'string' ? o : o?.value).filter(Boolean) : [])

  const [stagedValues, setStagedValues] = useState(() => {
    const initial = {}
    for (const key in schema) {
      const field = schema[key]
      switch (field.kind) {
        case 'input':
        case 'singleSelect':
          initial[key] = initialQuery[key] ?? field.defaultValue ?? ''
          break
        case 'multiCsv':
          initial[key] = parseCsv(initialQuery[key])
          break
        case 'pair':
          initial[key] = {
            [field.valueKey]: initialQuery[field.valueKey] ?? field.defaultValue?.value ?? '',
            [field.labelKey]: initialQuery[field.labelKey] ?? field.defaultValue?.label ?? ''
          }
          break
        case 'dateRange':
          initial[key] = {
            from: initialQuery[field.fromKey] ?? '',
            to: initialQuery[field.toKey] ?? ''
          }
          break
        case 'oneOf':
          initial[key] = decodeOneOfText(initialQuery, toOneOfKeys(field.options))
          break
        default:
          initial[key] = ''
      }
    }
    return initial
  })

  // Sync staged values with external query changes
  React.useEffect(() => {
    const newStagedValues = {}
    let changed = false
    for (const key in schema) {
      const field = schema[key]
      let newValue
      switch (field.kind) {
        case 'input':
        case 'singleSelect':
          newValue = initialQuery[key] ?? field.defaultValue ?? ''
          break
        case 'multiCsv':
          newValue = parseCsv(initialQuery[key])
          break
        case 'pair':
          newValue = {
            [field.valueKey]: initialQuery[field.valueKey] ?? field.defaultValue?.value ?? '',
            [field.labelKey]: initialQuery[field.labelKey] ?? field.defaultValue?.label ?? ''
          }
          break
        case 'dateRange':
          newValue = {
            from: initialQuery[field.fromKey] ?? '',
            to: initialQuery[field.toKey] ?? ''
          }
          break
        case 'oneOf':
          newValue = decodeOneOfText(initialQuery, toOneOfKeys(field.options))
          break
        default:
          newValue = ''
      }

      if (JSON.stringify(stagedValues[key]) !== JSON.stringify(newValue)) {
        newStagedValues[key] = newValue
        changed = true
      } else {
        newStagedValues[key] = stagedValues[key] // Keep reference for unchanged values
      }
    }
    if (changed) {
      setStagedValues(newStagedValues)
    }
  }, [initialQuery, schema]) // Deep comparison of initialQuery and schema might be needed for complex cases

  const setters = useMemo(() => {
    const s = {}
    for (const key in schema) {
      s[key] = (newValue) => {
        setStagedValues(prev => ({ ...prev, [key]: newValue }))
      }
    }
    return s
  }, [schema])

  const staged = useMemo(() => {
    const bindings = {}
    for (const key in schema) {
      bindings[key] = {
        value: stagedValues[key],
        set: setters[key]
      }
    }
    return bindings
  }, [schema, stagedValues, setters])

  const apply = React.useCallback(() => {
    const newQuery = {}
    for (const key in schema) {
      const field = schema[key]
      const stagedValue = stagedValues[key]
      switch (field.kind) {
        case 'input':
        case 'singleSelect':
          newQuery[key] = stagedValue
          break
        case 'multiCsv':
          newQuery[key] = toCsv(stagedValue)
          break
        case 'pair':
          newQuery[field.valueKey] = stagedValue[field.valueKey]
          newQuery[field.labelKey] = stagedValue[field.labelKey]
          break
        case 'dateRange':
          newQuery[field.fromKey] = stagedValue.from
          newQuery[field.toKey] = stagedValue.to
          break
        case 'oneOf':
          const { field: oneOfField, value: oneOfValue } = stagedValue || {}
          Object.assign(newQuery, encodeOneOfText(oneOfField, oneOfValue, toOneOfKeys(field.options)))
          break
        default:
          break
      }
    }
    onApplyFilters(newQuery)
  }, [stagedValues, schema, onApplyFilters])

  const reset = React.useCallback(() => {
    const resetValues = {}
    for (const key in schema) {
      const field = schema[key]
      switch (field.kind) {
        case 'input':
        case 'singleSelect':
          resetValues[key] = field.defaultValue ?? ''
          break
        case 'multiCsv':
          resetValues[key] = []
          break
        case 'pair':
          resetValues[key] = {
            [field.valueKey]: field.defaultValue?.value ?? '',
            [field.labelKey]: field.defaultValue?.label ?? ''
          }
          break
        case 'dateRange':
          resetValues[key] = { from: '', to: '' }
          break
        case 'oneOf':
          resetValues[key] = { field: '', value: '' }
          break
        default:
          resetValues[key] = ''
      }
    }
    setStagedValues(resetValues)
    onResetFilters()
  }, [schema, onResetFilters])

  return { staged, apply, reset }
}
