"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

export function ExitQuizDialog() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleExit = () => {
    setOpen(false)
    router.push("/")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Zakończ quiz</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Zakończ quiz</DialogTitle>
          <DialogDescription>Czy na pewno chcesz zakończyć? Twój obecny postęp zostanie utracony.</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Anuluj
          </Button>
          <Button variant="destructive" onClick={handleExit}>
            Tak, zakończ quiz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

