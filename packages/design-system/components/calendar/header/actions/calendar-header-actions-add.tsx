import { Button } from '@remio/design-system/components/ui/button'
import { Plus } from 'lucide-react'
import { useCalendarContext } from '../../calendar-context'

export default function CalendarHeaderActionsAdd() {
  const { setNewEventSheetOpen } = useCalendarContext()
  return (
    <Button
      className="flex items-center gap-1 bg-primary text-background"
      variant="shine"
      onClick={() => setNewEventSheetOpen(true)}
    >
      <Plus />
      New Mediation
    </Button>
  )
}
