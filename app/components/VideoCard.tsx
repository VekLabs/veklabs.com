import urlBuilder from '@sanity/image-url'
import { projectDetails } from '~/sanity/projectDetails'
import { VideoDocument } from '~/types/video'


type VideoCardProps = Partial<VideoDocument> & {
  /**
   * If true, the component will render a link to the video's page
   */
  withHref?: boolean
}
export function VideoCard({
  image,
  title,
  slug,
  withHref = false,
}: VideoCardProps) {
  const ContainerComponent = withHref ? 'a' : 'div'

  return (
    <ContainerComponent
      className="aspect-video overflow-hidden rounded-xl border border-gray-4 bg-gray-2 shadow-lg transition-shadow hover:shadow-xl"
      href={withHref ? `/projects/${slug}` : undefined}
    >
      {image ? (
        <img
          className="h-auto w-full object-cover shadow-black transition-all duration-300"
          src={urlBuilder(projectDetails())
            .image(image.asset._ref)
            .height(600)
            .width(800)
            .fit('max')
            .auto('format')
            .url()}
          alt={String(title) ?? ``}
          loading="lazy"
        />
      ) : (
        <div className="flex aspect-video w-full items-center justify-center" />
      )}
    </ContainerComponent>
  )
}
