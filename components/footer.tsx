"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <motion.p
          className="text-center text-sm leading-loose text-muted-foreground md:text-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Stworzono, aby pomóc Ci w nauce języka niemieckiego. Praktyka czyni mistrza!
        </motion.p>
        <div className="flex items-center gap-4 text-sm">
          <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <Link href="/" className="font-medium underline underline-offset-4">
              Strona główna
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <Link href="/stats" className="font-medium underline underline-offset-4">
              Statystyki
            </Link>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}

