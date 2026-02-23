import { FloatingPortal } from '@floating-ui/react'
import { AnimatePresence, easeInOut, motion } from 'motion/react'
import { useState } from 'react'
import { HeaderProvider } from '../context/headerContext'
import logoFullSVG from '../images/logo-full.svg?url'
import HeaderLink from './HeaderLink'
import { ListIcon } from '@phosphor-icons/react/ssr'

export interface HeaderProps {
  currentPath: string
}

const menu = {
  main: [
    {
      identifier: 'features',
      name: 'Features',
      url: '/features/',
    },
    {
      identifier: 'portfolio',
      name: 'Portfolio',
      url: '/portfolio/',
    },
    {
      identifier: 'services',
      name: 'Services',
      url: '/services/',
    },
    {
      identifier: 'clients',
      name: 'Clients',
      url: '/clients/',
    },
    {
      identifier: 'reports',
      name: 'Reports',
      url: '/reports',
    },
  ],
} as const

const title = 'Vek Labs'

export default function Header({ currentPath }: HeaderProps) {
  return (
    <HeaderProvider currentPath={currentPath}>
      <header
        className="border-b-0.5 bg-background/65 sticky top-0 z-40 border-white/10 py-3 backdrop-blur-xl backdrop-saturate-150 md:py-4"
        role="banner"
      >
        <div className="w-container mx-auto">
          <div className="relative hidden h-8 items-center justify-between md:flex">
            <a href="/">
              <img
                className="w-full max-w-24 justify-self-start md:max-w-28"
                src={logoFullSVG}
                alt={title}
              />
            </a>
            <div className="absolute left-1/2 flex -translate-x-1/2 flex-nowrap gap-4 overflow-auto">
              {menu.main.map((menuItem) => (
                <HeaderLink key={menuItem.url} href={menuItem.url}>
                  {menuItem.name}
                </HeaderLink>
              ))}
            </div>
            <HeaderLink href="/contact">Contact</HeaderLink>
          </div>

          <MobileHeader currentPath={currentPath} />
        </div>
      </header>
    </HeaderProvider>
  )
}

function MobileHeader({ currentPath }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex items-center justify-between md:hidden">
      <a href={'/'}>
        <img
          className="w-full max-w-24 justify-self-start"
          src={logoFullSVG}
          alt={title}
        />
      </a>
      <FloatingPortal>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial="hide"
              animate="show"
              exit="hide"
              variants={{
                show: { opacity: 1, backdropFilter: 'blur(16px)' },
                hide: { opacity: 0, backdropFilter: 'blur(0px)' },
              }}
              transition={{
                duration: 0.2,
                staggerChildren: 0.05,
                type: 'tween',
                ease: easeInOut,
              }}
              className="bg-background/90 fixed top-0 left-0 z-10 flex h-screen w-screen flex-col items-center justify-center gap-8 p-4 pb-14 backdrop-blur-lg"
            >
              {currentPath !== '/' && <HeaderLink href="/">Home</HeaderLink>}
              {menu.main.map((menuItem) => (
                <HeaderLink key={menuItem.url} href={menuItem.url}>
                  {menuItem.name}
                </HeaderLink>
              ))}
              <HeaderLink href="/contact">Contact</HeaderLink>
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>

      <button onClick={() => setMenuOpen(!menuOpen)}>
        <ListIcon size="24" />
      </button>
    </div>
  )
}
