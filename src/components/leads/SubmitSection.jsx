import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { CheckCircle, AlertCircle, Send } from 'lucide-react'
import { useAddLeads } from '@/hooks/useAddLeads'

export const SubmitSection = ({ urls, onSuccess, onError }) => {
  const { mutate: submitLeads, isPending, isSuccess, isError, error } = useAddLeads({
    onSuccess: (data) => {
      onSuccess?.(data)
    },
    onError: (error) => {
      onError?.(error)
    }
  })

  const handleSubmit = () => {
    if (urls.length === 0) return
    
    const leads = urls.map(url => ({
      url: url.trim(),
      source: 'manual' // We could make this more specific based on the input method
    }))
    
    submitLeads(leads)
  }

  const totalUrls = urls.length
  const hasUrls = totalUrls > 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Ready to submit:</span>
          <Badge variant={hasUrls ? "default" : "secondary"}>
            {totalUrls} URL{totalUrls !== 1 ? 's' : ''}
          </Badge>
        </div>
        
        <Button 
          onClick={handleSubmit}
          disabled={!hasUrls || isPending}
          className="min-w-[120px]"
        >
          {isPending ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Submit Leads
            </>
          )}
        </Button>
      </div>
      
      {/* Status Messages */}
      {isSuccess && (
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="text-sm text-green-700 dark:text-green-300">
            Leads submitted successfully!
          </span>
        </div>
      )}
      
      {isError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <span className="text-sm text-red-700 dark:text-red-300">
            Error: {error?.message || 'Failed to submit leads'}
          </span>
        </div>
      )}
    </div>
  )
}
