import Welcome from '@remio/design-system/components/payments/welcome'
import React from 'react'

export default async function page({
  searchParams,
}: {
  searchParams: { plan: string }
}) {
  const { plan } = await searchParams

  return <Welcome plan={plan} />
}
