import ResetPasswordForm from '@/components/auth/reset-password/reset-password-form'
import SiteLayout from '@/components/site/site-layout'
import React from 'react'

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token: string }
}) {
  //need await
  const { token } = await searchParams
  return (
    <SiteLayout>
      <ResetPasswordForm token={token} />
    </SiteLayout>
  )
}