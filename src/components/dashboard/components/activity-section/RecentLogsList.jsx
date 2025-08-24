import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { LogItem } from "./LogItem"

/**
 * RecentLogsList - List of recent log items
 */
export function RecentLogsList({ logs = [] }) {
  if (!logs.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No recent operations</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2 max-h-80 overflow-y-auto">
      {logs.map((log, index) => (
        <LogItem key={log.id || index} log={log} />
      ))}
    </div>
  )
}