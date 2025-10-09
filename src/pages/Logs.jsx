import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useLogsQueryController } from '@/api/log/getLogsByAction'
import { useRetryLog } from '@/api/log/retryLog'
import { useDialogs } from '@/contexts/DialogsContext'
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { LogTable } from '@/components/logs-page/LogTable'
import LogTableFilterBar from '@/components/logs-page/LogTableFilterBar'
import { toast } from 'sonner'

export default function Logs() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { confirm } = useDialogs()

    // Fetch logs using the controller
    const {
        data: logs = [],
        total: logsTotal = 0,
        query: logsQuery,
        setQuery: setLogsQuery,
        resetFilters: resetLogsFilters,
        isLoading: isLoadingLogs,
        isFetching: isFetchingLogs,
        isError: isErrorLogs,
        error: logsError,
        refetch: refetchLogs
    } = useLogsQueryController({
        userId: user.id
    })

    const { mutate: retryLogMutate, isPending: isRetryPending } = useRetryLog({
        onSuccess: () => {
            toast.success('Retry triggered successfully')
            refetchLogs()
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to retry log')
        }
    })

    const handleApplyFilters = (filters) => {
        setLogsQuery({ ...filters, page: 1 })
    }

    const handleResetFilters = () => {
        resetLogsFilters()
    }

    const handleRetry = async (logId) => {
        const result = await confirm({
            title: 'Retry Log',
            description: 'Are you sure you want to retry this log? This action cannot be undone.',
            confirmLabel: 'Retry',
            cancelLabel: 'Cancel'
        })
        
        if (result) {
            retryLogMutate({ user_id: user.id, log_id: logId })
        }
    }

    const handleRowClick = (log) => {
        navigate(`/logs/${log.id}`)
    }

    return (
        <DashboardLayout headerText="Logs">
            <div className="px-4 lg:px-6 space-y-6">
                <LogTableFilterBar
                    query={{ ...logsQuery }}
                    onApplyFilters={handleApplyFilters}
                    onResetFilters={handleResetFilters}
                    loading={isLoadingLogs || isFetchingLogs}
                />
                <LogTable 
                    data={logs}
                    total={logsTotal}
                    query={logsQuery}
                    onQueryChange={setLogsQuery}
                    loading={isLoadingLogs || isFetchingLogs}
                    isError={isErrorLogs}
                    error={logsError}
                    onRetry={handleRetry}
                    isRetryPending={isRetryPending}
                    onRowClick={handleRowClick}
                />
            </div>
        </DashboardLayout>
    )
}
