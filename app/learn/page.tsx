"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { germanWords, germanSentences, type WordItem, type SentenceItem } from "@/lib/quiz-data"
import { Search, SortAsc, SortDesc, BookOpen, MessageSquare, CreditCard } from "lucide-react"
import { Flashcards } from "@/components/flashcards"
import {
  czyIstniejeWlasnaBaza,
  pobierzWlasneSlowa,
  pobierzWlasneZdania,
  pobierzWlasnaBaze,
} from "@/lib/custom-database"
import { motion } from "framer-motion"

export default function LearnPage() {
  const [slowa, setSlowa] = useState<WordItem[]>([])
  const [przefiltrowaneSłowa, setPrzefiltrowaneSłowa] = useState<WordItem[]>([])
  const [wyszukiwanieSlowa, setWyszukiwanieSlowa] = useState("")
  const [sortowanieSlowa, setSortowanieSlowa] = useState<
    "germanWord" | "polishTranslation" | "category" | "difficulty"
  >("germanWord")
  const [kierunekSortowaniaSlowa, setKierunekSortowaniaSlowa] = useState<"asc" | "desc">("asc")
  const [kategoriaSlowa, setKategoriaSlowa] = useState<string>("all")

  const [zdania, setZdania] = useState<SentenceItem[]>([])
  const [przefiltrowanZdania, setPrzefiltrowanZdania] = useState<SentenceItem[]>([])
  const [wyszukiwanieZdania, setWyszukiwanieZdania] = useState("")
  const [sortowanieZdania, setSortowanieZdania] = useState<
    "germanSentence" | "polishTranslation" | "category" | "difficulty"
  >("germanSentence")
  const [kierunekSortowaniaZdania, setKierunekSortowaniaZdania] = useState<"asc" | "desc">("asc")
  const [kategoriaZdania, setKategoriaZdania] = useState<string>("all")

  const [uzyjWlasnejBazy, setUzyjWlasnejBazy] = useState(false)
  const [maSentences, setMaSentences] = useState(true)
  const [jezykBazy, setJezykBazy] = useState<"de" | "en">("de")

  useEffect(() => {
    const maWlasnaBaze = czyIstniejeWlasnaBaza()
    setUzyjWlasnejBazy(maWlasnaBaze)

    if (maWlasnaBaze) {
      const wlasnaBaza = pobierzWlasnaBaze()
      if (wlasnaBaza) {
        setJezykBazy(wlasnaBaza.language || "de")
        const wlasneSlowa = pobierzWlasneSlowa()
        const wlasneZdania = pobierzWlasneZdania()

        setSlowa(wlasneSlowa)
        setZdania(wlasneZdania)
        setPrzefiltrowaneSłowa(wlasneSlowa)
        setPrzefiltrowanZdania(wlasneZdania)
        setMaSentences(wlasneZdania.length > 0)
      }
    } else {
      setJezykBazy("de")
      setSlowa(germanWords)
      setZdania(germanSentences)
      setPrzefiltrowaneSłowa(germanWords)
      setPrzefiltrowanZdania(germanSentences)
      setMaSentences(true)
    }
  }, [])

  const kategorieSlowa = useMemo(
    () => ["all", ...new Set((uzyjWlasnejBazy ? pobierzWlasneSlowa() : germanWords).map((word) => word.category))],
    [uzyjWlasnejBazy],
  )

  const kategorieZdania = useMemo(
    () => [
      "all",
      ...new Set((uzyjWlasnejBazy ? pobierzWlasneZdania() : germanSentences).map((sentence) => sentence.category)),
    ],
    [uzyjWlasnejBazy],
  )

  useEffect(() => {
    let wynik = [...slowa]

    if (kategoriaSlowa !== "all") {
      wynik = wynik.filter((slowo) => slowo.category === kategoriaSlowa)
    }

    if (wyszukiwanieSlowa) {
      const zapytanie = wyszukiwanieSlowa.toLowerCase()
      wynik = wynik.filter((slowo) => {
        const sourceField =
          uzyjWlasnejBazy && jezykBazy === "en"
            ? slowo.englishTranslation.toLowerCase()
            : slowo.germanWord.toLowerCase()
        return sourceField.includes(zapytanie) || slowo.polishTranslation.toLowerCase().includes(zapytanie)
      })
    }

    wynik.sort((a, b) => {
      let poleA, poleB

      if (sortowanieSlowa === "germanWord") {
        poleA = uzyjWlasnejBazy && jezykBazy === "en" ? a.englishTranslation.toLowerCase() : a.germanWord.toLowerCase()
        poleB = uzyjWlasnejBazy && jezykBazy === "en" ? b.englishTranslation.toLowerCase() : b.germanWord.toLowerCase()
      } else {
        poleA = a[sortowanieSlowa].toLowerCase()
        poleB = b[sortowanieSlowa].toLowerCase()
      }

      if (kierunekSortowaniaSlowa === "asc") {
        return poleA.localeCompare(poleB)
      } else {
        return poleB.localeCompare(poleA)
      }
    })

    setPrzefiltrowaneSłowa(wynik)
  }, [slowa, wyszukiwanieSlowa, sortowanieSlowa, kierunekSortowaniaSlowa, kategoriaSlowa, uzyjWlasnejBazy, jezykBazy])

  useEffect(() => {
    let wynik = [...zdania]

    if (kategoriaZdania !== "all") {
      wynik = wynik.filter((zdanie) => zdanie.category === kategoriaZdania)
    }

    if (wyszukiwanieZdania) {
      const zapytanie = wyszukiwanieZdania.toLowerCase()
      wynik = wynik.filter(
        (zdanie) =>
          zdanie.germanSentence.toLowerCase().includes(zapytanie) ||
          zdanie.polishTranslation.toLowerCase().includes(zapytanie),
      )
    }

    wynik.sort((a, b) => {
      const poleA = a[sortowanieZdania].toLowerCase()
      const poleB = b[sortowanieZdania].toLowerCase()

      if (kierunekSortowaniaZdania === "asc") {
        return poleA.localeCompare(poleB)
      } else {
        return poleB.localeCompare(poleA)
      }
    })

    setPrzefiltrowanZdania(wynik)
  }, [zdania, wyszukiwanieZdania, sortowanieZdania, kierunekSortowaniaZdania, kategoriaZdania])

  const przelaczKierunekSortowaniaSlowa = () => {
    setKierunekSortowaniaSlowa(kierunekSortowaniaSlowa === "asc" ? "desc" : "asc")
  }

  const przelaczKierunekSortowaniaZdania = () => {
    setKierunekSortowaniaZdania(kierunekSortowaniaZdania === "asc" ? "desc" : "asc")
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      className="container max-w-6xl mx-auto py-10 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl font-bold mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Materiały do nauki
      </motion.h1>

      <Tabs defaultValue="words" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="words" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Słowa ({przefiltrowaneSłowa.length})
          </TabsTrigger>
          {maSentences && (
            <TabsTrigger value="sentences" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Zdania ({przefiltrowanZdania.length})
            </TabsTrigger>
          )}
          <TabsTrigger value="flashcards" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Fiszki
          </TabsTrigger>
        </TabsList>

        <TabsContent value="words">
          <motion.div className="flex flex-col gap-6" variants={container} initial="hidden" animate="show">
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Szukaj słów..."
                  className="pl-8"
                  value={wyszukiwanieSlowa}
                  onChange={(e) => setWyszukiwanieSlowa(e.target.value)}
                />
              </div>

              <div>
                <Select value={kategoriaSlowa} onValueChange={setKategoriaSlowa}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz kategorię" />
                  </SelectTrigger>
                  <SelectContent>
                    {kategorieSlowa.map((kategoria) => (
                      <SelectItem key={kategoria} value={kategoria}>
                        {kategoria === "all" ? "Wszystkie kategorie" : kategoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Select value={sortowanieSlowa} onValueChange={(value: any) => setSortowanieSlowa(value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Sortuj według" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="germanWord">
                      {uzyjWlasnejBazy && jezykBazy === "en" ? "Słowo angielskie" : "Słowo niemieckie"}
                    </SelectItem>
                    <SelectItem value="polishTranslation">Tłumaczenie polskie</SelectItem>
                    <SelectItem value="category">Kategoria</SelectItem>
                    <SelectItem value="difficulty">Trudność</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={przelaczKierunekSortowaniaSlowa}>
                  {kierunekSortowaniaSlowa === "asc" ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </motion.div>

            <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {przefiltrowaneSłowa.map((slowo) => (
                <motion.div key={slowo.id} variants={item}>
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-lg">
                          {uzyjWlasnejBazy && jezykBazy === "en" ? slowo.englishTranslation : slowo.germanWord}
                        </div>
                        <div className="text-xs px-2 py-1 rounded-full bg-muted">
                          {slowo.difficulty === "easy" ? "łatwy" : slowo.difficulty === "medium" ? "średni" : "trudny"}
                        </div>
                      </div>
                      <div className="text-muted-foreground">{slowo.polishTranslation}</div>
                      <div className="mt-2 text-xs text-muted-foreground">Kategoria: {slowo.category}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {przefiltrowaneSłowa.length === 0 && (
              <motion.div
                className="text-center py-8 text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Nie znaleziono słów pasujących do kryteriów wyszukiwania.
              </motion.div>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="sentences">
          <motion.div className="flex flex-col gap-6" variants={container} initial="hidden" animate="show">
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Szukaj zdań..."
                  className="pl-8"
                  value={wyszukiwanieZdania}
                  onChange={(e) => setWyszukiwanieZdania(e.target.value)}
                />
              </div>

              <div>
                <Select value={kategoriaZdania} onValueChange={setKategoriaZdania}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz kategorię" />
                  </SelectTrigger>
                  <SelectContent>
                    {kategorieZdania.map((kategoria) => (
                      <SelectItem key={kategoria} value={kategoria}>
                        {kategoria === "all" ? "Wszystkie kategorie" : kategoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Select value={sortowanieZdania} onValueChange={(value: any) => setSortowanieZdania(value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Sortuj według" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="germanSentence">Zdanie niemieckie</SelectItem>
                    <SelectItem value="polishTranslation">Tłumaczenie polskie</SelectItem>
                    <SelectItem value="category">Kategoria</SelectItem>
                    <SelectItem value="difficulty">Trudność</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={przelaczKierunekSortowaniaZdania}>
                  {kierunekSortowaniaZdania === "asc" ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </motion.div>

            <motion.div variants={container} className="grid grid-cols-1 gap-4">
              {przefiltrowanZdania.map((zdanie) => (
                <motion.div key={zdanie.id} variants={item}>
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">{zdanie.germanSentence}</div>
                        <div className="text-xs px-2 py-1 rounded-full bg-muted ml-2 shrink-0">
                          {zdanie.difficulty === "easy"
                            ? "łatwy"
                            : zdanie.difficulty === "medium"
                              ? "średni"
                              : "trudny"}
                        </div>
                      </div>
                      <div className="text-muted-foreground">{zdanie.polishTranslation}</div>
                      <div className="mt-2 text-xs text-muted-foreground">Kategoria: {zdanie.category}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {przefiltrowanZdania.length === 0 && (
              <motion.div
                className="text-center py-8 text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Nie znaleziono zdań pasujących do kryteriów wyszukiwania.
              </motion.div>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="flashcards">
          <Flashcards />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

