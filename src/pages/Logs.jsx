import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRetryAddLeads } from '@/api/add-leads/retryAddLeads'
import { useLogsQueryController } from '@/api/log/getLogsByAction'
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { LogTable } from '@/components/logs-page/LogTable'
import LogTableFilterBar from '@/components/logs-page/LogTableFilterBar'
import { toast } from 'sonner'

export default function Logs() {
    const { user } = useAuth()

    // Retry leads hook
    const { mutate: retryAddLeads, isPending: isRetryPending } = useRetryAddLeads({
        onSuccess: (data) => {
            toast.success(data.message || 'Retry submitted successfully')
            refetchLogs()
        },
        onError: (error) => {
            toast.error(error?.message || 'Failed to submit retry')
        }
    })

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

    const handleApplyFilters = (filters) => {
        setLogsQuery({ ...filters, page: 1 })
    }

    const handleResetFilters = () => {
        resetLogsFilters()
    }

    const handleRetry = (logId) => {
        retryAddLeads({ log_id: logId, user_id: user.id })
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
                />
            </div>
        </DashboardLayout>
    )
}
