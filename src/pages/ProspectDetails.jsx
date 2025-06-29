import React from 'react'
import { useParams } from 'react-router-dom'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'

export default function ProspectDetails() {
  const { linkedinId } = useParams()

  return (
    <DashboardLayout headerText="Prospect Details">
      <div className="px-4 lg:px-6">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">Prospect Details</h2>
          <p className="text-muted-foreground">LinkedIn ID: {linkedinId}</p>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-6">
          <p className="text-center text-muted-foreground">
            Prospect details page placeholder for LinkedIn ID: <strong>{linkedinId}</strong>
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
