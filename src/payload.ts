import { PayloadSDK } from '@payloadcms/sdk'
import type { Config } from '../../veklabs-5/src/payload-types'
import { env } from 'cloudflare:workers'

let payloadSingleton: PayloadSDK<Config> | null = null
let _token: string | null = null
export async function getPayload() {
  if (!payloadSingleton) {
    const _payload = new PayloadSDK<Config>({
      baseURL: env.PAYLOAD_URL || 'http://localhost:3000',
    })

    if (!env.PAYLOAD_USERNAME || !env.PAYLOAD_PASSWORD) {
      throw new Error(
        'PAYLOAD_USERNAME and PAYLOAD_PASSWORD must be set in .dev.vars',
      )
    }

    const token = await _payload.login({
      collection: 'users',
      data: {
        email: env.PAYLOAD_USERNAME,
        password: env.PAYLOAD_PASSWORD,
      },
    })

    if (!token?.token) {
      throw new Error('Failed to authenticate with Payload')
    }

    _token = token.token
    _payload.baseInit = { headers: { Authorization: `JWT ${_token}` } }

    payloadSingleton = _payload
  }

  return payloadSingleton
}
