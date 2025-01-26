import { auth } from '@remio/auth'
import { User } from '@remio/database/schema/users'
import getUserImage from '@remio/design-system/lib/misc/get-user-image'
import { headers } from 'next/headers'

export default async function useAuth(): Promise<User | null> {
  const headerData = await headers()
  console.log(headerData)
  const session = await auth.api.getSession({
    headers: headerData,
  })
  if (!session) return null
  session.user.image = await getUserImage(session.user as User)
  return session.user as User
}
