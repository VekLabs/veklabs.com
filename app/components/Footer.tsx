import Logo from '~/components/Logo'

export default function Footer() {
  return (
    <header className="border-t border-gray-100 dark:border-gray-900">
      <div className="container mx-auto flex items-center justify-between p-4 lg:px-12">
        <Logo />
        <div className="flex flex-1 flex-col items-end justify-end gap-2 text-sm md:flex-row md:items-center md:gap-5">
          <a href="/studio">&copy; {new Date().getFullYear()} Veklabs</a>
        </div>
      </div>
    </header>
  )
}
