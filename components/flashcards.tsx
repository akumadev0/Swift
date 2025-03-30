"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { germanWords, germanSentences, type WordItem, type SentenceItem, getLanguageName } from "@/lib/quiz-data"
import {
  pobierzWlasneSlowa,
  pobierzWlasneZdania,
  czyIstniejeWlasnaBaza,
  pobierzWlasnaBaze,
} from "@/lib/custom-database"
import { ArrowLeft, ArrowRight, RotateCcw, Repeat, BookOpen, MessageSquare, Check, X } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"

type ElementFiszki = {
  id: number
  przednia: string
  tylna: string
  typ: "word" | "sentence"
  status: "nieznane" | "uczenie" | "znane"
  category: string
  difficulty: "easy" | "medium" | "hard"
}

export function Flashcards() {
  const [fiszki, setFiszki] = useState<ElementFiszki[]>([])
  const [aktualnaFiszka, setAktualnaFiszka] = useState(0)
  const [odwrocona, setOdwrocona] = useState(false)
  const [jezykZrodlowy, setJezykZrodlowy] = useState<"de" | "pl" | "en">("de")
  const [jezykDocelowy, setJezykDocelowy] = useState<"de" | "pl" | "en">("pl")
  const [uzyjWlasnejBazy, setUzyjWlasnejBazy] = useState(false)
  const [filtrKategorii, setFiltrKategorii] = useState<string>("all")
  const [filtrTrudnosci, setFiltrTrudnosci] = useState<string>("all")
  const [filtrStatusu, setFiltrStatusu] = useState<string>("all")
  const [filtrTypu, setFiltrTypu] = useState<string>("all")
  const [pokazujTylkoNieznane, setPokazujTylkoNieznane] = useState(false)
  const [kierunekPrzeciagniecia, setKierunekPrzeciagniecia] = useState<"none" | "left" | "right">("none")
  const [przefiltrowaneFiszki, setPrzefiltrowaneFiszki] = useState<ElementFiszki[]>([])
  const [dostepneJezyki, setDostepneJezyki] = useState<{
    source: ("de" | "pl" | "en")[]
    target: ("de" | "pl" | "en")[]
  }>({
    source: ["de", "pl", "en"],
    target: ["de", "pl", "en"],
  })

  useEffect(() => {
    const wczytajFiszki = () => {
      let slowa: WordItem[] = []
      let zdania: SentenceItem[] = []
      let databaseLanguage: "de" | "en" = "de"

      if (uzyjWlasnejBazy && czyIstniejeWlasnaBaza()) {
        const wlasnaBaza = pobierzWlasnaBaze()
        if (wlasnaBaza) {
          databaseLanguage = wlasnaBaza.language || "de"

          if (databaseLanguage === "de") {
            setDostepneJezyki({
              source: ["de", "pl"],
              target: ["de", "pl"],
            })
            if (jezykZrodlowy === "en") setJezykZrodlowy("de")
            if (jezykDocelowy === "en") setJezykDocelowy("pl")
          } else if (databaseLanguage === "en") {
            setDostepneJezyki({
              source: ["en", "pl"],
              target: ["en", "pl"],
            })
            if (jezykZrodlowy === "de") setJezykZrodlowy("en")
            if (jezykDocelowy === "de") setJezykDocelowy("pl")
          }
        }
        slowa = pobierzWlasneSlowa()
        zdania = pobierzWlasneZdania()

        if (wlasnaBaza && wlasnaBaza.sentences.length === 0) {
          setFiltrTypu("word")
        }
      } else {
        setDostepneJezyki({
          source: ["de", "pl", "en"],
          target: ["de", "pl", "en"],
        })
        slowa = germanWords
        zdania = germanSentences
      }

      const zapisaneStatusy = localStorage.getItem("statusyFiszek")
      const statusy: Record<string, "nieznane" | "uczenie" | "znane"> = zapisaneStatusy
        ? JSON.parse(zapisaneStatusy)
        : {}

      const fiszkiZeSlow = slowa.map((slowo): ElementFiszki => {
        const klucz = `word-${slowo.id}-${jezykZrodlowy}-${jezykDocelowy}`

        let przednia = ""
        if (jezykZrodlowy === "de") {
          przednia = slowo.germanWord
        } else if (jezykZrodlowy === "en") {
          przednia = slowo.englishTranslation
        } else {
          przednia = slowo.polishTranslation
        }

        let tylna = ""
        if (jezykDocelowy === "de") {
          tylna = slowo.germanWord
        } else if (jezykDocelowy === "en") {
          tylna = slowo.englishTranslation
        } else {
          tylna = slowo.polishTranslation
        }

        return {
          id: slowo.id,
          przednia,
          tylna,
          typ: "word",
          status: statusy[klucz] || "nieznane",
          category: slowo.category,
          difficulty: slowo.difficulty,
        }
      })

      const fiszkiZeZdan = zdania.map((zdanie): ElementFiszki => {
        const klucz = `sentence-${zdanie.id}-${jezykZrodlowy}-${jezykDocelowy}`

        let przednia = ""
        if (jezykZrodlowy === "de") {
          przednia = zdanie.germanSentence
        } else if (jezykZrodlowy === "en") {
          przednia = zdanie.englishTranslation
        } else {
          przednia = zdanie.polishTranslation
        }

        let tylna = ""
        if (jezykDocelowy === "de") {
          tylna = zdanie.germanSentence
        } else if (jezykDocelowy === "en") {
          tylna = zdanie.englishTranslation
        } else {
          tylna = zdanie.polishTranslation
        }

        return {
          id: zdanie.id,
          przednia,
          tylna,
          typ: "sentence",
          status: statusy[klucz] || "nieznane",
          category: zdanie.category,
          difficulty: zdanie.difficulty,
        }
      })

      const wszystkieFiszki = [...fiszkiZeSlow, ...fiszkiZeZdan].sort(() => Math.random() - 0.5)
      setFiszki(wszystkieFiszki)
      setAktualnaFiszka(0)
      setOdwrocona(false)
    }

    wczytajFiszki()
  }, [jezykZrodlowy, jezykDocelowy, uzyjWlasnejBazy])

  useEffect(() => {
    let przefiltrowane = [...fiszki]

    if (filtrKategorii !== "all") {
      przefiltrowane = przefiltrowane.filter((fiszka) => fiszka.category === filtrKategorii)
    }

    if (filtrTrudnosci !== "all") {
      przefiltrowane = przefiltrowane.filter((fiszka) => fiszka.difficulty === filtrTrudnosci)
    }

    if (filtrStatusu !== "all") {
      przefiltrowane = przefiltrowane.filter((fiszka) => fiszka.status === filtrStatusu)
    }

    if (filtrTypu !== "all") {
      przefiltrowane = przefiltrowane.filter((fiszka) => fiszka.typ === filtrTypu)
    }

    if (pokazujTylkoNieznane) {
      przefiltrowane = przefiltrowane.filter((fiszka) => fiszka.status !== "znane")
    }

    setPrzefiltrowaneFiszki(przefiltrowane)

    if (aktualnaFiszka >= przefiltrowane.length) {
      setAktualnaFiszka(Math.max(0, przefiltrowane.length - 1))
    }
  }, [fiszki, filtrKategorii, filtrTrudnosci, filtrStatusu, filtrTypu, pokazujTylkoNieznane, aktualnaFiszka])

  useEffect(() => {
    const statusy: Record<string, string> = {}

    fiszki.forEach((fiszka) => {
      const klucz = `${fiszka.typ}-${fiszka.id}-${jezykZrodlowy}-${jezykDocelowy}`
      statusy[klucz] = fiszka.status
    })

    localStorage.setItem("statusyFiszek", JSON.stringify(statusy))
  }, [fiszki, jezykZrodlowy, jezykDocelowy])

  const kategorie = useMemo(() => ["all", ...new Set(fiszki.map((fiszka) => fiszka.category))], [fiszki])
  const trudnosci = ["all", "easy", "medium", "hard"]

  const odwrocFiszke = useCallback(() => {
    setOdwrocona(!odwrocona)
  }, [odwrocona])

  const nastepnaFiszka = useCallback(() => {
    if (aktualnaFiszka < przefiltrowaneFiszki.length - 1) {
      setAktualnaFiszka(aktualnaFiszka + 1)
      setOdwrocona(false)
      setKierunekPrzeciagniecia("none")
    }
  }, [aktualnaFiszka, przefiltrowaneFiszki.length])

  const poprzedniaFiszka = useCallback(() => {
    if (aktualnaFiszka > 0) {
      setAktualnaFiszka(aktualnaFiszka - 1)
      setOdwrocona(false)
      setKierunekPrzeciagniecia("none")
    }
  }, [aktualnaFiszka])

  const resetujFiszki = useCallback(() => {
    const zaktualizowaneFiszki = fiszki.map((fiszka) => ({
      ...fiszka,
      status: "nieznane",
    }))
    setFiszki(zaktualizowaneFiszki)
    setAktualnaFiszka(0)
    setOdwrocona(false)
  }, [fiszki])

  const przetasujFiszki = useCallback(() => {
    const przetasowaneFiszki = [...fiszki].sort(() => Math.random() - 0.5)
    setFiszki(przetasowaneFiszki)
    setAktualnaFiszka(0)
    setOdwrocona(false)
  }, [fiszki])

  const oznaczJakoUczenie = useCallback(() => {
    if (przefiltrowaneFiszki.length === 0) return

    const zaktualizowaneFiszki = [...fiszki]
    const indeksWszystkichFiszek = fiszki.findIndex(
      (f) => f.id === przefiltrowaneFiszki[aktualnaFiszka].id && f.typ === przefiltrowaneFiszki[aktualnaFiszka].typ,
    )

    if (indeksWszystkichFiszek !== -1) {
      zaktualizowaneFiszki[indeksWszystkichFiszek] = {
        ...zaktualizowaneFiszki[indeksWszystkichFiszek],
        status: "uczenie",
      }
      setFiszki(zaktualizowaneFiszki)
    }

    nastepnaFiszka()
  }, [fiszki, przefiltrowaneFiszki, aktualnaFiszka, nastepnaFiszka])

  const oznaczJakoZnane = useCallback(() => {
    if (przefiltrowaneFiszki.length === 0) return

    const zaktualizowaneFiszki = [...fiszki]
    const indeksWszystkichFiszek = fiszki.findIndex(
      (f) => f.id === przefiltrowaneFiszki[aktualnaFiszka].id && f.typ === przefiltrowaneFiszki[aktualnaFiszka].typ,
    )

    if (indeksWszystkichFiszek !== -1) {
      zaktualizowaneFiszki[indeksWszystkichFiszek] = {
        ...zaktualizowaneFiszki[indeksWszystkichFiszek],
        status: "znane",
      }
      setFiszki(zaktualizowaneFiszki)
    }

    nastepnaFiszka()
  }, [fiszki, przefiltrowaneFiszki, aktualnaFiszka, nastepnaFiszka])

  const obslugaPrzeciagniecia = useCallback(
    (kierunek: "left" | "right") => {
      setKierunekPrzeciagniecia(kierunek)

      if (kierunek === "left") {
        oznaczJakoUczenie()
      } else {
        oznaczJakoZnane()
      }
    },
    [oznaczJakoUczenie, oznaczJakoZnane],
  )

  const liczbaZnanych = useMemo(() => fiszki.filter((f) => f.status === "znane").length, [fiszki])
  const liczbaUczonych = useMemo(() => fiszki.filter((f) => f.status === "uczenie").length, [fiszki])
  const liczbaNieznanych = useMemo(() => fiszki.filter((f) => f.status === "nieznane").length, [fiszki])
  const procentUkonczone = useMemo(
    () => (fiszki.length > 0 ? Math.round((liczbaZnanych / fiszki.length) * 100) : 0),
    [fiszki.length, liczbaZnanych],
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="source-language" className="text-xs">
                Język źródłowy
              </Label>
              <Select value={jezykZrodlowy} onValueChange={(value) => setJezykZrodlowy(value as "de" | "pl" | "en")}>
                <SelectTrigger id="source-language">
                  <SelectValue placeholder="Wybierz język" />
                </SelectTrigger>
                <SelectContent>
                  {dostepneJezyki.source.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {getLanguageName(lang)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="target-language" className="text-xs">
                Język docelowy
              </Label>
              <Select value={jezykDocelowy} onValueChange={(value) => setJezykDocelowy(value as "de" | "pl" | "en")}>
                <SelectTrigger id="target-language">
                  <SelectValue placeholder="Wybierz język" />
                </SelectTrigger>
                <SelectContent>
                  {dostepneJezyki.target
                    .filter((lang) => lang !== jezykZrodlowy)
                    .map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {getLanguageName(lang)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="database-switch"
              checked={uzyjWlasnejBazy}
              onCheckedChange={setUzyjWlasnejBazy}
              disabled={!czyIstniejeWlasnaBaza()}
            />
            <Label htmlFor="database-switch">{uzyjWlasnejBazy ? "Własna baza danych" : "Wbudowana baza danych"}</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="unknown-switch" checked={pokazujTylkoNieznane} onCheckedChange={setPokazujTylkoNieznane} />
            <Label htmlFor="unknown-switch">Pokazuj tylko nieznane i uczone</Label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="category-filter" className="text-xs">
                Kategoria
              </Label>
              <Select value={filtrKategorii} onValueChange={setFiltrKategorii}>
                <SelectTrigger id="category-filter">
                  <SelectValue placeholder="Wszystkie kategorie" />
                </SelectTrigger>
                <SelectContent>
                  {kategorie.map((kategoria) => (
                    <SelectItem key={kategoria} value={kategoria}>
                      {kategoria === "all" ? "Wszystkie kategorie" : kategoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="difficulty-filter" className="text-xs">
                Trudność
              </Label>
              <Select value={filtrTrudnosci} onValueChange={setFiltrTrudnosci}>
                <SelectTrigger id="difficulty-filter">
                  <SelectValue placeholder="Wszystkie poziomy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie poziomy</SelectItem>
                  <SelectItem value="easy">Łatwy</SelectItem>
                  <SelectItem value="medium">Średni</SelectItem>
                  <SelectItem value="hard">Trudny</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status-filter" className="text-xs">
                Status
              </Label>
              <Select value={filtrStatusu} onValueChange={setFiltrStatusu}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Wszystkie statusy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie statusy</SelectItem>
                  <SelectItem value="nieznane">Nieznane</SelectItem>
                  <SelectItem value="uczenie">Uczę się</SelectItem>
                  <SelectItem value="znane">Znane</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type-filter" className="text-xs">
                Typ
              </Label>
              <Select value={filtrTypu} onValueChange={setFiltrTypu}>
                <SelectTrigger id="type-filter">
                  <SelectValue placeholder="Wszystkie typy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie typy</SelectItem>
                  <SelectItem value="word">Słowa</SelectItem>
                  <SelectItem value="sentence">Zdania</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Fiszki: {przefiltrowaneFiszki.length} (Znane: {liczbaZnanych}, Uczone: {liczbaUczonych}, Nieznane:{" "}
          {liczbaNieznanych})
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={resetujFiszki} className="gap-1">
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Resetuj</span>
          </Button>
          <Button variant="outline" size="sm" onClick={przetasujFiszki} className="gap-1">
            <Repeat className="h-4 w-4" />
            <span className="hidden sm:inline">Przetasuj</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[400px]">
        {przefiltrowaneFiszki.length > 0 ? (
          <>
            <div className="w-full max-w-md relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${przefiltrowaneFiszki[aktualnaFiszka].id}-${przefiltrowaneFiszki[aktualnaFiszka].typ}`}
                  initial={{ opacity: 0, x: 0, scale: 0.95 }}
                  animate={{
                    opacity: 1,
                    x: kierunekPrzeciagniecia === "none" ? 0 : kierunekPrzeciagniecia === "left" ? -300 : 300,
                    scale: 1,
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.7}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = Math.abs(offset.x) > 100 || Math.abs(velocity.x) > 800

                    if (swipe) {
                      if (offset.x > 0) {
                        obslugaPrzeciagniecia("right")
                      } else {
                        obslugaPrzeciagniecia("left")
                      }
                    }
                  }}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <Card
                    className={`w-full h-64 flex items-center justify-center p-6 cursor-pointer transition-all duration-300 ${
                      przefiltrowaneFiszki[aktualnaFiszka].status === "znane"
                        ? "border-green-500"
                        : przefiltrowaneFiszki[aktualnaFiszka].status === "uczenie"
                          ? "border-orange-500"
                          : ""
                    }`}
                    onClick={odwrocFiszke}
                  >
                    <CardContent className="p-0 w-full h-full flex flex-col items-center justify-center">
                      <div className="absolute top-2 left-2 flex items-center gap-1 text-xs text-muted-foreground">
                        {przefiltrowaneFiszki[aktualnaFiszka].typ === "word" ? (
                          <BookOpen className="h-3 w-3" />
                        ) : (
                          <MessageSquare className="h-3 w-3" />
                        )}
                        <span>{przefiltrowaneFiszki[aktualnaFiszka].typ === "word" ? "Słowo" : "Zdanie"}</span>
                      </div>

                      <div className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full bg-muted">
                        {przefiltrowaneFiszki[aktualnaFiszka].difficulty === "easy"
                          ? "łatwy"
                          : przefiltrowaneFiszki[aktualnaFiszka].difficulty === "medium"
                            ? "średni"
                            : "trudny"}
                      </div>

                      <div className="text-center">
                        <motion.div
                          className={`text-xl font-medium mb-2 ${odwrocona ? "opacity-50" : ""}`}
                          animate={{ opacity: odwrocona ? 0.5 : 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {przefiltrowaneFiszki[aktualnaFiszka].przednia}
                        </motion.div>

                        <AnimatePresence>
                          {odwrocona && (
                            <motion.div
                              className="text-xl font-medium mt-4 text-primary"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.3 }}
                            >
                              {przefiltrowaneFiszki[aktualnaFiszka].tylna}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-muted-foreground">
                        Kliknij, aby odwrócić fiszkę • Przeciągnij w lewo/prawo, aby oznaczyć
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>

              <motion.div
                className="absolute -left-4 top-1/2 transform -translate-y-1/2 opacity-30 hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button variant="ghost" size="icon" onClick={poprzedniaFiszka} disabled={aktualnaFiszka === 0}>
                  <ArrowLeft className="h-6 w-6" />
                </Button>
              </motion.div>

              <motion.div
                className="absolute -right-4 top-1/2 transform -translate-y-1/2 opacity-30 hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nastepnaFiszka}
                  disabled={aktualnaFiszka === przefiltrowaneFiszki.length - 1}
                >
                  <ArrowRight className="h-6 w-6" />
                </Button>
              </motion.div>
            </div>

            <div className="flex gap-4 mt-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="gap-2 border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/20"
                  onClick={oznaczJakoUczenie}
                >
                  <X className="h-4 w-4" />
                  Uczę się
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="gap-2 border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950/20"
                  onClick={oznaczJakoZnane}
                >
                  <Check className="h-4 w-4" />
                  Znam
                </Button>
              </motion.div>
            </div>

            <motion.div
              className="mt-4 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {aktualnaFiszka + 1} z {przefiltrowaneFiszki.length} • Ukończono: {procentUkonczone}%
            </motion.div>
          </>
        ) : (
          <motion.div
            className="text-center py-8 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Brak fiszek spełniających kryteria filtrowania.
          </motion.div>
        )}
      </div>
    </div>
  )
}

