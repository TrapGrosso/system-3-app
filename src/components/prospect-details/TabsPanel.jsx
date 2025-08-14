import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import NotesList from './NotesList'
import TasksList from './TasksList'
import EnrichmentAccordion from './EnrichmentAccordion'
import CampaignsTable from './CampaignsTable'
import GroupsTable from './GroupsTable'
import VariablesTable from './VariablesTable'
import LogsTable from './LogsTable'

export default function TabsPanel(
  { 
    notes, 
    tasks, 
    enrichment, 
    campaigns, 
    groups, 
    variables, 
    logs,
    prospect, 
    onAddNote, 
    onNotesChanged, 
    onAddTask, 
    onTasksChanged, 
    onAddVariable,
    onVariablesChanged,
    onAddToGroup,
    onDeleteEnrichment
  }) {
  const totalEnrichments = Object.values(enrichment || {}).flat().length
  return (
    <div className="px-4 lg:px-6 pb-6">
      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
          <TabsTrigger value="notes">
            Notes {notes?.length ? `(${notes.length})` : ''}
          </TabsTrigger>
          <TabsTrigger value="tasks">
            Tasks {tasks?.length ? `(${tasks.length})` : ''}
          </TabsTrigger>
          <TabsTrigger value="enrichment">
            Enrichment{totalEnrichments ? ` (${totalEnrichments})` : ''}
          </TabsTrigger>
          <TabsTrigger value="campaigns">
            Campaigns {campaigns?.length ? `(${campaigns.length})` : ''}
          </TabsTrigger>
          <TabsTrigger value="groups">
            Groups {groups?.length ? `(${groups.length})` : ''}
          </TabsTrigger>
          <TabsTrigger value="variables">
            Variables {variables?.length ? `(${variables.length})` : ''}
          </TabsTrigger>
          <TabsTrigger value="logs">
            Logs {logs?.length ? `(${logs.length})` : ''}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="notes" className="mt-6">
          <NotesList 
            notes={notes} 
            onAddNote={onAddNote}
            onNotesChanged={onNotesChanged}
          />
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-6">
          <TasksList 
            tasks={tasks} 
            onAddTask={onAddTask}
            onTasksChanged={onTasksChanged}
          />
        </TabsContent>
        
        <TabsContent value="enrichment" className="mt-6">
          <EnrichmentAccordion 
            enrichment={enrichment} 
            onDeleteEnrichment={onDeleteEnrichment}
          />
        </TabsContent>
        
        <TabsContent value="campaigns" className="mt-6">
          <CampaignsTable campaigns={campaigns} />
        </TabsContent>
        
        <TabsContent value="groups" className="mt-6">
          <GroupsTable groups={groups} prospect={prospect} onAddToGroup={onAddToGroup} />
        </TabsContent>
        
        <TabsContent value="variables" className="mt-6">
          <VariablesTable 
            variables={variables} 
            prospect={prospect}
            onAddVariable={onAddVariable}
            onVariablesChanged={onVariablesChanged}
          />
        </TabsContent>
        
        <TabsContent value="logs" className="mt-6">
          <LogsTable logs={logs} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
