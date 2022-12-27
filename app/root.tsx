import type { LinksFunction, LoaderArgs, MetaFunction } from '@remix-run/node'
import cx from 'classnames'
import { json } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from '@remix-run/react'
import groq from 'groq'

import { z } from 'zod'
import { themePreferenceCookie } from '~/cookies'
import { getClient } from '~/sanity/client'
import { homeZ } from '~/types/home'
import { getBodyClassNames } from './lib/getBodyClassNames'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  viewport: 'width=device-width,initial-scale=1',
})

export const links: LinksFunction = () => {
  return [
    { rel: 'icon', href: '/favicon.svg' },
    { rel: 'icon', href: '/logo.png', media: '(prefers-color-scheme: light)' },
    {
      rel: 'icon',
      href: '/logodark.png',
      media: '(prefers-color-scheme: dark)',
    },
    { rel: 'preconnect', href: 'https://cdn.sanity.io' },
  ]
}

export const loader = async ({ request }: LoaderArgs) => {
  // Dark/light mode
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await themePreferenceCookie.parse(cookieHeader)) || {}
  const themePreference = z
    .union([z.literal('dark'), z.literal('light')])
    .optional()
    .parse(cookie.themePreference)

  // Sanity content throughout the site
  const query = groq`*[_id == "home"][0]{
    title,
    siteTitle
  }`
  const home = await getClient()
    .fetch(query)
    .then((res) => (res ? homeZ.parse(res) : null))

  return json({
    home,
    themePreference,
    ENV: {
      SANITY_PUBLIC_PROJECT_ID: process.env.SANITY_PUBLIC_PROJECT_ID,
      SANITY_PUBLIC_DATASET: process.env.SANITY_PUBLIC_DATASET,
      SANITY_PUBLIC_API_VERSION: process.env.SANITY_PUBLIC_API_VERSION,
    },
  })
}

export default function App() {
  const { ENV, themePreference } = useLoaderData<typeof loader>()

  const { pathname } = useLocation()
  const isStudioRoute = pathname.startsWith('/studio')

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        {isStudioRoute && typeof document === 'undefined' ? '__STYLES__' : null}
      </head>
      <body
        className={cx(
          themePreference ?? 'dark',
          'text-hi-contrast',
          'bg-neutral-1'
        )}
      >
        <Outlet />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
