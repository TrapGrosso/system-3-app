import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useLogsQueryController } from '@/api/log/getLogsByAction'
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { LogTable } from '@/components/logs-page/LogTable'
import LogTableFilterBar from '@/components/logs-page/LogTableFilterBar'
import { toast } from 'sonner'

export default function Logs() {
    const navigate = useNavigate()
    const { user } = useAuth()

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
        toast.info('Retry functionality not yet implemented')
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
                    isRetryPending={false}
                    onRowClick={handleRowClick}
                />
            </div>
        </DashboardLayout>
    )
}
