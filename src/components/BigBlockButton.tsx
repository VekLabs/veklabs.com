import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";
import { MotionConfig, motion } from "motion/react";
import { twMerge } from "tailwind-merge";

export function BigBlockButton({
  label,

  className,
}: {
  label: ReactNode;

  className?: string;
}) {
  return (
    <motion.div
      className={twMerge(
        "w-full overflow-clip border border-gray-800",
        className,
      )}
      whileHover="hovered"
    >
      <MotionConfig
        transition={{
          type: "spring",
          bounce: 0.3,
          bounceDamping: 20,
          visualDuration: 0.3,
        }}
      >
        <motion.a
          className="relative flex h-full w-full cursor-pointer items-center py-10 text-2xl font-medium"
          href="/portfolio"
        >
          <motion.div
            className="absolute inset-0 flex size-full items-center px-10"
            variants={{
              hovered: { translateY: "-100%" },
            }}
            initial={{ translateY: "0%" }}
          >
            <motion.span
              className="origin-bottom-left"
              initial={{ rotateZ: 0, translateY: "0%" }}
              variants={{
                hovered: { rotateZ: -10, translateY: "-100%" },
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.1,
              }}
            >
              {label}
            </motion.span>
            <ArrowUpRightIcon className="ml-auto" />
          </motion.div>

          <motion.div
            className="absolute inset-0 flex size-full items-center bg-white px-10 text-black"
            initial={{ translateY: "100%" }}
            variants={{ hovered: { translateY: "0%" } }}
          >
            <motion.span
              className="z-10 origin-bottom-left text-black"
              initial={{ translateY: "100%", rotateZ: 10 }}
              variants={{ hovered: { translateY: "0%", rotateZ: 0 } }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.1,
              }}
            >
              {label}
            </motion.span>
            <ArrowUpRightIcon className="ml-auto" />
          </motion.div>
        </motion.a>
      </MotionConfig>
    </motion.div>
  );
}
