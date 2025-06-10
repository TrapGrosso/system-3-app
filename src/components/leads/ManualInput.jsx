import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

export const ManualInput = ({ onUrlsChange, initialValue = '' }) => {
  const [inputValue, setInputValue] = useState(initialValue)

  const parseUrls = (text) => {
    if (!text.trim()) return []
    return text
      .split(',')
      .map(url => url.trim())
      .filter(url => url.length > 0)
  }

  const handleInputChange = (e) => {
    const newValue = e.target.value
    setInputValue(newValue)
    const urls = parseUrls(newValue)
    onUrlsChange(urls)
  }

  const handleClear = () => {
    setInputValue('')
    onUrlsChange([])
  }

  const urlCount = parseUrls(inputValue).length

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="manual-urls">LinkedIn URLs</Label>
          <div className="flex items-center gap-2">
            {urlCount > 0 && (
              <Badge variant="secondary">
                {urlCount} URL{urlCount !== 1 ? 's' : ''} detected
              </Badge>
            )}
            {inputValue && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-6 px-2"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        
        <textarea
          id="manual-urls"
          placeholder="Enter LinkedIn profile and company URLs separated by commas..."
          value={inputValue}
          onChange={handleInputChange}
          className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-y dark:bg-input/30"
          rows={4}
        />
        
        <p className="text-sm text-muted-foreground">
          Example: https://linkedin.com/in/john-doe, https://linkedin.com/company/example-corp
        </p>
      </div>
    </div>
  )
}
