import { Amplify } from 'aws-amplify'

const userPoolId: string = import.meta.env.VITE_COGNITO_USER_POOL_ID ?? ''
const userPoolClientId: string = import.meta.env.VITE_COGNITO_CLIENT_ID ?? ''
// Amplify quiere solo el host, sin "https://"
const cognitoDomain: string = (import.meta.env.VITE_COGNITO_DOMAIN ?? '')
  .replace(/^https?:\/\//, '')
  .replace(/\/$/, '')
const redirectUrl: string = import.meta.env.VITE_REDIRECT_URL || `${window.location.origin}/`

export const COGNITO_CONFIGURED = Boolean(userPoolId && userPoolClientId && cognitoDomain)

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId,
      userPoolClientId,
      loginWith: {
        oauth: {
          domain: cognitoDomain,
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: [redirectUrl],
          redirectSignOut: [redirectUrl],
          // "code" = Authorization Code + PKCE (el flujo recomendado para SPAs)
          responseType: 'code',
        },
      },
    },
  },
})
