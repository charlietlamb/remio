import { HttpStatusCodes } from '@remio/http'
import { jsonContent } from 'stoker/openapi/helpers'
import { unauthorizedSchema } from '@remio/hono/lib/configure-auth'
import { z } from 'zod'
import { createRoute } from '@hono/zod-openapi'
import { invoiceWithClientSchema } from '@remio/database/schema/invoices'
import { invoiceValidationSchema } from '@remio/design-system/components/dashboard/invoices/invoice-schema'
import {
  invoicesChartRequestSchema,
  invoicesChartSchema,
} from '@remio/design-system/components/dashboard/invoices/invoice-types'

const tags = ['Invoices']

export const getInvoices = createRoute({
  path: '/invoices',
  method: 'post',
  summary: 'Get invoices with client',
  tags,
  request: {
    body: {
      description: 'Pagination parameters',
      content: {
        'application/json': {
          schema: z.object({
            offset: z.number(),
            limit: z.number(),
            paid: z.boolean().optional(),
            clientId: z.string().optional(),
          }),
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(invoiceWithClientSchema),
      'Invoices with client fetched.'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({
        error: z.string(),
      }),
      'Failed to fetch invoices'
    ),
    ...unauthorizedSchema,
  },
})

export type GetInvoicesRoute = typeof getInvoices

export const addInvoice = createRoute({
  path: '/invoices/add',
  method: 'post',
  summary: 'Add an invoice',
  tags,
  request: {
    body: {
      description: 'Invoice data',
      content: {
        'application/json': {
          schema: invoiceValidationSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.boolean(), 'Invoice added.'),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({
        error: z.string(),
      }),
      'Failed to add invoice'
    ),
    ...unauthorizedSchema,
  },
})

export type AddInvoiceRoute = typeof addInvoice

export const updateInvoice = createRoute({
  path: '/invoices/update',
  method: 'post',
  summary: 'Update an invoice',
  tags,
  request: {
    body: {
      description: 'Invoice data',
      content: {
        'application/json': {
          schema: invoiceValidationSchema.extend({
            id: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.boolean(), 'Invoice updated.'),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({
        error: z.string(),
      }),
      'Failed to update invoice'
    ),
    ...unauthorizedSchema,
  },
})

export type UpdateInvoiceRoute = typeof updateInvoice

export const deleteInvoice = createRoute({
  path: '/invoices/delete',
  method: 'post',
  summary: 'Delete an invoice',
  tags,
  request: {
    body: {
      description: 'Invoice ID',
      content: {
        'application/json': {
          schema: z.object({ id: z.string() }),
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.boolean(), 'Invoice deleted.'),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({
        error: z.string(),
      }),
      'Failed to delete invoice'
    ),
    ...unauthorizedSchema,
  },
})

export type DeleteInvoiceRoute = typeof deleteInvoice

export const getInvoicesChart = createRoute({
  path: '/invoices/chart',
  method: 'post',
  summary: 'Get invoices chart',
  tags,
  request: {
    body: {
      description: 'Invoices chart request',
      content: {
        'application/json': {
          schema: invoicesChartRequestSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      invoicesChartSchema,
      'Invoices chart fetched.'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({
        error: z.string(),
      }),
      'Failed to fetch invoices chart'
    ),
    ...unauthorizedSchema,
  },
})

export type GetInvoicesChartRoute = typeof getInvoicesChart

export const getInvoiceById = createRoute({
  path: '/invoices/get-by-id',
  method: 'post',
  summary: 'Get invoice by id',
  tags,
  request: {
    body: {
      description: 'Invoice ID',
      content: {
        'application/json': {
          schema: z.object({ id: z.string() }),
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      invoiceWithClientSchema,
      'Invoice fetched.'
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({
        error: z.string(),
      }),
      'Invoice not found'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({
        error: z.string(),
      }),
      'Failed to fetch invoice'
    ),
    ...unauthorizedSchema,
  },
})

export type GetInvoiceByIdRoute = typeof getInvoiceById
