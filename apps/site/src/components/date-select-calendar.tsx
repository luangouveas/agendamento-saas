import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { HTMLAttributes, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DateSelectCalendarProps extends HTMLAttributes<HTMLDivElement> {
  onFilter: (data: Date | undefined) => void
}

export default function DateSelectCalendar({
  className,
  onFilter,
}: DateSelectCalendarProps) {
  const [date, setDate] = useState<Date>()
  const [calendarOpen, setCalendarOpen] = useState(false)

  const alterarDataSelecionada = (data?: Date) => {
    setDate(data)
    setCalendarOpen(!calendarOpen)
    onFilter(data)
  }

  return (
    <div className={cn('', className)}>
      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground',
            )}
            onClick={() => setCalendarOpen(!calendarOpen)}
          >
            <CalendarIcon />
            <span className="flex w-full items-center justify-center">
              {date ? format(date, 'dd/MM/yyyy') : 'Escolha o dia desejado'}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            locale={ptBR}
            selected={date}
            onSelect={(date) => alterarDataSelecionada(date)}
            footer={
              <div className="flex w-full">
                <Button
                  variant="link"
                  onClick={() => alterarDataSelecionada(new Date())}
                >
                  Hoje
                </Button>
                <Button
                  variant="link"
                  onClick={() => alterarDataSelecionada(undefined)}
                >
                  Remover data selecionada
                </Button>
              </div>
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
