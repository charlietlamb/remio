import { createRouter } from '@remio/hono/lib/create-app'
import * as routes from '@remio/hono/routes/invoices/invoices.routes'
import * as handlers from '@remio/hono/routes/invoices/invoices.handlers'

const router = createRouter()
  .openapi(routes.getInvoices, handlers.getInvoices)
  .openapi(routes.getInvoicesWithClient, handlers.getInvoicesWithClient)
  .openapi(routes.addInvoice, handlers.addInvoice)
  .openapi(routes.updateInvoice, handlers.updateInvoice)
  .openapi(routes.deleteInvoice, handlers.deleteInvoice)
  .openapi(routes.getInvoicesChart, handlers.getInvoicesChart)

export default router
