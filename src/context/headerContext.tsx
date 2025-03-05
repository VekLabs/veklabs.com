import { createContext, useContext } from "react"

export const HeaderContext = createContext<{ currentPath: string } | null>(null)
export function HeaderProvider({
  currentPath,
  children,
}: {
  currentPath: string
  children: React.ReactNode
}) {
  return (
    <HeaderContext.Provider value={{ currentPath }}>
      {children}
    </HeaderContext.Provider>
  )
}

export function useHeaderContext() {
  const context = useContext(HeaderContext)
  if (!context) {
    throw new Error("useHeaderContext must be used within a HeaderProvider")
  }
  return context
}
