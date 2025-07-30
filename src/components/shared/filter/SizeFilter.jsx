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
    <div className={`flex flex-col sm:flex-row gap-2 ${className || ''}`}>
      <div className="flex-1 space-y-2">
        <Label className="text-[13px] font-medium text-muted-foreground">
          Size Operator
        </Label>
        <SingleSelect
          value={sizeOp}
          onValueChange={handleOpChange}
          options={SIZE_OPERATOR_OPTIONS}
          placeholder="Any"
          triggerClassName="h-9 min-w-[100px]"
          selectProps={{ disabled }}
        />
      </div>
      
      <div className="flex-1 space-y-2">
        <Label className="text-[13px] font-medium text-muted-foreground">
          Size Value
        </Label>
        <Input
          type="number"
          value={sizeVal}
          onChange={handleValueChange}
          placeholder="Enter number"
          className="h-9"
          disabled={disabled}
        />
      </div>
    </div>
  )
}
