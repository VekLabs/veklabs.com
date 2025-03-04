import NumberFlow from "@number-flow/react"
import config from "../content/home.json"
import { useEffect, useRef, useState } from "react"
import { useInView, motion } from "motion/react"

const {
  PROJECTS_FILMED,
  VIDEOS_RENDERED,
  FOOTAGE_PROCESSED_TB,
  TOTAL_VIEWS,
  stats_disclaimer,
} = config

const METRICS = {
  "Projects Filmed": {
    stat: PROJECTS_FILMED,
    unit: null,
  },
  "Videos Rendered": {
    stat: VIDEOS_RENDERED,
    unit: null,
  },
  "Footage Processed": {
    stat: FOOTAGE_PROCESSED_TB,
    unit: "TB",
  },
  "Content Views": {
    stat: TOTAL_VIEWS,
    unit: "M+",
  },
} as const

function Stat({
  stat,
  unit,
  i,
}: {
  stat: number
  i: number
  unit: string | null
}) {
  const [_stat, setStat] = useState(0)
  const ref = useRef(null)

  const isInView = useInView(ref, { once: true, amount: "all" })

  useEffect(() => {
    if (isInView) {
      setTimeout(() => {
        setStat(stat)
      }, i * 150)
    } else {
      setStat(0)
    }
  }, [isInView])

  return (
    <NumberFlow
      ref={ref}
      value={_stat}
      suffix={unit ?? undefined}
      continuous
      className="[&::part(suffix)]:text-neutral-500"
      trend="increasing"
      spinTiming={{
        duration: 1250,
        easing:
          "linear(0,0.008,0.028,0.06,0.099,0.145,0.196,0.249,0.304,0.36,0.416,0.47,0.523,0.573,0.621,0.667,0.709,0.748,0.784,0.817,0.847,0.874,0.898,0.92,0.939,0.955,0.97,0.982,0.992,1.001,1.008,1.014,1.019,1.022,1.025,1.027,1.028,1.028,1.028,1.028,1.027,1.026,1.025,1.024,1.022,1.02,1.019,1.017,1.016,1.014,1.013,1.011,1.01,1.009,1.008,1.007,1.006,1.005,1.004,1.003,1.003,1.002,1.001,1.001,1.001,1,1,1,1,1,0.999,0.999,0.999,0.999,1)",
      }}
    />
  )
}

export default function Metrics() {
  return (
    <section className="relative bg-black px-6 py-24 lg:py-40">
      <div className="container mx-auto max-w-[1200px]">
        <h3 className="mb-6 text-3xl font-semibold md:mb-12 md:text-5xl">
          {config.metrics_title}
        </h3>

        <ul className="grid max-w-[1000px] grid-cols-2 items-start justify-start gap-10 md:grid-cols-[repeat(auto-fit,minmax(160px,1fr))]">
          {Object.entries(METRICS).map(([key, { stat, unit }], i) => (
            <li
              key={key}
              className="flex flex-col items-start justify-start tabular-nums"
            >
              <span className="font-mono text-4xl font-semibold md:text-6xl">
                <Stat stat={stat} unit={unit} i={i} />
              </span>
              <motion.span
                initial={{ opacity: 0, width: 0, x: -10 }}
                whileInView={{ opacity: 1, width: "100%", x: 0 }}
                transition={{ type: "spring", duration: 1, delay: i * 0.15 }}
                className="text-accent-500 mt-2 overflow-clip whitespace-nowrap md:mt-4 md:text-xl"
              >
                {" "}
                {key}
              </motion.span>
            </li>
          ))}
        </ul>

        <span className="text-xxs absolute right-6 bottom-6 ml-6 text-neutral-400 md:text-xs">
          {stats_disclaimer}
        </span>
      </div>
    </section>
  )
}
