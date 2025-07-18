import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Send } from 'lucide-react'

export const SubmitSection = ({ urls, onSubmit, isPending }) => {
  const handleSubmit = () => {
    if (urls.length === 0) return
    onSubmit(urls)
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
    </div>
  )
}
