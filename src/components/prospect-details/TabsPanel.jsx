import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import NotesList from './NotesList'
import TasksList from './TasksList'
import EnrichmentAccordion from './EnrichmentAccordion'
import CampaignsTable from './CampaignsTable'
import GroupsTable from './GroupsTable'

export default function TabsPanel({ notes, tasks, enrichment, campaigns, groups, prospect }) {
  return (
    <div className="px-4 lg:px-6 pb-6">
      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="notes">
            Notes {notes?.length ? `(${notes.length})` : ''}
          </TabsTrigger>
          <TabsTrigger value="tasks">
            Tasks {tasks?.length ? `(${tasks.length})` : ''}
          </TabsTrigger>
          <TabsTrigger value="enrichment">
            Enrichment
          </TabsTrigger>
          <TabsTrigger value="campaigns">
            Campaigns {campaigns?.length ? `(${campaigns.length})` : ''}
          </TabsTrigger>
          <TabsTrigger value="groups">
            Groups {groups?.length ? `(${groups.length})` : ''}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="notes" className="mt-6">
          <NotesList notes={notes} />
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-6">
          <TasksList tasks={tasks} />
        </TabsContent>
        
        <TabsContent value="enrichment" className="mt-6">
          <EnrichmentAccordion enrichment={enrichment} />
        </TabsContent>
        
        <TabsContent value="campaigns" className="mt-6">
          <CampaignsTable campaigns={campaigns} />
        </TabsContent>
        
        <TabsContent value="groups" className="mt-6">
          <GroupsTable groups={groups} prospect={prospect} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
