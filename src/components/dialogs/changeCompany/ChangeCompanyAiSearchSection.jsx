import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import CheckboxMatrix from "@/components/shared/dialog/CheckboxMatrix"
import { SingleSelect } from "@/components/shared/filter/SingleSelect"

// Precision options
const PRECISION_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "default", label: "Default" },
  { value: "high", label: "High" },
]

// AI search flag options
const FLAG_OPTIONS = [
  { value: 'cache_linkedin_scrape', label: 'Cache linkedin scrape' }
]

export default function ChangeCompanyAiSearchSection({
  precision,
  setPrecision,
  flags,
  setFlags,
  disabled = false,
  isLoadingDefaults = false
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-medium">Search with AI</h3>
            <p className="text-sm text-muted-foreground">
              Use AI to search for companies based on prospect information
            </p>
          </div>

          {/* AI Disclaimer */}
          <div className="flex items-start gap-3 p-3 rounded-md bg-yellow-50 border border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-900/30">
            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Important:</strong> AI search results may contain mistakes or inaccuracies. 
              Please review results carefully before proceeding.
            </p>
          </div>

          {/* Precision Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Agent Precision
            </label>
            <SingleSelect
              value={precision}
              onValueChange={setPrecision}
              options={PRECISION_OPTIONS}
              placeholder="Select precision level"
              triggerClassName="h-9 min-w-[180px]"
              selectProps={{ disabled: disabled || isLoadingDefaults }}
            />
            <p className="text-xs text-muted-foreground">
              Higher precision may provide more accurate results but will take longer to process.
            </p>
          </div>

          {/* Search Flags */}
          <CheckboxMatrix
            label="Search Options"
            options={FLAG_OPTIONS}
            value={flags}
            onChange={setFlags}
            disabled={disabled || isLoadingDefaults}
            columns="grid-cols-1"
            className="space-y-3"
          />
        </div>
      </CardContent>
    </Card>
  )
}
