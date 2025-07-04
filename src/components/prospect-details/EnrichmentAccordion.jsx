import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDownIcon, ChevronRightIcon, DatabaseIcon, PencilIcon, TrashIcon } from 'lucide-react'
import { toast } from 'sonner'

export default function EnrichmentAccordion({ enrichment = {}, onEditEnrichment, onDeleteEnrichment }) {
  const [expandedSections, setExpandedSections] = useState({})

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleEditEnrichment = (item) => {
    if (onEditEnrichment) {
      onEditEnrichment(item)
    } else {
      toast.info('Edit enrichment functionality not implemented yet')
    }
  }

  const handleDeleteEnrichment = (itemId) => {
    if (onDeleteEnrichment) {
      onDeleteEnrichment(itemId)
    } else {
      toast.info('Delete enrichment functionality not implemented yet')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const hasEnrichmentData = Object.keys(enrichment).some(key => 
    Array.isArray(enrichment[key]) && enrichment[key].length > 0
  )

  if (!hasEnrichmentData) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <DatabaseIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No enrichment data available</p>
            <p className="text-sm">Enrichment data will appear here once available.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DatabaseIcon className="h-5 w-5" />
          Enrichment Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(enrichment).map(([section, items]) => {
          if (!Array.isArray(items) || items.length === 0) return null
          
          const isExpanded = expandedSections[section]
          
          return (
            <div key={section} className="border rounded-lg">
              <Button
                variant="ghost"
                onClick={() => toggleSection(section)}
                className="w-full justify-between p-4 h-auto"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium capitalize">{section}</span>
                  <Badge variant="secondary">{items.length}</Badge>
                </div>
                {isExpanded ? (
                  <ChevronDownIcon className="h-4 w-4" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4" />
                )}
              </Button>
              
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3">
                  {items.map((item, index) => (
                    <div key={item.id || index} className="border-l-2 border-muted pl-4 relative group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {item.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.source}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(item.created_at)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditEnrichment(item)}
                            className="h-6 w-6 p-0"
                          >
                            <PencilIcon className="h-3 w-3" />
                            <span className="sr-only">Edit enrichment</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEnrichment(item.id)}
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          >
                            <TrashIcon className="h-3 w-3" />
                            <span className="sr-only">Delete enrichment</span>
                          </Button>
                        </div>
                      </div>
                      
                      {item.summary && (
                        <div className="mb-2">
                          <p className="text-sm font-medium mb-1">Summary:</p>
                          <p className="text-sm text-muted-foreground">{item.summary}</p>
                        </div>
                      )}
                      
                      {item.raw_data && (
                        <div>
                          <p className="text-sm font-medium mb-1">Raw Data:</p>
                          <pre className="text-xs bg-muted p-2 rounded overflow-x-auto max-h-40">
                            {JSON.stringify(item.raw_data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
