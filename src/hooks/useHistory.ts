import { createBrowserHistory } from "history"

const history =
  typeof window === "undefined"
    ? ({} as ReturnType<typeof createBrowserHistory>)
    : createBrowserHistory()

export function useHistory() {
  return history
}
