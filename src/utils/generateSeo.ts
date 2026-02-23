import logo from '@/images/logos/vl-logo-white.jpg'
import tempHero from '@/images/tempHero.jpg'
import type { HomePage } from '@/payload-types'
import type { Metadata } from 'next'
import type { Populated } from './typeChecks'

export async function getMetadataFor({
  meta = {},
  pageTitle,
  path,
  ...rest
}: {
  meta?: Partial<Populated<HomePage>['meta']>
  pageTitle?: string
  path?: string
} & Metadata): Promise<Metadata> {
  let title = `Vek Labs - Video Production Company`
  if (pageTitle) {
    title = `${pageTitle} | ${title}`
  }
  if (meta.title) {
    title = meta.title
  }

  const description =
    meta.description ||
    "We're a Calgary video production company working with people on productions that inspire us. Meet Calgary's pro content team."
  const keywords = meta.keywords || [
    'video production',
    'calgary video production',
    'content creation',
    'videography',
    'filmmaking',
    'video editing',
  ]

  return {
    metadataBase: new URL('https://veklabs.com'),
    ...(path && { alternates: { canonical: `https://veklabs.com${path}` } }),
    title,
    description,
    icons: logo.src,
    keywords,
    referrer: 'no-referrer',
    robots: {
      index: true,
      follow: true,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [meta.image?.url || tempHero.src].filter(Boolean) as string[],
      site: '@veklabs',
      creator: '@veklabs',
    },
    openGraph: {
      images: [meta.image?.url || tempHero?.src].filter(Boolean) as string[],
      type: 'website',
      description,
      locale: 'en_CA',
      title,
      countryName: 'Canada',
      siteName: 'Vek Labs',
      url: 'https://veklabs.com',
      videos: [
        'https://player.vimeo.com/progressive_redirect/playback/686488451/rendition/1080p?loc=external&signature=251f8452368ca0ca7ba6b373f9fc7d2a22f65d0d56968214545cd30a07f7af5f',
      ],
    },
    ...rest,
  }
}
