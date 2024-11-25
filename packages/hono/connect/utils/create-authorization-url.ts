import type { ProviderOptions } from '@dubble/hono/connect/types'
import { generateCodeChallenge } from '@dubble/hono/connect/utils/generate-code-challenge'

export async function createAuthorizationURL({
  id,
  options,
  authorizationEndpoint,
  state,
  codeVerifier,
  scopes,
  claims,
  redirectURI,
}: {
  id: string
  options: ProviderOptions
  redirectURI: string
  authorizationEndpoint: string
  state: string
  codeVerifier?: string
  scopes: string[]
  claims?: string[]
}) {
  const url = new URL(authorizationEndpoint)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('client_id', options.clientId)
  url.searchParams.set('state', state)
  url.searchParams.set('scope', scopes.join(' '))
  url.searchParams.set('redirect_uri', options.redirectURI || redirectURI)

  if (codeVerifier) {
    const codeChallenge = await generateCodeChallenge(codeVerifier)
    url.searchParams.set('code_challenge_method', 'S256')
    url.searchParams.set('code_challenge', codeChallenge)
  }
  if (claims) {
    const claimsObj = claims.reduce((acc, claim) => {
      acc[claim] = null
      return acc
    }, {} as Record<string, null>)
    url.searchParams.set(
      'claims',
      JSON.stringify({
        id_token: { email: null, email_verified: null, ...claimsObj },
      })
    )
  }
  return url
}