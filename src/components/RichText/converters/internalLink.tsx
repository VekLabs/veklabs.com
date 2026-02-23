import { type SerializedLinkNode } from '@payloadcms/richtext-lexical'

export const internalDocToHref = ({
  linkNode,
}: {
  linkNode: SerializedLinkNode
}) => {
  const { value, relationTo } = linkNode.fields.doc!

  const slug =
    typeof value === 'object' &&
    value &&
    'slug' in value &&
    typeof value.slug === 'string'
      ? value.slug
      : ''

  if (relationTo === 'reports') {
    return `/reports/${slug}`
  } else if (relationTo === 'users') {
    return `/users/${slug}`
  } else {
    return `/${slug}`
  }
}
