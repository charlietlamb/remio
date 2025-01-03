import { HttpStatusCodes } from '@remio/http'
import { db, invoices, mediationClients } from '@remio/database'
import { AppRouteHandler } from '../../lib/types'
import {
  GetMediationsRoute,
  AddMediationRoute,
  UpdateMediationRoute,
  DeleteMediationRoute,
  GetMediationRoute,
  GetMediationsByPageRoute,
} from './mediations.routes'
import { eq, and, lte, gte, ilike, sql } from 'drizzle-orm'
import { mediations } from '@remio/database'

export const addMediation: AppRouteHandler<AddMediationRoute> = async (c) => {
  const user = c.get('user')
  if (!user) {
    return c.json({ error: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
  }

  const { data, date, duration, title, color, notes } =
    await c.req.valid('json')

  try {
    return await db.transaction(async (tx) => {
      const [mediationResult] = await tx
        .insert(mediations)
        .values({
          userId: user.id,
          title,
          notes,
          color,
          date: new Date(date),
          duration,
        })
        .returning()

      if (!mediationResult) {
        throw new Error('Failed to create mediation')
      }

      const invoiceResults = await Promise.all(
        data.map(
          (client) =>
            client.invoice &&
            tx
              .insert(invoices)
              .values({
                userId: user.id,
                clientId: client.clientId,
                amount: client.invoice.amount.toString(),
                dueDate: client.invoice.dueDate,
                reference: client.invoice.reference,
              })
              .returning()
        )
      )

      await Promise.all(
        data.map((client, index) =>
          tx
            .insert(mediationClients)
            .values({
              mediationId: mediationResult.id,
              clientId: client.clientId,
              invoiceId: invoiceResults[index]?.[0]?.id || null,
            })
            .returning()
        )
      )

      return c.json(true, HttpStatusCodes.OK)
    })
  } catch (error) {
    console.error('Error adding mediation:', error)
    return c.json(
      {
        error: 'Failed to add mediation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}

export const updateMediation: AppRouteHandler<UpdateMediationRoute> = async (
  c
) => {
  const user = c.get('user')
  if (!user) {
    return c.json({ error: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
  }

  const { id, data, date, duration, title, notes, color } =
    await c.req.valid('json')

  try {
    return await db.transaction(async (tx) => {
      const [updatedMediation] = await tx
        .update(mediations)
        .set({
          date: new Date(date),
          title,
          notes,
          color,
          duration,
          updatedAt: new Date(),
        })
        .where(and(eq(mediations.id, id), eq(mediations.userId, user.id)))
        .returning()

      if (!updatedMediation) {
        throw new Error('Failed to update mediation')
      }

      const existingMediationClients = await tx
        .select()
        .from(mediationClients)
        .where(eq(mediationClients.mediationId, id))

      const existingClientMap = new Map(
        existingMediationClients.map((mc) => [mc.clientId, mc])
      )
      const newClientMap = new Map(
        data.map((client) => [client.clientId, client])
      )

      const clientsToRemove = existingMediationClients.filter(
        (mc) => !newClientMap.has(mc.clientId)
      )
      const clientsToUpdate = data.filter((client) =>
        existingClientMap.has(client.clientId)
      )
      const clientsToAdd = data.filter(
        (client) => !existingClientMap.has(client.clientId)
      )

      await Promise.all(
        clientsToRemove.map(async (mc) => {
          if (mc.invoiceId) {
            await tx.delete(invoices).where(eq(invoices.id, mc.invoiceId))
          }
          await tx
            .delete(mediationClients)
            .where(eq(mediationClients.id, mc.id))
        })
      )

      await Promise.all(
        clientsToUpdate.map(async (client) => {
          const existingMc = existingClientMap.get(client.clientId)!
          if (existingMc.invoiceId && client.invoice) {
            const [updatedInvoice] = await tx
              .update(invoices)
              .set({
                amount: client.invoice.amount.toString(),
                dueDate: client.invoice.dueDate,
                reference: client.invoice.reference,
                updatedAt: new Date(),
              })
              .where(eq(invoices.id, existingMc.invoiceId))
              .returning()
            return updatedInvoice
          }
          return null
        })
      )

      const newInvoiceResults = await Promise.all(
        clientsToAdd.map(
          (client) =>
            client.invoice &&
            tx
              .insert(invoices)
              .values({
                userId: user.id,
                clientId: client.clientId,
                amount: client.invoice.amount.toString(),
                dueDate: client.invoice.dueDate,
                reference: client.invoice.reference,
              })
              .returning()
        )
      )

      await Promise.all(
        clientsToAdd.map((client, index) =>
          tx.insert(mediationClients).values({
            mediationId: id,
            clientId: client.clientId,
            invoiceId: newInvoiceResults[index]?.[0]?.id || null,
          })
        )
      )

      return c.json(true, HttpStatusCodes.OK)
    })
  } catch (error) {
    console.error('Error updating mediation:', error)
    return c.json(
      {
        error: 'Failed to update mediation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}

export const deleteMediation: AppRouteHandler<DeleteMediationRoute> = async (
  c
) => {
  const user = c.get('user')
  if (!user) {
    return c.json({ error: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
  }

  const { id } = await c.req.json()

  try {
    return await db.transaction(async (tx) => {
      const relatedMediationClients = await tx
        .select()
        .from(mediationClients)
        .where(eq(mediationClients.mediationId, id))

      await Promise.all(
        relatedMediationClients
          .filter((mc) => mc.invoiceId)
          .map((mc) =>
            tx.delete(invoices).where(eq(invoices.id, mc.invoiceId!))
          )
      )

      await tx
        .delete(mediationClients)
        .where(eq(mediationClients.mediationId, id))

      await tx
        .delete(mediations)
        .where(and(eq(mediations.id, id), eq(mediations.userId, user.id)))

      return c.json(true, HttpStatusCodes.OK)
    })
  } catch (error) {
    console.error('Error deleting mediation:', error)
    return c.json(
      {
        error: 'Failed to delete mediation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}

export const getMediations: AppRouteHandler<GetMediationsRoute> = async (c) => {
  const user = c.get('user')
  if (!user) {
    return c.json({ error: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
  }
  const { startDate, endDate, clientId, mediationId } =
    await c.req.valid('json')

  try {
    let query = db.query.mediations.findMany({
      where: and(
        eq(mediations.userId, user.id),
        startDate ? gte(mediations.createdAt, new Date(startDate)) : undefined,
        endDate ? lte(mediations.createdAt, new Date(endDate)) : undefined
      ),
      with: {
        mediationClients: {
          where: clientId ? eq(mediationClients.clientId, clientId) : undefined,
          with: {
            client: true,
            invoice: true,
          },
        },
      },
    })
    const mediationsResults = await query

    const filteredMediations = clientId
      ? mediationsResults.filter((m) => m.mediationClients.length > 0)
      : mediationsResults

    const mediationsWithData = filteredMediations.map((mediation) => ({
      ...mediation,
      data: mediation.mediationClients.map((mc) => ({
        client: mc.client,
        invoice: mc.invoice,
        email: mc.email,
      })),
    }))

    return c.json(mediationsWithData, HttpStatusCodes.OK)
  } catch (error) {
    console.error('Error fetching mediations:', error)
    return c.json(
      { error: 'Failed to fetch mediations' },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}

export const getMediation: AppRouteHandler<GetMediationRoute> = async (c) => {
  const user = c.get('user')
  if (!user) {
    return c.json({ error: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
  }
  const { id } = await c.req.json()

  try {
    const mediation = await db.query.mediations.findFirst({
      where: and(eq(mediations.id, id), eq(mediations.userId, user.id)),
    })

    if (!mediation) {
      return c.json({ error: 'Mediation not found' }, HttpStatusCodes.NOT_FOUND)
    }

    const mediationClientsData = await db.query.mediationClients.findMany({
      where: eq(mediationClients.mediationId, mediation.id),
      with: {
        client: true,
        invoice: true,
      },
    })

    const mediationWithData = {
      ...mediation,
      data: mediationClientsData.map((mc) => ({
        client: mc.client,
        invoice: mc.invoice,
        email: mc.email,
      })),
    }

    return c.json(mediationWithData, HttpStatusCodes.OK)
  } catch (error) {
    console.error('Error fetching mediation:', error)
    return c.json(
      {
        error: 'Failed to fetch mediation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}

export const getMediationsByPage: AppRouteHandler<
  GetMediationsByPageRoute
> = async (c) => {
  const user = c.get('user')
  if (!user) {
    return c.json({ error: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
  }
  const { offset, limit, search } = await c.req.valid('json')

  try {
    const mediationsResults = await db.query.mediations.findMany({
      where: and(
        eq(mediations.userId, user.id),
        search ? ilike(mediations.title, `%${search}%`) : undefined
      ),
      with: {
        mediationClients: {
          with: {
            client: true,
            invoice: true,
          },
        },
      },
      limit,
      offset,
      orderBy: (mediations, { desc }) => [desc(mediations.createdAt)],
    })

    const mediationsWithData = mediationsResults.map((mediation) => ({
      ...mediation,
      data: mediation.mediationClients.map((mc) => ({
        client: mc.client,
        invoice: mc.invoice,
        email: mc.email,
      })),
    }))

    return c.json(mediationsWithData, HttpStatusCodes.OK)
  } catch (error) {
    console.error('Error fetching mediations:', error)
    return c.json(
      {
        error: 'Failed to fetch mediations',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}
