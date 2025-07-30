import * as React from "react"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { SingleSelect } from './SingleSelect'

const SIZE_OPERATOR_OPTIONS = [
  { value: null, label: 'Any' },
  { value: '<', label: '<' },
  { value: '<=', label: '<=' },
  { value: '=', label: '=' },
  { value: '>=', label: '>=' },
  { value: '>', label: '>' },
]

export function SizeFilter({
  sizeOp = '',
  sizeVal = '',
  onChange,
  disabled,
  className
}) {
  const handleOpChange = (newOp) => {
    onChange({ size_op: newOp, size_val: sizeVal })
  }

  const handleValueChange = (e) => {
    const newVal = e.target.value
    onChange({ size_op: sizeOp, size_val: newVal })
  }

  return (
    <div className={`flex flex-col gap-3 ${className || ''}`}>
      <div className="space-y-1">
        <Label className="text-xs font-medium text-muted-foreground">
          Size Operator
        </Label>
        <SingleSelect
          value={sizeOp}
          onValueChange={handleOpChange}
          options={SIZE_OPERATOR_OPTIONS}
          placeholder="Any"
          triggerClassName="h-8 w-full"
          selectProps={{ disabled }}
        />
      </div>
      
      <div className="space-y-1">
        <Label className="text-xs font-medium text-muted-foreground">
          Size Value
        </Label>
        <Input
          type="number"
          value={sizeVal}
          onChange={handleValueChange}
          placeholder="Enter number"
          className="h-8"
          disabled={disabled}
        />
      </div>
    </div>
  )
}