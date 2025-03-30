"use client"

import Link from "next/link"
import { Home, Settings, Moon, Sun, BookOpenCheck, Database, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [zamontowany, setZamontowany] = useState(false)

  useEffect(() => {
    setZamontowany(true)
  }, [])

  const navItems = [
    { href: "/", icon: <Home className="h-4 w-4" />, label: "Strona główna" },
    { href: "/learn", icon: <BookOpenCheck className="h-4 w-4" />, label: "Materiały" },
    { href: "/creator", icon: <Database className="h-4 w-4" />, label: "Kreator" },
    { href: "/stats", icon: <Settings className="h-4 w-4" />, label: "Statystyki" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <motion.div
              whileHover={{ rotate: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="brand-gradient p-1.5 rounded-full"
            >
              

              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="37" viewBox="0 0 159 158" fill="none">
<rect x="0.5" width="158" height="158" rx="31" fill="url(#paint0_linear_98_186)"/>
<g filter="url(#filter0_i_98_186)">
<path d="M89.892 65.5C89.7027 63.1326 88.8149 61.286 87.2287 59.9602C85.6662 58.6345 83.2869 57.9716 80.0909 57.9716C78.0549 57.9716 76.3859 58.2202 75.0838 58.7173C73.8054 59.1908 72.8584 59.8419 72.2429 60.6705C71.6274 61.4991 71.3078 62.446 71.2841 63.5114C71.2367 64.3873 71.3906 65.1804 71.7457 65.8906C72.1245 66.5772 72.7164 67.2045 73.5213 67.7727C74.3262 68.3172 75.3561 68.8144 76.6108 69.2642C77.8655 69.714 79.357 70.1165 81.0852 70.4716L87.0511 71.75C91.0758 72.6023 94.5204 73.7268 97.3849 75.1236C100.25 76.5204 102.593 78.1657 104.416 80.0597C106.239 81.9299 107.577 84.0369 108.429 86.3807C109.305 88.7244 109.755 91.2812 109.778 94.0511C109.755 98.8333 108.559 102.882 106.192 106.196C103.824 109.51 100.439 112.032 96.0355 113.76C91.6558 115.488 86.3883 116.352 80.233 116.352C73.9119 116.352 68.3958 115.417 63.6847 113.547C58.9972 111.677 55.3513 108.8 52.7472 104.918C50.1667 101.011 48.8646 96.0161 48.8409 89.9318H67.5909C67.7093 92.1572 68.2656 94.0275 69.2599 95.5426C70.2543 97.0578 71.651 98.206 73.4503 98.9872C75.2732 99.7685 77.4394 100.159 79.9489 100.159C82.0559 100.159 83.8196 99.8987 85.2401 99.3778C86.6605 98.857 87.7377 98.1349 88.4716 97.2116C89.2055 96.2884 89.5843 95.2348 89.608 94.0511C89.5843 92.9384 89.2173 91.9678 88.5071 91.1392C87.8206 90.2869 86.6842 89.5294 85.098 88.8665C83.5118 88.1799 81.3693 87.5407 78.6705 86.9489L71.4261 85.3864C64.9867 83.9896 59.9086 81.6577 56.1918 78.3906C52.4986 75.0999 50.6638 70.6136 50.6875 64.9318C50.6638 60.3153 51.8949 56.2789 54.3807 52.8224C56.8902 49.3423 60.3584 46.6316 64.7855 44.6903C69.2363 42.7491 74.3381 41.7784 80.0909 41.7784C85.9621 41.7784 91.0402 42.7609 95.3253 44.7259C99.6103 46.6908 102.913 49.4607 105.233 53.0355C107.577 56.5866 108.76 60.7415 108.784 65.5H89.892Z" fill="#D9D9D9"/>
</g>
<defs>
<filter id="filter0_i_98_186" x="48.8409" y="41.7784" width="60.9376" height="74.5739" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
<feFlood floodOpacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feGaussianBlur stdDeviation="0.95"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.192157 0 0 0 0 0.00392157 0 0 0 0 1 0 0 0 1 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow_98_186"/>
</filter>
<linearGradient id="paint0_linear_98_186" x1="236" y1="-69.5" x2="-176.5" y2="257" gradientUnits="userSpaceOnUse">
<stop offset="0.1" stopColor="#00F7FF"/>
<stop offset="0.18" stopColor="#FF0099"/>
<stop offset="0.405" stopColor="#1A00FF"/>
<stop offset="0.635" stopColor="#8800FF"/>
</linearGradient>
</defs>
</svg>
            </motion.div>
            <span className="brand-gradient-text font-bold">Swift<span className="text-brand-magenta">.app</span></span>
          </Link>
        </motion.div>

        <nav className="ml-auto flex items-center gap-4">
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <Link href={item.href} className="flex items-center gap-1 text-sm font-medium">
                <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  {item.icon}
                </motion.div>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            </motion.div>
          ))}

          {zamontowany && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Przełącz motyw"
                className="focus:outline-none"
              >
                <motion.div animate={{ rotate: theme === "dark" ? 0 : 180 }} transition={{ duration: 0.5 }}>
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </motion.div>
              </Button>
            </motion.div>
          )}
        </nav>
      </div>
    </header>
  )
}

