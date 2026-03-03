import type { Service } from "@/payload-types";
import { cn } from "@/utils/cn";
import type { Populated } from "@/utils/typeChecks";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { capitalize } from "lodash-es";
import { motion, MotionConfig } from "motion/react";
import { useState } from "react";
import Image from "./Image";

export function FeaturedServicesList({
  services,
}: {
  services: Populated<Service>[];
}) {
  const [activeService, setActiveService] = useState(services?.[0]);
  const [contactUsHovered, setContactUsHovered] = useState(false);

  return (
    <div className="mx-auto flex size-full min-h-[30vh] max-w-400 flex-col lg:min-h-[80vh] lg:flex-row">
      <div className="grow flex-col gap-6 border-gray-800 px-5 py-16 lg:w-1/5 lg:border-x 2xl:-ml-5 2xl:w-1/6 2xl:pl-5">
        <div className="text-3xl font-semibold text-balance lg:text-2xl lg:font-normal">
          <span>We've got you covered</span>
          <span className="text-gray-400"> from start to finish</span>
        </div>

        <div className="hidden size-full lg:flex lg:flex-col">
          {services?.map((service) => (
            <motion.a
              key={service.id}
              href={`/services/${service.slug}`}
              className="relative flex w-full cursor-pointer flex-col py-3 lg:py-6"
              onHoverStart={() => setActiveService(service)}
            >
              <span
                className={cn([
                  "text-sm font-semibold whitespace-nowrap text-gray-500 capitalize transition md:text-lg lg:text-4xl",
                  {
                    "text-white": activeService?.id === service.id,
                  },
                ])}
              >
                {capitalize(service.title)}
              </span>

              {activeService?.id === service.id && (
                <motion.span
                  layout="position"
                  layoutId="bg-stripe"
                  className="bg-stripes-diagonal absolute inset-0 -ml-5 size-full lg:w-[calc(100%+40px)]"
                />
              )}
            </motion.a>
          ))}

          <motion.div
            className="-mx-5 mt-auto overflow-clip border-y border-gray-800"
            onHoverStart={() => setContactUsHovered(true)}
            onHoverEnd={() => setContactUsHovered(false)}
          >
            <MotionConfig
              transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
            >
              <motion.a
                className="relative flex w-full cursor-pointer items-center py-10 text-2xl font-medium"
                href="/contact"
              >
                <motion.div
                  className="absolute inset-0 flex size-full items-center px-4"
                  animate={{
                    translateY: contactUsHovered ? "-100%" : "0%",
                  }}
                >
                  <motion.span
                    className="origin-bottom-left"
                    initial={{ rotateZ: contactUsHovered ? -10 : 0 }}
                    animate={{
                      translateY: contactUsHovered ? "-100%" : "0%",
                      rotateZ: 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: 0.1,
                    }}
                  >
                    Contact Us
                  </motion.span>
                  <ArrowUpRightIcon className="ml-auto" />
                </motion.div>

                <motion.div
                  className="absolute inset-0 flex size-full items-center bg-white px-4 text-black"
                  animate={{ translateY: contactUsHovered ? "0%" : "100%" }}
                >
                  <motion.span
                    className="z-10 text-black"
                    animate={{ translateY: contactUsHovered ? "0%" : "100%" }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: 0.1,
                    }}
                  >
                    Contact Us
                  </motion.span>
                  <ArrowUpRightIcon className="ml-auto" />
                </motion.div>
              </motion.a>
            </MotionConfig>
          </motion.div>
        </div>
      </div>

      <div className="relative hidden size-full min-h-[40vh] basis-7/12 overflow-clip lg:block lg:min-h-[80vh]">
        {services.map((service, i) => (
          <motion.article
            key={service.id}
            className="absolute size-full overflow-clip"
            variants={{
              selected: {
                translateY: "0%",
                zIndex: 20,
              },
              idle: {
                zIndex: 3,
                translateY: `${(services.findIndex((s) => s.id === activeService.id) - i) * 100}%`,
              },
            }}
            animate={activeService.id === service.id ? "selected" : "idle"}
            transition={{
              type: "spring",
              bounce: 0.1,
              bounceDamping: 20,
            }}
          >
            <Image
              media={service.image}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
            <div className="bg-stripes-diagonal absolute right-4 bottom-4 left-4 z-20 max-w-180 border border-gray-900/30 bg-black/40 p-6 px-8 pt-3 text-pretty backdrop-blur-xs [--bg-stripes-color:rgba(0,0,0,0.2)]">
              <span className="inset-4 z-20 text-xs tracking-widest text-white/50">
                FIG. 3.{i + 1}
              </span>
              <p className="text-lg font-medium">{service.summary}</p>
            </div>
          </motion.article>
        ))}
      </div>

      {/* MARK: MOBILE */}
      <div className="block lg:hidden">
        <div
          className="no-scrollbar grid h-[60vh] snap-x snap-mandatory scroll-px-5 grid-cols-[var(--gap)_1fr_var(--gap)] gap-(--gap) overflow-x-scroll overscroll-x-none [--gap:8px] before:content-end after:content-end lg:[--gap:20px]"
          style={{
            scrollTimeline: "--featured-services inline",
            gridTemplateColumns: `var(--gap) repeat(${services.length}, min(90vw,500px)) var(--gap)`,
          }}
        >
          {services?.map((service, i) => (
            <a
              key={service.id}
              href={`/services/${service.slug}`}
              className="featured-service-container relative w-full snap-start"
            >
              <span
                className={cn([
                  "spring-bounce-10 spring-duration-500 absolute top-4 left-4 z-10 text-3xl font-semibold whitespace-nowrap text-gray-500 capitalize transition md:text-5xl",
                ])}
              >
                {capitalize(service.title)}
              </span>

              <Image
                media={service.image}
                alt=""
                className="absolute inset-0 size-full object-cover"
              />
              <div className="bg-stripes-diagonal absolute right-1 bottom-1 left-1 z-20 max-w-180 border border-gray-900/30 bg-black/40 p-3 px-4 pt-3 text-pretty backdrop-blur-xs [--bg-stripes-color:rgba(0,0,0,0.2)] md:right-4 md:bottom-4 md:left-4 md:p-6 md:px-8">
                <span className="inset-4 z-20 text-xs tracking-widest text-white/50">
                  FIG. 3.{i + 1}
                </span>
                <p className="font-medium md:text-lg">{service.summary}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
