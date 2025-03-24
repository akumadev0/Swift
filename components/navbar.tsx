"use client"

import Link from "next/link"
import { Home, BookOpen, Settings, Moon, Sun, BookOpenCheck, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BookOpen className="h-5 w-5" />
          <span>Swift <sub className="text-[9px]">AkumaDev</sub></span>
        </Link>

        <nav className="ml-auto flex items-center gap-4">
          <Link href="/" className="flex items-center gap-1 text-sm font-medium">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Strona główna</span>
          </Link>

          <Link href="/learn" className="flex items-center gap-1 text-sm font-medium">
            <BookOpenCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Materiały</span>
          </Link>

          <Link href="/creator" className="flex items-center gap-1 text-sm font-medium">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Kreator</span>
          </Link>

          <Link href="/stats" className="flex items-center gap-1 text-sm font-medium">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Statystyki</span>
          </Link>

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Przełącz motyw"
              className="focus:outline-none"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}

