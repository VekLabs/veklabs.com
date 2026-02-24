import type { ClientLogo, HomePage } from "@/payload-types";
import type { Populated } from "@/utils/typeChecks";
import { CaretRightIcon } from "@phosphor-icons/react/ssr";
import { chunk } from "lodash-es";
import { AnimatePresence, motion, steps } from "motion/react";
import { useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";
import Image, { getImageUrl } from "./Image";

const MotionImage = motion.create(Image);

export function ClientsSection({
  logos,
  home,
}: {
  logos: ClientLogo[];
  home: Populated<HomePage>;
}) {
  const chunkSize = 6;
  const easing = steps(chunkSize);

  const logoChunks = chunk(logos, chunkSize).map((chunk, i, chunks) => {
    if (chunk.length < chunkSize) {
      const diff = chunkSize - chunk.length;
      const fill = chunks[i - 1].slice(0, diff);
      return chunk.concat(fill);
    }
    return chunk;
  });
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);

  useEffect(() => {
    logoChunks[currentChunkIndex + 1].forEach((logo) => {
      if (document.getElementById(`preload-${logo.id}`)) return;

      const resolvedURL = getImageUrl({
        media: logo,
        alt: "",
        width: 144,
        height: 144,
      });
      const link = document.createElement("link");
      link.id = `preload-${logo.id}`;
      link.rel = "preload";
      link.as = "image";
      link.href = resolvedURL;
      document.head.appendChild(link);
    });
  }, [logos]);

  useInterval(() => {
    setCurrentChunkIndex((prev) => (prev + 1) % logoChunks.length);
  }, 3000);

  return (
    <section className="w-container mx-auto py-8 text-center md:pt-12 md:pb-20">
      <div className="flex flex-col items-center gap-4">
        <h2 className="m-0 text-3xl font-extrabold tracking-widest">
          {home.clients_section.CLIENT_TITLE}
        </h2>
        <div className="flex flex-col items-center gap-8">
          <h3 className="m-0 text-xl font-light">
            {home.clients_section.CLIENT_SUB_TITLE}
          </h3>
          <a
            className="mt-1 flex items-center justify-between gap-1.5 rounded-full bg-white/20 px-5 py-2"
            href="/clients"
            title="All Clients"
          >
            <span>All Clients</span>
            <CaretRightIcon className="-mr-2 size-[1_cap]" />
          </a>
        </div>
      </div>

      <div className="relative container mx-auto py-6 pt-10">
        <motion.div className="relative mx-auto grid h-60 w-full max-w-3xl grid-cols-3 grid-rows-2 place-items-center gap-y-3">
          <AnimatePresence mode="popLayout">
            {logoChunks[currentChunkIndex]?.map((logo, i) => (
              <MotionImage
                priority
                media={logo}
                key={logo.url}
                initial={{ filter: "blur(10px)", opacity: 0, scale: 0.25 }}
                animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
                exit={{ filter: "blur(10px)", opacity: 0, scale: 0.25 }}
                transition={{ delay: easing(i * 0.1) }}
                className="w-16 md:block md:w-36"
                width={144}
                height={144}
                alt=""
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
