import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © 2025           <span>Swift <sub className="text-[9px]">AkumaDev</sub></span>
        </p>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="font-medium underline underline-offset-4">
            Strona główna
          </Link>
          <Link href="/stats" className="font-medium underline underline-offset-4">
            Statystyki
          </Link>
        </div>
      </div>
    </footer>
  )
}

