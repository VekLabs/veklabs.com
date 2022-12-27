import type { SanityImageSource } from "@sanity/asset-utils";
import urlBuilder from "@sanity/image-url";

import { projectDetails } from "~/sanity/projectDetails";

type RecordCoverProps = {
  title?: string | null;
  image?: SanityImageSource;
};

export default function RecordCover(props: RecordCoverProps) {
  const { title, image } = props;

  return (
    <div className="aspect-video overflow-hidden rounded-md bg-gray-50">
      {image ? (
        <img
          className="h-auto w-full object-cover shadow-black transition-all duration-300"
          src={urlBuilder(projectDetails())
            .image(image.asset._ref)
            .height(600)
            .width(800)
            .fit("max")
            .auto("format")
            .url()}
          alt={String(title) ?? ``}
          loading="lazy"
        />
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-gray-100 text-gray-500">
          {title}
        </div>
      )}
    </div>
  );
}
