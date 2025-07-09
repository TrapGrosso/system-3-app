import * as React from "react"
import { Plus } from "lucide-react"

import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { Button } from "@/components/ui/button"
import { TaskTable, TaskSidebar, TaskFormDialog } from "@/components/tasks"

export default function Tasks() {
    const { user } = useAuth()
    const [selectedTask, setSelectedTask] = React.useState(null)

    const handleTaskSelect = (task) => {
        setSelectedTask(task)
    }

    const handleTaskChange = (updatedTask) => {
        // If task was deleted, clear selection
        if (!updatedTask) {
            setSelectedTask(null)
        } else {
            // Update selected task if it's the same one
            if (selectedTask && selectedTask.id === updatedTask.id) {
                setSelectedTask(updatedTask)
            }
        }
    }

    return (
        <DashboardLayout headerText="Tasks">
            <div className="px-4 lg:px-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">Task Management</h2>
                        <p className="text-muted-foreground">Organize and track your tasks and to-dos</p>
                    </div>
                    <TaskFormDialog>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Task
                        </Button>
                    </TaskFormDialog>
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Task Table - Takes up 2/3 of the space on xl screens */}
                    <div className="xl:col-span-2">
                        <TaskTable 
                            onSelect={handleTaskSelect}
                            selectedTaskId={selectedTask?.id}
                        />
                    </div>
                    
                    {/* Task Sidebar - Takes up 1/3 of the space on xl screens */}
                    <div className="xl:col-span-1">
                        <TaskSidebar 
                            task={selectedTask}
                            onTaskChange={handleTaskChange}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
