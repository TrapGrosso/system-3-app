import * as React from "react"
import { RefreshCw, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { formatRelativeTime } from "@/components/shared/ui/ChartKit"

/**
 * DashboardHeader - Header with param controls for dashboard data query
 */
export function DashboardHeader({
  params,
  onParamsChange,
  lastRefresh,
  onRefresh,
  isLoading = false,
  showAdvanced = false,
  onToggleAdvanced,
}) {
  const handleParamChange = (key, value) => {
    onParamsChange?.({ ...params, [key]: value })
  }

  const handleThresholdChange = (key, value) => {
    const newThresholds = {
      ...params.thresholds,
      [key]: value / 100, // Convert percentage to decimal
    }
    onParamsChange?.({ ...params, thresholds: newThresholds })
  }

  const resetToDefaults = () => {
    onParamsChange?.({
      lookbackDays: 7,
      campaignsLimit: 5,
      topN: 5,
      thresholds: {
        lowOpenRate: 0.15,
        lowReplyRate: 0.02,
        highBounceRate: 0.05,
      },
    })
  }

  return (
    <div className="space-y-4">
      {/* Main Controls Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          {lastRefresh && (
            <p className="text-sm text-muted-foreground">
              Last updated {formatRelativeTime(lastRefresh)}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleAdvanced?.(!showAdvanced)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="lookback" className="text-sm font-medium whitespace-nowrap">
            Time period:
          </Label>
          <Select
            value={String(params.lookbackDays || 7)}
            onValueChange={(value) => handleParamChange("lookbackDays", parseInt(value))}
          >
            <SelectTrigger id="lookback" className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="60">Last 60 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="campaigns" className="text-sm font-medium whitespace-nowrap">
            Campaigns:
          </Label>
          <Select
            value={String(params.campaignsLimit || 5)}
            onValueChange={(value) => handleParamChange("campaignsLimit", parseInt(value))}
          >
            <SelectTrigger id="campaigns" className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">Top 5</SelectItem>
              <SelectItem value="10">Top 10</SelectItem>
              <SelectItem value="20">Top 20</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="topn" className="text-sm font-medium whitespace-nowrap">
            Top items:
          </Label>
          <Select
            value={String(params.topN || 5)}
            onValueChange={(value) => handleParamChange("topN", parseInt(value))}
          >
            <SelectTrigger id="topn" className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">Top 5</SelectItem>
              <SelectItem value="10">Top 10</SelectItem>
              <SelectItem value="20">Top 20</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Advanced Settings */}
      <Collapsible open={showAdvanced} onOpenChange={onToggleAdvanced}>
        <CollapsibleContent>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Thresholds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="low-open-rate" className="text-sm font-medium">
                    Low Open Rate Threshold
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="low-open-rate"
                      type="range"
                      min="5"
                      max="50"
                      step="1"
                      value={(params.thresholds?.lowOpenRate || 0.15) * 100}
                      onChange={(e) => handleThresholdChange("lowOpenRate", parseFloat(e.target.value))}
                      className="flex-1"
                    />
                    <Badge variant="outline" className="min-w-12 justify-center">
                      {((params.thresholds?.lowOpenRate || 0.15) * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Open rates below this will be highlighted
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="low-reply-rate" className="text-sm font-medium">
                    Low Reply Rate Threshold
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="low-reply-rate"
                      type="range"
                      min="1"
                      max="10"
                      step="0.5"
                      value={(params.thresholds?.lowReplyRate || 0.02) * 100}
                      onChange={(e) => handleThresholdChange("lowReplyRate", parseFloat(e.target.value))}
                      className="flex-1"
                    />
                    <Badge variant="outline" className="min-w-12 justify-center">
                      {((params.thresholds?.lowReplyRate || 0.02) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Reply rates below this will be highlighted
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="high-bounce-rate" className="text-sm font-medium">
                    High Bounce Rate Threshold
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="high-bounce-rate"
                      type="range"
                      min="1"
                      max="15"
                      step="0.5"
                      value={(params.thresholds?.highBounceRate || 0.05) * 100}
                      onChange={(e) => handleThresholdChange("highBounceRate", parseFloat(e.target.value))}
                      className="flex-1"
                    />
                    <Badge variant="outline" className="min-w-12 justify-center">
                      {((params.thresholds?.highBounceRate || 0.05) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Bounce rates above this will be highlighted
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={resetToDefaults}>
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
