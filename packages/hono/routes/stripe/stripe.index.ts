import { createRouter } from '@remio/hono/lib/create-app'
import * as routes from '@remio/hono/routes/stripe/stripe.routes'
import * as handlers from '@remio/hono/routes/stripe/stripe.handlers'

const router = createRouter()
  .openapi(routes.connect, handlers.connect)
  .openapi(routes.connectGet, handlers.connectGet)

export default router
