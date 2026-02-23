import type { Media } from '@/payload-types'
import { Image as UnpicImage, type ImageProps } from '@unpic/react/base'
import {
  transform,
  type CloudflareOperations,
  type CloudflareOptions,
} from 'unpic/providers/cloudflare'

export function getImageUrl(
  props: { media: Partial<Media> } & Omit<
    ImageProps<CloudflareOperations, CloudflareOptions>,
    'src' | 'transformer'
  >,
) {
  const { media, operations, options, ...rest } = props

  return transform(
    `https://veklabs.com${media.url}`,
    { fit: 'contain', ...operations },
    { ...options, domain: 'veklabs.com' },
  )
}

export default function Image(
  props: { media: Partial<Media> } & Omit<
    ImageProps<CloudflareOperations, CloudflareOptions>,
    'src' | 'transformer'
  >,
) {
  const { media, ...rest } = props

  return (
    <UnpicImage
      alt={media.alt}
      {...(rest as any)}
      src={`https://veklabs.com${media.url}`}
      transformer={(src, operations, options) =>
        transform(
          src,
          { fit: 'contain', ...operations },
          { ...options, domain: 'veklabs.com' },
        )
      }
    />
  )
}
