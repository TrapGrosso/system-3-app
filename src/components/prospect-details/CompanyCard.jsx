import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLinkIcon, BuildingIcon, UsersIcon, MapPinIcon, PlusIcon } from 'lucide-react'
import { toast } from 'sonner'

export default function CompanyCard({ company, onAddCompany }) {
  const handleAddCompany = () => {
    if (onAddCompany) {
      onAddCompany()
    } else {
      toast.info('Add company functionality not implemented yet')
    }
  }

  if (!company) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <BuildingIcon className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl">No company associated with prospect was found</CardTitle>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <BuildingIcon className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">This prospect is not currently associated with any company.</p>
            <Button onClick={handleAddCompany} variant="outline">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add a company
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { name, website, industry, size, location } = company

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-muted rounded-lg">
            <BuildingIcon className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl">{name}</CardTitle>
            {website && (
              <CardDescription className="flex items-center gap-1 mt-1">
                <ExternalLinkIcon className="h-3 w-3" />
                <a 
                  href={website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {website.replace(/^https?:\/\//, '')}
                </a>
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {industry && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <BuildingIcon className="h-3 w-3" />
              {industry}
            </Badge>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {size && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <UsersIcon className="h-4 w-4" />
              <span>{size} employees</span>
            </div>
          )}
          
          {location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPinIcon className="h-4 w-4" />
              <span>{location}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
