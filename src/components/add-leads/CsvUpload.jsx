import { useState } from 'react'
import { FileUpload } from '@/components/ui/file-upload'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, Trash2 } from 'lucide-react'

export const CsvUpload = ({ onDataChange }) => {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [parsedData, setParsedData] = useState([])

  const parseCsvContent = (content) => {
    const lines = content.split('\n').filter(line => line.trim())
    const urls = []
    
    lines.forEach(line => {
      // Simple parsing - split by comma and take each cell as potential URL
      const cells = line.split(',').map(cell => cell.trim().replace(/['"]/g, ''))
      cells.forEach(cell => {
        if (cell.includes('linkedin.com')) {
          urls.push(cell)
        }
      })
    })
    
    return urls
  }

  const handleFileUpload = (files) => {
    if (files.length === 0) return
    
    const file = files[0]
    setUploadedFile(file)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target.result
      const urls = parseCsvContent(content)
      setParsedData(urls)
      onDataChange(urls)
    }
    reader.readAsText(file)
  }

  const handleClear = () => {
    setUploadedFile(null)
    setParsedData([])
    onDataChange([])
  }

  const downloadSample = () => {
    const sampleCsv = `LinkedIn URLs
https://linkedin.com/in/john-doe
https://linkedin.com/company/example-corp
https://linkedin.com/in/jane-smith`
    
    const blob = new Blob([sampleCsv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample-leads.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>CSV File Upload</Label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={downloadSample}
          >
            <Download className="h-4 w-4 mr-2" />
            Sample CSV
          </Button>
          {uploadedFile && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="border rounded-lg">
        <FileUpload onChange={handleFileUpload} />
      </div>
      
      {parsedData.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {parsedData.length} URL{parsedData.length !== 1 ? 's' : ''} found
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            File: {uploadedFile?.name}
          </div>
        </div>
      )}
      
      <p className="text-sm text-muted-foreground">
        Upload a CSV file containing LinkedIn URLs. The parser will automatically detect LinkedIn URLs from any column.
      </p>
    </div>
  )
}
