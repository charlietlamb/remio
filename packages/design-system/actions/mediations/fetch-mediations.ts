'use server'

import client from '@remio/design-system/lib/client'
import { headersWithCookies } from '@remio/design-system/lib/header-with-cookies'
import { MediationWithData } from '@remio/database/schema/mediations'

export async function fetchMediations(
  startDate: Date,
  endDate: Date,
  clientId?: string
): Promise<MediationWithData[]> {
  const response = await client.mediations.get.$post(
    {
      json: {
        startDate,
        endDate,
        clientId,
      },
    },
    await headersWithCookies()
  )
  if (!response.ok) {
    throw new Error('Failed to fetch mediations')
  }
  const mediationsResults = await response.json()

  return mediationsResults.map((mediation) => ({
    ...mediation,
    createdAt: new Date(mediation.createdAt),
    updatedAt: new Date(mediation.updatedAt),
    date: new Date(mediation.date),
    data: mediation.data.map((data) => ({
      ...data,
      client: {
        ...data.client,
        createdAt: new Date(data.client.createdAt),
        updatedAt: new Date(data.client.updatedAt),
      },
      invoice: data.invoice
        ? {
            ...data.invoice,
            createdAt: new Date(data.invoice.createdAt),
            updatedAt: new Date(data.invoice.updatedAt),
            dueDate: new Date(data.invoice.dueDate),
            paidAt: data.invoice.paidAt ? new Date(data.invoice.paidAt) : null,
          }
        : null,
    })),
  }))
}
