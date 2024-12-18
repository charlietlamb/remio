import { atom } from 'jotai'
import { MediationWithData } from '@remio/database/schema/mediations'
import {
  Feature,
  Status,
} from '@remio/design-system/components/roadmap-ui/calendar'
import { addMinutes } from 'date-fns'

export const scheduleMediationsAtom = atom<MediationWithData[]>([])
export const scheduleFeaturesAtom = atom<Feature[]>((get) => {
  const mediations = get(scheduleMediationsAtom)
  return mediations.map((mediation) => ({
    id: mediation.id,
    name: mediation.title,
    startAt: mediation.date,
    endAt: addMinutes(mediation.date, mediation.duration),
    status: {
      id: mediation.id,
      name: mediation.title,
      color: mediation.color,
    } as Status,
  }))
})
