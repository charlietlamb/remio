import {
  GetUserRoute,
  ResetPasswordRoute,
  UpdateUserRoute,
} from '@remio/hono/routes/user/user.routes'
import { AppRouteHandler } from '@remio/hono/lib/types'
import { db } from '@remio/database'
import { eq } from 'drizzle-orm'
import { users } from '@remio/database/schema/users'
import { updateUserSchema } from '@remio/hono/routes/user/user.schema'
import { HttpStatusCodes } from '@remio/http'
import { verifications } from '@remio/database/schema/verifications'
import { hashPassword } from '@remio/hono/lib/password'
import { accounts } from '@remio/database/schema'

export const get: AppRouteHandler<GetUserRoute> = async (c) => {
  const userId = c.req.param('userId')
  if (!userId) {
    return c.json({ error: 'User ID is required' }, HttpStatusCodes.BAD_REQUEST)
  }
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  })

  if (!user) {
    return c.json({ error: 'User not found' }, HttpStatusCodes.NOT_FOUND)
  }

  return c.json(user, HttpStatusCodes.OK)
}

export const update: AppRouteHandler<UpdateUserRoute> = async (c) => {
  const authUser = await c.get('user')
  if (!authUser) {
    return c.json({ error: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
  }
  const body = await c.req.json()
  const data = updateUserSchema.parse(body)
  if (!data) {
    return c.json({ error: 'Incorrect body sent' }, HttpStatusCodes.BAD_REQUEST)
  }

  const [user] = await db
    .update(users)
    .set({
      ...data.form,
    })
    .where(eq(users.id, authUser.id))
    .returning()

  if (!user) {
    return c.json({ error: 'User not found' }, HttpStatusCodes.NOT_FOUND)
  }

  return c.json(user, HttpStatusCodes.OK)
}

export const resetPassword: AppRouteHandler<ResetPasswordRoute> = async (c) => {
  const { token, password } = await c.req.json()
  if (!token) {
    return c.json({ error: 'Token is required' }, HttpStatusCodes.BAD_REQUEST)
  }
  const verification = await db.query.verifications.findFirst({
    where: eq(verifications.identifier, `reset-password:${token}`),
  })
  if (!verification) {
    return c.json(
      { error: 'Verification not found' },
      HttpStatusCodes.NOT_FOUND
    )
  }
  const user = await db.query.users.findFirst({
    where: eq(users.id, verification.value),
  })

  if (!user) {
    return c.json({ error: 'User not found' }, HttpStatusCodes.NOT_FOUND)
  }
  const hashedPassword = await hashPassword(password)
  await db
    .update(accounts)
    .set({ password: hashedPassword })
    .where(eq(accounts.userId, user.id))
  return c.json({ success: true }, HttpStatusCodes.OK)
}
