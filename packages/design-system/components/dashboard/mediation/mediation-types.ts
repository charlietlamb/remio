import { clientSchema } from '@remio/database/schema/clients'
import { z } from 'zod'
import { invoiceValidationSchema } from '../invoices/invoice-schema'
import { colorSchema } from '@remio/design-system/components/form/color/color-picker'

export const mediationDataSchema = z.object({
  data: z.array(
    z.object({
      clientId: z.string(),
      invoice: invoiceValidationSchema.nullable(),
      email: z.boolean(),
    })
  ),
  title: z.string(),
  notes: z.string().nullable(),
  color: colorSchema,
  date: z.coerce.date(),
  duration: z.number(),
})

export type MediationData = z.infer<typeof mediationDataSchema>

export const mediationsRequestSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
})

export type MediationsRequest = z.infer<typeof mediationsRequestSchema>

export const mediationRequestSchema = z.object({
  id: z.string(),
})

export type MediationRequest = z.infer<typeof mediationRequestSchema>

export const mediationDataFormSchema = z.object({
  invoice: invoiceValidationSchema.nullable(),
  email: z.boolean(),
})

export type MediationDataForm = z.infer<typeof mediationDataFormSchema>

export const mediationClientDataFormSchema = z.object({
  client: clientSchema,
  data: mediationDataFormSchema,
})

export type MediationClientDataForm = z.infer<
  typeof mediationClientDataFormSchema
>
