import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileUpload } from '@/components/ui/file-upload'
import SpinnerButton from '@/components/shared/ui/SpinnerButton'
import { useAuth } from '@/contexts/AuthContext'
import { useSendHelpRequest } from '../../api/get-help/sendHelpRequest'

const CATEGORY_OPTIONS = [
  { value: 'bug_report', label: 'Bug Report' },
  { value: 'feature_request', label: 'Feature Request' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'other', label: 'Other' }
]

const PLACEHOLDERS = {
  bug_report: "What happened? What were you expecting?",
  feature_request: "What would you like to see added?",
  feedback: "Tell us what's on your mind",
  other: "Describe your request"
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export function GetHelpForm() {
  const { user } = useAuth()
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [fileUploadKey, setFileUploadKey] = useState(0)

  const { mutate, isPending } = useSendHelpRequest({
    onSuccess: (data) => {
      toast.success(data.message || 'Help request forwarded')
      // Reset form
      setCategory('')
      setTitle('')
      setDescription('')
      setFile(null)
      setFileUploadKey(prev => prev + 1)
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to send help request')
    }
  })

  const handleFileChange = (newFiles) => {
    if (!newFiles || newFiles.length === 0) {
      setFile(null)
      return
    }

    const selectedFile = newFiles[0]
    
    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error('File size must be less than 10MB')
      return
    }

    setFile(selectedFile)
  }

  const handleSubmit = () => {
    // Validate required fields
    if (!category) {
      toast.error('Please select a category')
      return
    }

    if (!title.trim()) {
      toast.error('Please enter a title')
      return
    }

    if (!description.trim()) {
      toast.error('Please enter a description')
      return
    }

    // Build FormData
    const formData = new FormData()
    
    if (user?.id) {
      formData.append('user_id', user.id)
    }
    
    formData.append('type', category)
    formData.append('title', title.trim())
    formData.append('description', description.trim())
    
    if (file) {
      formData.append('screenshot', file)
    }

    mutate(formData)
  }

  const isFormValid = category && title.trim() && description.trim()

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Get Help</CardTitle>
        <CardDescription>
          Submit a bug report, feature request, or general feedback. We'll get back to you as soon as possible.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Selection */}
        <div className="space-y-2">
          <Label htmlFor="category">
            Category <span className="text-destructive">*</span>
          </Label>
          <Select 
            value={category} 
            onValueChange={setCategory}
            disabled={isPending}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief description of your issue or suggestion"
            disabled={isPending}
            maxLength={120}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">
            Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={category ? PLACEHOLDERS[category] : "Describe your request"}
            disabled={isPending}
            rows={10}
            className="resize-none"
          />
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label>Screenshot (optional)</Label>
          <div className="text-sm text-muted-foreground mb-2">
            Upload an image to help illustrate your request (max 10MB)
          </div>
          <FileUpload key={fileUploadKey} onChange={handleFileChange} />
          {file && (
            <div className="text-sm text-muted-foreground">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <SpinnerButton
            onClick={handleSubmit}
            loading={isPending}
            disabled={!isFormValid || isPending}
            size="lg"
          >
            {category === 'bug_report' ? 'Send Report' : 'Submit Feedback'}
          </SpinnerButton>
        </div>
      </CardContent>
    </Card>
  )
}
