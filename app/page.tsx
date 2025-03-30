"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  BookOpen,
  MessageSquare,
  Shuffle,
  Database,
  Upload,
  Trash2,
  CheckSquare,
  ToggleLeft,
  ListChecks,
  Settings,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { germanWords, germanSentences, getLanguageName } from "@/lib/quiz-data"
import { Switch } from "@/components/ui/switch"
import {
  czyIstniejeWlasnaBaza as czyIstniejeWlasnaBazaFunc,
  pobierzWlasnaBaze,
  zapiszWlasnaBaze,
  usunWlasnaBaze,
} from "@/lib/custom-database"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  const [iloscSlow, setIloscSlow] = useState(10)
  const [iloscZdan, setIloscZdan] = useState(5)
  const [jezykZrodlowy, setJezykZrodlowy] = useState<"de" | "pl" | "en">("de")
  const [jezykDocelowy, setJezykDocelowy] = useState<"de" | "pl" | "en">("pl")
  const [uzyjWlasnejBazy, setUzyjWlasnejBazy] = useState(false)
  const [infoWlasnejBazy, setInfoWlasnejBazy] = useState<{
    name: string
    words: number
    sentences: number
    language?: "de" | "en"
  } | null>(null)
  const [statusWgrywania, setStatusWgrywania] = useState<{ success: boolean; message: string } | null>(null)
  const [zamontowany, setZamontowany] = useState(false)
  const [typTestu, setTypTestu] = useState<"wpisywanie" | "prawdaFalsz" | "wybor" | "mieszany">("wpisywanie")
  const [dostepneJezyki, setDostepneJezyki] = useState<{
    source: ("de" | "pl" | "en")[]
    target: ("de" | "pl" | "en")[]
  }>({
    source: ["de", "pl", "en"],
    target: ["de", "pl", "en"],
  })
  const [activeTab, setActiveTab] = useState<"quiz" | "settings">("quiz")

  const calkowitaIloscSlow = germanWords.length
  const calkowitaIloscZdan = germanSentences.length

  useEffect(() => {
    setZamontowany(true)
    if (typeof window !== "undefined") {
      const maWlasnaBaze = czyIstniejeWlasnaBazaFunc()
      setUzyjWlasnejBazy(maWlasnaBaze)

      if (maWlasnaBaze) {
        const wlasnaBaza = pobierzWlasnaBaze()
        if (wlasnaBaza) {
          setInfoWlasnejBazy({
            name: wlasnaBaza.name,
            words: wlasnaBaza.words.length,
            sentences: wlasnaBaza.sentences.length,
            language: wlasnaBaza.language,
          })

          if (wlasnaBaza.language) {
            if (wlasnaBaza.language === "de") {
              setDostepneJezyki({
                source: ["de", "pl"],
                target: ["de", "pl"],
              })
              setJezykZrodlowy("de")
              setJezykDocelowy("pl")
            } else if (wlasnaBaza.language === "en") {
              setDostepneJezyki({
                source: ["en", "pl"],
                target: ["en", "pl"],
              })
              setJezykZrodlowy("en")
              setJezykDocelowy("pl")
            }
          }
        }
      } else {
        setDostepneJezyki({
          source: ["de", "pl", "en"],
          target: ["de", "pl", "en"],
        })
      }

      const zapisanyTypTestu = localStorage.getItem("typTestu")
      if (zapisanyTypTestu) {
        setTypTestu(zapisanyTypTestu as "wpisywanie" | "prawdaFalsz" | "wybor" | "mieszany")
      }

      const zapisanyJezykZrodlowy = localStorage.getItem("jezykZrodlowy")
      if (zapisanyJezykZrodlowy && dostepneJezyki.source.includes(zapisanyJezykZrodlowy as any)) {
        setJezykZrodlowy(zapisanyJezykZrodlowy as "de" | "pl" | "en")
      }

      const zapisanyJezykDocelowy = localStorage.getItem("jezykDocelowy")
      if (zapisanyJezykDocelowy && dostepneJezyki.target.includes(zapisanyJezykDocelowy as any)) {
        setJezykDocelowy(zapisanyJezykDocelowy as "de" | "pl" | "en")
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("typTestu", typTestu)
      localStorage.setItem("jezykZrodlowy", jezykZrodlowy)
      localStorage.setItem("jezykDocelowy", jezykDocelowy)
    }
  }, [typTestu, jezykZrodlowy, jezykDocelowy])

  useEffect(() => {
    if (jezykZrodlowy === jezykDocelowy) {
      const dostepneDocelowe = dostepneJezyki.target.filter((lang) => lang !== jezykZrodlowy)
      if (dostepneDocelowe.length > 0) {
        setJezykDocelowy(dostepneDocelowe[0])
      }
    }
  }, [jezykZrodlowy, jezykDocelowy, dostepneJezyki])

  const obslugaImportuBazy = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const pliki = event.target.files
    if (!pliki || pliki.length === 0) return

    const plik = pliki[0]
    const czytnik = new FileReader()

    czytnik.onload = (e) => {
      try {
        const zawartosc = e.target?.result as string
        const zaimportowane = JSON.parse(zawartosc)

        if (
          !zaimportowane.words ||
          !Array.isArray(zaimportowane.words) ||
          !zaimportowane.sentences ||
          !Array.isArray(zaimportowane.sentences)
        ) {
          throw new Error("Nieprawidłowy format pliku")
        }

        let jezykBazy: "de" | "en" | undefined = zaimportowane.language

        if (!jezykBazy) {
          const hasGerman = zaimportowane.words.some((word: any) => word.germanWord && word.germanWord.trim() !== "")
          const hasEnglish = zaimportowane.words.some(
            (word: any) => word.englishTranslation && word.englishTranslation.trim() !== "",
          )

          if (hasGerman && !hasEnglish) {
            jezykBazy = "de"
          } else if (hasEnglish && !hasGerman) {
            jezykBazy = "en"
          } else {
            jezykBazy = "de"
          }
        }

        zaimportowane.language = jezykBazy
        zapiszWlasnaBaze(zaimportowane)

        setUzyjWlasnejBazy(true)
        setInfoWlasnejBazy({
          name: zaimportowane.name,
          words: zaimportowane.words.length,
          sentences: zaimportowane.sentences.length,
          language: jezykBazy,
        })

        if (jezykBazy === "de") {
          setDostepneJezyki({
            source: ["de", "pl"],
            target: ["de", "pl"],
          })
          setJezykZrodlowy("de")
          setJezykDocelowy("pl")
        } else if (jezykBazy === "en") {
          setDostepneJezyki({
            source: ["en", "pl"],
            target: ["en", "pl"],
          })
          setJezykZrodlowy("en")
          setJezykDocelowy("pl")
        }

        setStatusWgrywania({
          success: true,
          message: `Zaimportowano bazę danych: ${zaimportowane.name} (${zaimportowane.words.length} słów, ${zaimportowane.sentences.length} zdań)`,
        })

        setTimeout(() => setStatusWgrywania(null), 5000)
      } catch (error) {
        console.error(error)
        setStatusWgrywania({
          success: false,
          message: "Błąd importu. Sprawdź format pliku.",
        })

        setTimeout(() => setStatusWgrywania(null), 5000)
      }
    }

    czytnik.readAsText(plik)
    event.target.value = ""
  }, [])

  const wyczyscWlasnaBaze = useCallback(() => {
    usunWlasnaBaze()
    setUzyjWlasnejBazy(false)
    setInfoWlasnejBazy(null)

    setDostepneJezyki({
      source: ["de", "pl", "en"],
      target: ["de", "pl", "en"],
    })
    setJezykZrodlowy("de")
    setJezykDocelowy("pl")

    setStatusWgrywania({
      success: true,
      message: "Własna baza danych została usunięta",
    })

    setTimeout(() => setStatusWgrywania(null), 5000)
  }, [])

  const dostepneSlowa = useMemo(
    () => (uzyjWlasnejBazy && infoWlasnejBazy ? infoWlasnejBazy.words : calkowitaIloscSlow),
    [uzyjWlasnejBazy, infoWlasnejBazy, calkowitaIloscSlow],
  )

  const dostepneZdania = useMemo(
    () => (uzyjWlasnejBazy && infoWlasnejBazy ? infoWlasnejBazy.sentences : calkowitaIloscZdan),
    [uzyjWlasnejBazy, infoWlasnejBazy, calkowitaIloscZdan],
  )

  useEffect(() => {
    if (iloscSlow > dostepneSlowa && dostepneSlowa > 0) {
      setIloscSlow(dostepneSlowa)
    }

    if (iloscZdan > dostepneZdania && dostepneZdania > 0) {
      setIloscZdan(dostepneZdania)
    }
  }, [dostepneSlowa, dostepneZdania, iloscSlow, iloscZdan])

  const hasSentences = useMemo(
    () => (uzyjWlasnejBazy && infoWlasnejBazy ? infoWlasnejBazy.sentences > 0 : true),
    [uzyjWlasnejBazy, infoWlasnejBazy],
  )

  if (!zamontowany) {
    return (
      <div className="container max-w-4xl mx-auto py-10 px-4 flex items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Sparkles className="h-12 w-12 mx-auto mb-4 text-brand-cyan animate-pulse" />
          <p className="text-lg">Ładowanie...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="main-background"></div>
      <div className="bg-pattern fixed inset-0 z-[-1]"></div>

      <motion.div
        className="container max-w-6xl mx-auto py-10 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero section */}
        <motion.div
          className="text-center mb-16"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className=" p-3 rounded-full inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" width="96" height="97" viewBox="0 0 159 158" fill="none">
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
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl font-bold mb-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Swift<span className="text-brand-magenta">.app</span>
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Popraw swoje umiejętności językowe dzięki interaktywnym quizom. Ćwicz słowa, zdania lub ich kombinację w
            różnych językach.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Button
              className={`px-6 py-6 text-lg ${activeTab === "quiz" ? "bg-brand-cyan text-white" : "bg-brand-cyan text-white"}`}
              onClick={() => setActiveTab("quiz")}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Rozpocznij Quiz
            </Button>

            <Button
              variant="outline"
              className={`px-6 py-6 text-lg ${activeTab === "settings" ? "border-2 border-brand-magenta" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="mr-2 h-5 w-5" />
              Ustawienia
            </Button>
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === "quiz" ? (
            <motion.div
              key="quiz-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid gap-8"
              style={{ gridTemplateColumns: hasSentences ? "repeat(3, minmax(0, 1fr))" : "repeat(2, minmax(0, 1fr))" }}
            >
              <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                <div className="bg-white dark:bg-black rounded-xl overflow-hidden border-t-4 border-brand-cyan card-shadow h-full">
                  <Link
                    href={`/quiz/words?count=${iloscSlow}&source=${jezykZrodlowy}&target=${jezykDocelowy}&custom=${uzyjWlasnejBazy ? "1" : "0"}&type=${typTestu}`}
                    className="block h-full"
                  >
                    <div className="p-8 flex flex-col items-center text-center h-full">
                      <motion.div className="floating mb-6 icon-bg-cyan p-4 rounded-full">
                        <BookOpen className="h-16 w-16 text-brand-cyan" />
                      </motion.div>
                      <h2 className="text-2xl font-bold mb-4">Quiz ze słowami</h2>
                      <p className="text-muted-foreground mb-6">
                        Ćwicz {iloscSlow} słów i rozwijaj swoje słownictwo w wybranym języku
                      </p>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-auto">
                        <Button className="bg-brand-cyan hover:bg-brand-cyan/90 text-white gap-2 text-lg px-6 btn-hover-effect">
                          Rozpocznij
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </Link>
                </div>
              </motion.div>

              {hasSentences && (
                <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                  <div className="bg-white dark:bg-black rounded-xl overflow-hidden border-t-4 border-brand-magenta card-shadow h-full">
                    <Link
                      href={`/quiz/sentences?count=${iloscZdan}&source=${jezykZrodlowy}&target=${jezykDocelowy}&custom=${uzyjWlasnejBazy ? "1" : "0"}&type=${typTestu}`}
                      className="block h-full"
                    >
                      <div className="p-8 flex flex-col items-center text-center h-full">
                        <motion.div className="floating-slow mb-6 icon-bg-magenta p-4 rounded-full">
                          <MessageSquare className="h-16 w-16 text-brand-magenta" />
                        </motion.div>
                        <h2 className="text-2xl font-bold mb-4">Quiz ze zdaniami</h2>
                        <p className="text-muted-foreground mb-6">
                          Ćwicz {iloscZdan} zdań i popraw swoją znajomość gramatyki
                        </p>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-auto">
                          <Button className="bg-brand-magenta hover:bg-brand-magenta/90 text-white gap-2 text-lg px-6 btn-hover-effect">
                            Rozpocznij
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </div>
                    </Link>
                  </div>
                </motion.div>
              )}

              {hasSentences && (
                <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                  <div className="bg-white dark:bg-black rounded-xl overflow-hidden border-t-4 border-brand-purple card-shadow h-full">
                    <Link
                      href={`/quiz/combined?wordCount=${iloscSlow}&sentenceCount=${iloscZdan}&source=${jezykZrodlowy}&target=${jezykDocelowy}&custom=${uzyjWlasnejBazy ? "1" : "0"}&type=${typTestu}`}
                      className="block h-full"
                    >
                      <div className="p-8 flex flex-col items-center text-center h-full">
                        <motion.div className="floating-fast mb-6 icon-bg-purple p-4 rounded-full">
                          <Shuffle className="h-16 w-16 text-brand-purple" />
                        </motion.div>
                        <h2 className="text-2xl font-bold mb-4">Quiz mieszany</h2>
                        <p className="text-muted-foreground mb-6">
                          Mieszanka {iloscSlow} słów i {iloscZdan} zdań w losowej kolejności
                        </p>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-auto">
                          <Button className="bg-brand-purple hover:bg-brand-purple/90 text-white gap-2 text-lg px-6 btn-hover-effect">
                            Rozpocznij
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </div>
                    </Link>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="settings-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Database settings */}
              <div className="bg-white dark:bg-black rounded-xl p-8 card-shadow">
                <motion.div
                  className="flex items-center mb-6"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Database className="h-6 w-6 mr-3 text-brand-blue" />
                  <h2 className="text-2xl font-bold">Źródło danych</h2>
                </motion.div>

                <div className="space-y-6">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-3">
                      <Switch
                        id="database-switch"
                        checked={uzyjWlasnejBazy}
                        onCheckedChange={setUzyjWlasnejBazy}
                        disabled={!czyIstniejeWlasnaBazaFunc()}
                        className="data-[state=checked]:bg-brand-cyan"
                      />
                      <Label htmlFor="database-switch" className="text-lg flex items-center gap-2">
                        {uzyjWlasnejBazy ? "Własna baza danych" : "Wbudowana baza danych"}
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground ml-10">
                      {uzyjWlasnejBazy
                        ? `Używasz własnej bazy: ${infoWlasnejBazy?.name || "Niestandardowa"} (${infoWlasnejBazy?.words || 0} słów, ${infoWlasnejBazy?.sentences || 0} zdań, język: ${infoWlasnejBazy?.language === "de" ? "niemiecki" : "angielski"})`
                        : "Używasz domyślnej bazy danych aplikacji"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                          <Button variant="outline" className="gap-2 border-brand-cyan text-brand-cyan">
                            <Upload className="h-4 w-4" />
                            Importuj bazę danych
                          </Button>
                        </motion.div>
                      </DialogTrigger>
                      <DialogContent className="bg-white dark:bg-black">
                        <DialogHeader>
                          <DialogTitle>Importuj własną bazę danych</DialogTitle>
                          <DialogDescription>
                            Wybierz plik JSON z bazą danych wyeksportowaną z kreatora bazy danych.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <p className="text-sm text-muted-foreground">
                            Zaimportowanie nowej bazy danych zastąpi poprzednią własną bazę, jeśli taka istnieje.
                          </p>
                          <div className="flex gap-2 items-center">
                            <label htmlFor="import-json" className="cursor-pointer flex-1">
                              <Button
                                variant="outline"
                                className="w-full gap-2 border-brand-cyan text-brand-cyan"
                                asChild
                              >
                                <span>
                                  <Upload className="h-4 w-4" />
                                  Wybierz plik JSON
                                </span>
                              </Button>
                              <input
                                id="import-json"
                                type="file"
                                accept=".json"
                                className="sr-only"
                                onChange={obslugaImportuBazy}
                              />
                            </label>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Zamknij</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Button variant="outline" className="gap-2 border-brand-magenta text-brand-magenta" asChild>
                        <Link href="/creator">
                          <Settings className="h-4 w-4" />
                          Kreator bazy danych
                        </Link>
                      </Button>
                    </motion.div>

                    {uzyjWlasnejBazy && (
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button
                          variant="outline"
                          className="gap-2 border-red-500 text-red-500"
                          onClick={wyczyscWlasnaBaze}
                        >
                          <Trash2 className="h-4 w-4" />
                          Usuń własną bazę
                        </Button>
                      </motion.div>
                    )}
                  </div>

                  <AnimatePresence>
                    {statusWgrywania && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert
                          className={
                            statusWgrywania.success
                              ? "bg-green-50 dark:bg-green-950/20 border-green-200"
                              : "bg-red-50 dark:bg-red-950/20 border-red-200"
                          }
                        >
                          <AlertDescription>{statusWgrywania.message}</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Quiz settings */}
              <div className="bg-white dark:bg-black rounded-xl p-8 card-shadow">
                <motion.div
                  className="flex items-center mb-6"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Settings className="h-6 w-6 mr-3 text-brand-magenta" />
                  <h2 className="text-2xl font-bold">Ustawienia quizu</h2>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="space-y-3"
                  >
                    <Label htmlFor="wordCount" className="text-lg block">
                      Liczba pytań ze słowami:
                    </Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="wordCount"
                        type="number"
                        min={1}
                        max={dostepneSlowa}
                        value={iloscSlow}
                        onChange={(e) =>
                          setIloscSlow(Math.min(dostepneSlowa, Math.max(1, Number.parseInt(e.target.value) || 1)))
                        }
                        className="w-24 text-lg"
                      />
                      <span className="text-muted-foreground">(max: {dostepneSlowa})</span>
                    </div>
                  </motion.div>

                  {hasSentences && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className="space-y-3"
                    >
                      <Label htmlFor="sentenceCount" className="text-lg block">
                        Liczba pytań ze zdaniami:
                      </Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="sentenceCount"
                          type="number"
                          min={1}
                          max={dostepneZdania}
                          value={iloscZdan}
                          onChange={(e) =>
                            setIloscZdan(Math.min(dostepneZdania, Math.max(1, Number.parseInt(e.target.value) || 1)))
                          }
                          className="w-24 text-lg"
                        />
                        <span className="text-muted-foreground">(max: {dostepneZdania})</span>
                      </div>
                    </motion.div>
                  )}
                </div>

                <motion.div
                  className="mb-8"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <Label className="text-lg mb-3 block">Wybierz języki:</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="source-language" className="text-base block">
                        Język źródłowy:
                      </Label>
                      <Select
                        value={jezykZrodlowy}
                        onValueChange={(value) => setJezykZrodlowy(value as "de" | "pl" | "en")}
                      >
                        <SelectTrigger id="source-language" className="text-base">
                          <SelectValue placeholder="Wybierz język źródłowy" />
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

                    <div className="space-y-2">
                      <Label htmlFor="target-language" className="text-base block">
                        Język docelowy:
                      </Label>
                      <Select
                        value={jezykDocelowy}
                        onValueChange={(value) => setJezykDocelowy(value as "de" | "pl" | "en")}
                      >
                        <SelectTrigger id="target-language" className="text-base">
                          <SelectValue placeholder="Wybierz język docelowy" />
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
                  <p className="text-sm text-muted-foreground mt-2">
                    {getLanguageName(jezykZrodlowy)} → {getLanguageName(jezykDocelowy)}
                  </p>
                </motion.div>

                <motion.div
                  className="mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label className="text-lg mb-3 block">Typ testu:</Label>
                  <RadioGroup
                    value={typTestu}
                    onValueChange={(value) => setTypTestu(value as "wpisywanie" | "prawdaFalsz" | "wybor" | "mieszany")}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(0, 246, 255, 0.05)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className="flex items-center space-x-3 border rounded-md p-4 cursor-pointer"
                    >
                      <RadioGroupItem value="wpisywanie" id="wpisywanie" className="text-brand-cyan" />
                      <Label htmlFor="wpisywanie" className="flex items-center gap-3 cursor-pointer">
                        <CheckSquare className="h-5 w-5 text-brand-cyan" />
                        <div>
                          <div className="font-medium">Wpisywanie odpowiedzi</div>
                          <p className="text-sm text-muted-foreground">Wpisuj tłumaczenia samodzielnie</p>
                        </div>
                      </Label>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 0, 153, 0.05)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className="flex items-center space-x-3 border rounded-md p-4 cursor-pointer"
                    >
                      <RadioGroupItem value="prawdaFalsz" id="prawdaFalsz" className="text-brand-magenta" />
                      <Label htmlFor="prawdaFalsz" className="flex items-center gap-3 cursor-pointer">
                        <ToggleLeft className="h-5 w-5 text-brand-magenta" />
                        <div>
                          <div className="font-medium">Prawda/Fałsz</div>
                          <p className="text-sm text-muted-foreground">Oceń czy tłumaczenie jest poprawne</p>
                        </div>
                      </Label>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(26, 0, 255, 0.05)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className="flex items-center space-x-3 border rounded-md p-4 cursor-pointer"
                    >
                      <RadioGroupItem value="wybor" id="wybor" className="text-brand-blue" />
                      <Label htmlFor="wybor" className="flex items-center gap-3 cursor-pointer">
                        <ListChecks className="h-5 w-5 text-brand-blue" />
                        <div>
                          <div className="font-medium">Wybór odpowiedzi</div>
                          <p className="text-sm text-muted-foreground">Wybierz poprawne tłumaczenie z listy</p>
                        </div>
                      </Label>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(136, 0, 255, 0.05)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className="flex items-center space-x-3 border rounded-md p-4 cursor-pointer"
                    >
                      <RadioGroupItem value="mieszany" id="mieszany" className="text-brand-purple" />
                      <Label htmlFor="mieszany" className="flex items-center gap-3 cursor-pointer">
                        <Shuffle className="h-5 w-5 text-brand-purple" />
                        <div>
                          <div className="font-medium">Mieszany</div>
                          <p className="text-sm text-muted-foreground">Różne typy pytań w jednym teście</p>
                        </div>
                      </Label>
                    </motion.div>
                  </RadioGroup>
                </motion.div>

                <motion.div
                  className="mt-6 text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <p>
                    Dostępne słowa: {dostepneSlowa} {hasSentences && `| Dostępne zdania: ${dostepneZdania}`}
                  </p>
                  <p className="mt-1">
                    {typTestu === "wpisywanie"
                      ? "Wszystkie odpowiedzi muszą być wpisane ręcznie dla lepszej nauki."
                      : typTestu === "prawdaFalsz"
                        ? "Oceń czy pokazane tłumaczenie jest poprawne."
                        : typTestu === "wybor"
                          ? "Wybierz poprawne tłumaczenie spośród kilku opcji."
                          : "Różne typy pytań dla bardziej efektywnej nauki."}
                  </p>
                </motion.div>

                <motion.div
                  className="mt-8 flex justify-end"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    className="bg-brand-magenta hover:bg-brand-magenta/90 text-white gap-2 text-lg px-8 py-6 btn-hover-effect"
                    onClick={() => setActiveTab("quiz")}
                  >
                    Zapisz i wróć do quizu
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

