import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { CodeIcon } from 'lucide-react'

export default function ResultCodeCard({ result }) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CodeIcon className="h-5 w-5" />
          Result
        </CardTitle>
      </CardHeader>
      <CardContent>
        {result ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">JSON Result</p>
            <pre className="w-full max-w-full overflow-x-auto font-mono text-xs bg-muted p-3 rounded border">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="text-center py-8">
            <CodeIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">No result data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
