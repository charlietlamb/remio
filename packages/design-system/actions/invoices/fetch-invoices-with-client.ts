'use server'

import { InvoiceWithClient } from '@remio/database'
import client from '@remio/design-system/lib/client'
import { PAGE_SIZE } from '@remio/design-system/data/page-size'
import { headersWithCookies } from '@remio/design-system/lib/header-with-cookies'

export async function fetchInvoicesWithClient(
  page: number
): Promise<InvoiceWithClient[]> {
  const response = await client['invoices-with-client'].$post(
    {
      json: { offset: page * PAGE_SIZE, limit: PAGE_SIZE },
    },
    await headersWithCookies()
  )
  if (!response.ok) {
    throw new Error('Failed to fetch invoices')
  }
  const invoicesResults = await response.json()

  return invoicesResults.map((invoice) => ({
    ...invoice,
    createdAt: new Date(invoice.createdAt),
    updatedAt: new Date(invoice.updatedAt),
    dueDate: new Date(invoice.dueDate),
    paidAt: invoice.paidAt ? new Date(invoice.paidAt) : null,
    client: {
      ...invoice.client,
      createdAt: new Date(invoice.client.createdAt),
      updatedAt: new Date(invoice.client.updatedAt),
    },
  }))
}