import * as React from "react"
import { CalendarIcon, XIcon } from "lucide-react"
import { format, parseISO } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function DateTimeRangePicker({
  from = '',
  to = '',
  onChange,
  placeholder = "Select range...",
  withTime = false,
  className,
  label
}) {
  const [fromDate, setFromDate] = React.useState(from ? parseISO(from) : undefined)
  const [toDate, setToDate] = React.useState(to ? parseISO(to) : undefined)
  const [fromTime, setFromTime] = React.useState(from && withTime ? format(parseISO(from), 'HH:mm') : '00:00')
  const [toTime, setToTime] = React.useState(to && withTime ? format(parseISO(to), 'HH:mm') : '23:59')
  const [fromOpen, setFromOpen] = React.useState(false)
  const [toOpen, setToOpen] = React.useState(false)

  // Sync props to local state
  React.useEffect(() => {
    if (from !== formatValue(fromDate, fromTime)) {
      setFromDate(from ? parseISO(from) : undefined)
      if (from && withTime) {
        setFromTime(format(parseISO(from), 'HH:mm'))
      }
    }
  }, [from, withTime])

  React.useEffect(() => {
    if (to !== formatValue(toDate, toTime)) {
      setToDate(to ? parseISO(to) : undefined)
      if (to && withTime) {
        setToTime(format(parseISO(to), 'HH:mm'))
      }
    }
  }, [to, withTime])

  const formatValue = (date, time) => {
    if (!date) return ''
    
    if (withTime) {
      const [hours, minutes] = time.split(':')
      const dateWithTime = new Date(date)
      dateWithTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
      return dateWithTime.toISOString()
    } else {
      return format(date, 'yyyy-MM-dd')
    }
  }

  const handleFromChange = (date) => {
    setFromDate(date)
    setFromOpen(false)
    
    const newFrom = formatValue(date, fromTime)
    const newTo = formatValue(toDate, toTime)
    
    onChange({ from: newFrom, to: newTo })
  }

  const handleToChange = (date) => {
    setToDate(date)
    setToOpen(false)
    
    const newFrom = formatValue(fromDate, fromTime)
    const newTo = formatValue(date, toTime)
    
    onChange({ from: newFrom, to: newTo })
  }

  const handleFromTimeChange = (e) => {
    const time = e.target.value
    setFromTime(time)
    
    if (fromDate) {
      const newFrom = formatValue(fromDate, time)
      const newTo = formatValue(toDate, toTime)
      onChange({ from: newFrom, to: newTo })
    }
  }

  const handleToTimeChange = (e) => {
    const time = e.target.value
    setToTime(time)
    
    if (toDate) {
      const newFrom = formatValue(fromDate, fromTime)
      const newTo = formatValue(toDate, time)
      onChange({ from: newFrom, to: newTo })
    }
  }

  const handleClear = () => {
    setFromDate(undefined)
    setToDate(undefined)
    setFromTime('00:00')
    setToTime('23:59')
    onChange({ from: '', to: '' })
  }

  const formatDisplayValue = (date, time) => {
    if (!date) return ''
    if (withTime) {
      return `${format(date, 'MMM dd, yyyy')} ${time}`
    }
    return format(date, 'MMM dd, yyyy')
  }

  const hasValue = fromDate || toDate

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="text-[13px] font-medium text-muted-foreground">
          {label}
        </Label>
      )}
      
      <div className="flex flex-col sm:flex-row gap-2">
        {/* From Date */}
        <div className="flex-1 space-y-1">
          <div className="flex gap-1">
            <Popover open={fromOpen} onOpenChange={setFromOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-9 w-full justify-start text-left font-normal",
                    !fromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? formatDisplayValue(fromDate, fromTime) : "From date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="start">
                <div className="space-y-3">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={handleFromChange}
                    initialFocus
                  />
                  {withTime && (
                    <div className="border-t pt-3">
                      <Label className="text-xs text-muted-foreground">Time</Label>
                      <Input
                        type="time"
                        value={fromTime}
                        onChange={handleFromTimeChange}
                        className="h-8 mt-1"
                      />
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* To Date */}
        <div className="flex-1 space-y-1">
          <div className="flex gap-1">
            <Popover open={toOpen} onOpenChange={setToOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-9 w-full justify-start text-left font-normal",
                    !toDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? formatDisplayValue(toDate, toTime) : "To date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="start">
                <div className="space-y-3">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={handleToChange}
                    initialFocus
                  />
                  {withTime && (
                    <div className="border-t pt-3">
                      <Label className="text-xs text-muted-foreground">Time</Label>
                      <Input
                        type="time"
                        value={toTime}
                        onChange={handleToTimeChange}
                        className="h-8 mt-1"
                      />
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Clear Button */}
        {hasValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-9 px-2 text-muted-foreground hover:text-foreground"
          >
            <XIcon className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  )
}
