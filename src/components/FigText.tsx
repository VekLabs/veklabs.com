import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export function FigText(props: ComponentProps<"span">) {
  return (
    <span
      role="none"
      {...props}
      className={twMerge(
        "text-xs tracking-widest text-white/20",
        props.className,
      )}
    />
  );
}
