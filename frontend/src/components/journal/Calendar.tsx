import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import AnimatedContainer from '../ui/AnimatedContainer';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface JournalEntry {
  id: string;
  date: Date;
  content?: string;
  excerpt?: string;
  mood?: string;
}

interface CalendarProps {
  entries: JournalEntry[];
  onSelectDate: (date: Date) => void;
  selectedDate?: Date;
}

const Calendar = ({ entries, onSelectDate, selectedDate }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });
  
  // Calculate the day of the week for first day (0 = Sunday, 1 = Monday, etc.)
  const startDay = getDay(startOfMonth(currentMonth));
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };

  const nextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };

  const hasEntry = (date: Date) => {
    return entries.some(entry => isSameDay(new Date(entry.date), date));
  };

  const getEntryForDate = (date: Date) => {
    return entries.find(entry => isSameDay(new Date(entry.date), date));
  };

  return (
    <AnimatedContainer className="glass-card p-6 w-full shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">{format(currentMonth, 'MMMM yyyy')}</h3>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
            {day}
          </div>
        ))}
        
        {/* Empty cells for days before the first of the month */}
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={`empty-${index}`} className="p-2" />
        ))}
        
        {/* Calendar days */}
        {daysInMonth.map((day) => {
          const hasJournalEntry = hasEntry(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const entry = getEntryForDate(day);
          const today = isToday(day);
          
          const calendarDay = (
            <button
              key={day.toString()}
              onClick={() => onSelectDate(day)}
              className={cn(
                "p-2 text-sm rounded-full flex items-center justify-center relative transition-all h-9 w-9 mx-auto focus-ring",
                today && !isSelected && "bg-accent/20 font-semibold",
                isSelected && "bg-accent text-white",
                hasJournalEntry && !isSelected && "bg-accent/10",
                !isSelected && "hover:bg-accent/5"
              )}
            >
              {format(day, 'd')}
              {hasJournalEntry && !isSelected && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-accent"></span>
              )}
            </button>
          );
          
          if (hasJournalEntry && entry?.content) {
            // Strip HTML for tooltip display
            const plainContent = entry.content.replace(/<[^>]*>/g, '');
            const excerpt = plainContent.length > 60 
              ? plainContent.substring(0, 60).trim() + '...' 
              : plainContent;
              
            return (
              <TooltipProvider key={day.toString()}>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    {calendarDay}
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[200px] p-2">
                    <p className="text-xs">{excerpt}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }
          
          return calendarDay;
        })}
      </div>
    </AnimatedContainer>
  );
};

export default Calendar;
