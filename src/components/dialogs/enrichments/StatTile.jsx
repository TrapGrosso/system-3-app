import * as React from "react"

export function StatTile({ label, value, icon: Icon, valueClass = "" }) {
  return (
    <div className="p-4 bg-muted/50 rounded-lg flex items-center gap-4">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className={`text-lg font-semibold ${valueClass}`}>{value}</p>
      </div>
    </div>
  )
}
