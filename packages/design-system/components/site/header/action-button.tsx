'use client'

import { authClient } from '@remio/design-system/lib/authClient'
import { Button } from '@remio/design-system/components/ui/button'
import { useRouter } from 'next/navigation'
type GetStartedButtonProps = {
  className?: string
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function ActionButton({
  className,
  size = 'default',
}: GetStartedButtonProps) {
  const session = authClient.useSession()
  const user = session.data?.user
  const router = useRouter()
  return (
    <Button
      size={size}
      className={className}
      variant="gooeyLeft"
      onClick={() => router.push(user ? '/dashboard' : '/signup')}
    >
      {user ? 'Dashboard' : 'Get Started'}
    </Button>
  )
}
