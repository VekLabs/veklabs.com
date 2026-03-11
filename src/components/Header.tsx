import { FloatingPortal } from "@floating-ui/react";
import { AnimatePresence, easeInOut, motion } from "motion/react";
import { useState } from "react";
import { HeaderProvider } from "../context/headerContext";
import logoFullSVG from "../images/logo-full.svg?url";
import HeaderLink from "./HeaderLink";
import { ListIcon } from "@phosphor-icons/react/ssr";
import { cn } from "@/utils/cn";

export interface HeaderProps {
  currentPath: string;
  appearance?: "sticky" | "fixed";
}

const menu = {
  main: [
    {
      identifier: "features",
      name: "Features",
      url: "/features/",
    },
    {
      identifier: "portfolio",
      name: "Portfolio",
      url: "/portfolio/",
    },
    {
      identifier: "services",
      name: "Services",
      url: "/services/",
    },
    {
      identifier: "clients",
      name: "Clients",
      url: "/clients/",
    },
    {
      identifier: "reports",
      name: "Reports",
      url: "/reports",
    },
    {
      identifier: "contact",
      name: "Contact",
      url: "/contact",
    },
  ],
} as const;

const title = "Vek Labs";

export default function Header({
  currentPath,
  appearance = "sticky",
}: HeaderProps) {
  const firstHalfOfMenu = menu.main.slice(0, Math.ceil(menu.main.length / 2));
  const secondHalfOfMenu = menu.main.slice(Math.ceil(menu.main.length / 2));

  return (
    <HeaderProvider currentPath={currentPath}>
      <header
        className={cn([
          "top-0 z-999 py-3 md:py-4",
          {
            "bg-background border-b-0.5 sticky border-white/10":
              appearance === "sticky",
            "animate-fixed-scrolled-appearance range/0px_100px timeline spring-duration-500 spring-bounce-40 fixed top-0 left-0 w-full data-[hide=true]:-translate-y-full":
              appearance === "fixed",
          },
        ])}
        role="banner"
      >
        <div className="w-container mx-auto">
          <div
            className="relative hidden h-8 items-center justify-between md:grid"
            style={{ gridTemplateColumns: "1fr auto 1fr" }}
          >
            <div className="flex flex-nowrap gap-4 overflow-auto">
              {firstHalfOfMenu.map((menuItem) => (
                <HeaderLink key={menuItem.url} href={menuItem.url}>
                  {menuItem.name}
                </HeaderLink>
              ))}
            </div>

            <a href="/">
              <img
                className="w-full max-w-24 justify-self-center md:max-w-28"
                src={logoFullSVG}
                alt={title}
              />
            </a>

            <div className="ml-auto flex flex-nowrap gap-4 overflow-auto">
              {secondHalfOfMenu.map((menuItem) => (
                <HeaderLink key={menuItem.url} href={menuItem.url}>
                  {menuItem.name}
                </HeaderLink>
              ))}
            </div>
          </div>

          <MobileHeader currentPath={currentPath} />
        </div>
      </header>
    </HeaderProvider>
  );
}

function MobileHeader({ currentPath, appearance = "sticky" }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex items-center justify-between md:hidden">
      <a href={"/"}>
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
                show: { opacity: 1, backdropFilter: "blur(16px)" },
                hide: { opacity: 0, backdropFilter: "blur(0px)" },
              }}
              transition={{
                duration: 0.2,
                staggerChildren: 0.05,
                type: "tween",
                ease: easeInOut,
              }}
              className="bg-background/90 fixed top-0 left-0 z-50 flex h-screen w-screen flex-col items-center justify-center gap-8 p-4 pb-14 backdrop-blur-lg"
            >
              {currentPath !== "/" && <HeaderLink href="/">Home</HeaderLink>}
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
  );
}
