import classNames, { type Value } from "classnames"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: Value[]) {
  return twMerge(classNames(inputs))
}
