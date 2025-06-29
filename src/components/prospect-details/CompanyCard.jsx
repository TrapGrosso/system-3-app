import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLinkIcon, BuildingIcon, UsersIcon, MapPinIcon } from 'lucide-react'

export default function CompanyCard({ company }) {
  if (!company) return null

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
