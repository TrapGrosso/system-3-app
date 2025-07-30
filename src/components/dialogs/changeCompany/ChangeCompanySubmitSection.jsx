import * as React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export default function ChangeCompanySubmitSection({ 
  value, 
  onChange 
}) {
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const newValue = e.target.value
    onChange(newValue)

    // Basic validation
    if (newValue.trim() && !newValue.includes('linkedin.com')) {
      setError("Please enter a valid LinkedIn company URL")
    } else {
      setError("")
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-medium">Add New Company</h3>
            <p className="text-sm text-muted-foreground">
              Enter a LinkedIn company profile URL to add this company to our database
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin-url" className="text-sm font-medium">
              LinkedIn Company URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="linkedin-url"
              type="url"
              placeholder="https://www.linkedin.com/company/example-company"
              value={value}
              onChange={handleChange}
              autoFocus
              className={error ? "border-destructive" : ""}
            />
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Paste the full LinkedIn company profile URL. The company will be processed and added to your database.
            </p>
          </div>

          <div className="rounded-md bg-muted/50 p-3">
            <h4 className="text-sm font-medium mb-2">Examples of valid URLs:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• https://www.linkedin.com/company/microsoft</li>
              <li>• https://linkedin.com/company/google</li>
              <li>• https://www.linkedin.com/company/tesla-motors</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
