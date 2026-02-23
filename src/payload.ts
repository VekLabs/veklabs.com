import { PayloadSDK } from '@payloadcms/sdk'
import type { Config } from '../../veklabs-5/src/payload-types'
import { PAYLOAD_URL, PAYLOAD_USERNAME, getSecret } from 'astro:env/server'

let payloadSingleton: PayloadSDK<Config> | null = null
let _token: string | null = null
export async function getPayload() {
  if (!payloadSingleton) {
    const _payload = new PayloadSDK<Config>({
      baseURL: PAYLOAD_URL || 'http://localhost:3000',
    })

    const PAYLOAD_PASSWORD = getSecret('PAYLOAD_PASSWORD')

    if (!PAYLOAD_USERNAME || !PAYLOAD_PASSWORD) {
      throw new Error(
        'PAYLOAD_USERNAME and PAYLOAD_PASSWORD must be set in .dev.vars',
      )
    }

    const token = await _payload.login({
      collection: 'users',
      data: {
        email: PAYLOAD_USERNAME,
        password: PAYLOAD_PASSWORD,
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
