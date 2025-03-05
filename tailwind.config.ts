import type { Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"
import scrollDrivenAnimations from "@adam.plesnik/tailwindcss-scroll-driven-animations"
import spring from "tailwindcss-spring"

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,vue}"],
  theme: {
    colors: ({ colors }) => ({
      ...colors,
      gray: colors.neutral,
    }),
    extend: {
      colors: ({ colors }) => ({
        background: colors.neutral[950],
        foreground: colors.neutral[100],
        accent: colors.blue,
      }),
      width: {
        container: "calc(100vw - clamp(2rem, 3vw, 3rem))",
      },
      borderWidth: {
        0.5: "0.5px",
      },
      fontSize: {
        xxs: "0.6rem",
      },
      textShadow: {
        sm: "0 1px 2px var(--tw-shadow-color)",
        DEFAULT: "0 0px 4px var(--tw-shadow-color)",
        lg: "0 0px 16px var(--tw-shadow-color)",
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
        parallax: "parallax",
        first: "moveVertical 30s ease infinite",
        second: "moveInCircle 20s reverse infinite",
        third: "moveInCircle 40s linear infinite",
        fourth: "moveHorizontal 40s ease infinite",
        fifth: "moveInCircle 20s ease infinite",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(1rem)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        parallax: {
          "0%": { transform: "translateY(var(--parallax-start, 0))" },
          "100%": { transform: "translateY(var(--parallax-end, 50%))" },
        },
        moveHorizontal: {
          "0%": {
            transform: "translateX(-50%) translateY(-10%)",
          },
          "50%": {
            transform: "translateX(50%) translateY(10%)",
          },
          "100%": {
            transform: "translateX(-50%) translateY(-10%)",
          },
        },
        moveInCircle: {
          "0%": {
            transform: "rotate(0deg)",
          },
          "50%": {
            transform: "rotate(180deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
        moveVertical: {
          "0%": {
            transform: "translateY(-50%)",
          },
          "50%": {
            transform: "translateY(50%)",
          },
          "100%": {
            transform: "translateY(-50%)",
          },
        },
      },
    },
  },
  plugins: [
    spring,
    scrollDrivenAnimations,
    plugin(({ addVariant }) => {
      addVariant("starting", "@starting-style")
    }),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          "text-shadow": (value) => ({
            textShadow: value,
          }),
        },
        { values: theme("textShadow") },
      )
      matchUtilities(
        {
          "parallax-start": (value) => ({
            "--parallax-start": value,
          }),
        },
        { values: theme("translate"), supportsNegativeValues: true },
      )
      matchUtilities(
        {
          "parallax-end": (value) => ({
            "--parallax-end": value,
          }),
        },
        { values: theme("translate"), supportsNegativeValues: true },
      )
    }),
    plugin(({ addUtilities, addVariant }) => {
      addVariant("pointer-coarse", "@media (pointer: coarse)")
      addVariant("pointer-fine", "@media (pointer: fine)")
      addUtilities({
        ".timeline-root": { "animation-timeline": "scroll(root);" },
        ".parallax": { "animation-name": "parallax;" },
        ".allow-discrete": { "transition-behavior": "allow-discrete;" },
        ".no-scrollbar": {
          "&::-webkit-scrollbar": { display: "none" },
          "scrollbar-width": "none",
          "-ms-overflow-style": "none",
        },
      })
    }),
  ],
} satisfies Config
