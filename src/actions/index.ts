import { getPayload } from '@/payload'
import { defineAction } from 'astro:actions'
import { TURNSTILE_SECRET_KEY } from 'astro:env/server'

export const server = {
  handleSubmit: defineAction({
    accept: 'form',
    async handler(formData, context) {
      const payload = await getPayload()

      const headers = context.request.headers
      const headerList = new Headers(headers)
      const ip =
        headerList.get('cf-connecting-ip') ||
        headerList.get('x-forwarded-for') ||
        '0.0.0.0'

      if (formData.get('bot-field')) {
        return 'Bot submission detected'
      }

      try {
        const response = await fetch(
          'https://challenges.cloudflare.com/turnstile/v0/siteverify',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              secret: TURNSTILE_SECRET_KEY,
              response: formData.get('cf-turnstile-response'),
              remoteip: ip,
            }),
          },
        )

        const result = (await response.json()) as {
          success: boolean
          'error-codes'?: string[]
        }

        if (!result.success) {
          return 'Turnstile verification failed'
        }
      } catch (error) {
        return 'Error validating Turnstile response'
      }

      await payload.create({
        collection: 'form-submissions',
        data: {
          name: formData.get('name').toString(),
          email: formData.get('email').toString(),
          'phone-number': formData.get('phone').toString(),
          message: formData.get('message').toString(),
          services: formData
            .getAll('services')
            .map((service) => service.toString()),
        },
      })

      return 'Thank you for your submission! We will be in touch soon.'
    },
  }),
}
