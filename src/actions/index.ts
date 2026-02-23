import { getPayload } from '@/payload'
import { defineAction } from 'astro:actions'
import z from 'zod'

export const server = {
  handleSubmit: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string(),
      email: z.string(),
      phone: z.string(),
      message: z.string().optional(),
      botField: z.string().optional(),
      services: z.array(z.string()).optional(),
      turnstileResponse: z.string(),
    }),
    async handler(input, context) {
      const payload = await getPayload()

      const headers = context.request.headers
      const headerList = new Headers(headers)
      const ip =
        headerList.get('cf-connecting-ip') ||
        headerList.get('x-forwarded-for') ||
        '0.0.0.0'

      if (input.botField) {
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
              secret: process.env.TURNSTILE_SECRET_KEY,
              response: input.turnstileResponse,
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
          name: input.name,
          email: input.email,
          'phone-number': input.phone,
          message: input.message,
          services: input.services || [],
        },
      })

      return 'Thank you for your submission! We will be in touch soon.'
    },
  }),
}
