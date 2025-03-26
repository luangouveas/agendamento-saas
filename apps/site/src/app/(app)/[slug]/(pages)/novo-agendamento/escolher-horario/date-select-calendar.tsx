import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DateSelectCalendarProps {
  onFilter: (data: Date | undefined) => void
}

export default function DateSelectCalendar({
  onFilter,
}: DateSelectCalendarProps) {
  const [date, setDate] = useState<Date>()
  const [calendarOpen, setCalendarOpen] = useState(false)

  return (
    <div>
      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-[240px] justify-start text-left font-normal sm:w-80',
              !date && 'text-muted-foreground',
            )}
            onClick={() => setCalendarOpen(!calendarOpen)}
          >
            <CalendarIcon />
            <span className="flex w-full items-center justify-center">
              {date ? format(date, 'dd/MM/yyyy') : 'Escolha um dia desejado'}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              setDate(date)
              setCalendarOpen(!calendarOpen)
              onFilter(date)
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
