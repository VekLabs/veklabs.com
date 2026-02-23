import { motion } from 'motion/react'
import { useHeaderContext } from '../context/headerContext'

type HeaderLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
}

const removeTrailingSlash = (str: string) =>
  str.endsWith('/') ? str.slice(0, -1) : str

/**
 * Must be used within a Header / HeaderProvider
 */
export default function HeaderLink({
  href,
  className,
  ...props
}: HeaderLinkProps) {
  const baseURL = 'https://veklabs.com'
  const { currentPath } = useHeaderContext()
  const currentUrl = URL.canParse(currentPath, baseURL)
    ? new URL(currentPath, baseURL)
    : new URL(baseURL)
  const headerUrl = new URL(href, baseURL)

  const isActive =
    removeTrailingSlash(headerUrl.pathname) &&
    removeTrailingSlash(currentUrl.pathname).includes(
      removeTrailingSlash(headerUrl.pathname),
    )

  return (
    <motion.a
      variants={{
        show: { opacity: 1, y: 0, filter: 'blur(0px)' },
        hide: { opacity: 0, y: -40, filter: 'blur(10px)' },
      }}
      href={href}
      className={`rounded-lg px-3 py-2 text-xl font-medium uppercase no-underline md:text-sm ${className} ${
        isActive
          ? 'bg-white text-black hover:text-black'
          : 'text-white hover:bg-white/15 hover:text-white'
      }`}
      {...props}
    >
      {props.children}
    </motion.a>
  )
}
