"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Eye, EyeOff } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { getRandomWords, getRandomSentences } from "@/lib/quiz-data"
import { pobierzLosoweWlasneSlowa, pobierzLosoweWlasneZdania } from "@/lib/custom-database"
import { ExitQuizDialog } from "@/components/exit-dialog"
import { saveQuizResult } from "@/lib/quiz-storage"

type ElementQuizu = {
  type: "word" | "sentence"
  germanText: string
  polishText: string
  id: number
  category: string
  difficulty: "easy" | "medium" | "hard"
}

export default function CombinedQuiz() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const iloscSlow = Number.parseInt(searchParams?.get("wordCount") || "10")
  const iloscZdan = Number.parseInt(searchParams?.get("sentenceCount") || "5")
  const kierunek = searchParams?.get("direction") || "de-to-pl"
  const uzyjWlasnejBazy = searchParams?.get("custom") === "1"
  const czyNiemieckiDoPolskiego = kierunek === "de-to-pl"

  const [indeksPytania, setIndeksPytania] = useState(0)
  const [odpowiedzUzytkownika, setOdpowiedzUzytkownika] = useState("")
  const [czyOdpowiedziano, setCzyOdpowiedziano] = useState(false)
  const [czyPoprawnie, setCzyPoprawnie] = useState(false)
  const [wynik, setWynik] = useState(0)
  const [pytania, setPytania] = useState<ElementQuizu[]>([])
  const [quizZakonczony, setQuizZakonczony] = useState(false)
  const [pokazOdpowiedz, setPokazOdpowiedz] = useState(false)
  const [czasStartu, setCzasStartu] = useState<number | null>(null)
  const [czasKonca, setCzasKonca] = useState<number | null>(null)

  useEffect(() => {
    let slowa
    let zdania

    if (uzyjWlasnejBazy) {
      slowa = pobierzLosoweWlasneSlowa(iloscSlow).map((slowo) => ({
        type: "word" as const,
        germanText: slowo.germanWord,
        polishText: slowo.polishTranslation,
        id: slowo.id,
        category: slowo.category,
        difficulty: slowo.difficulty,
      }))

      zdania = pobierzLosoweWlasneZdania(iloscZdan).map((zdanie) => ({
        type: "sentence" as const,
        germanText: zdanie.germanSentence,
        polishText: zdanie.polishTranslation,
        id: zdanie.id,
        category: zdanie.category,
        difficulty: zdanie.difficulty,
      }))
    } else {
      slowa = getRandomWords(iloscSlow).map((slowo) => ({
        type: "word" as const,
        germanText: slowo.germanWord,
        polishText: slowo.polishTranslation,
        id: slowo.id,
        category: slowo.category,
        difficulty: slowo.difficulty,
      }))

      zdania = getRandomSentences(iloscZdan).map((zdanie) => ({
        type: "sentence" as const,
        germanText: zdanie.germanSentence,
        polishText: zdanie.polishTranslation,
        id: zdanie.id,
        category: zdanie.category,
        difficulty: zdanie.difficulty,
      }))
    }

    const polaczone = [...slowa, ...zdania].sort(() => 0.5 - Math.random())
    setPytania(polaczone)
    setCzasStartu(Date.now())
  }, [iloscSlow, iloscZdan, uzyjWlasnejBazy])

  const aktualnePytanie = pytania[indeksPytania]

  const sprawdzOdpowiedz = () => {
    if (!odpowiedzUzytkownika.trim()) return

    let poprawna = false

    if (aktualnePytanie?.type === "word") {
      if (czyNiemieckiDoPolskiego) {
        poprawna = odpowiedzUzytkownika.toLowerCase().trim() === aktualnePytanie.polishText.toLowerCase().trim()
      } else {
        poprawna = odpowiedzUzytkownika.toLowerCase().trim() === aktualnePytanie.germanText.toLowerCase().trim()
      }
    } else {
      const odpowiedzMala = odpowiedzUzytkownika.toLowerCase().trim()
      const poprawnaOdpowiedzMala = czyNiemieckiDoPolskiego
        ? aktualnePytanie?.polishText.toLowerCase()
        : aktualnePytanie?.germanText.toLowerCase()

      const poprawneSlowa = poprawnaOdpowiedzMala.split(/\s+/)
      const slowaUzytkownika = odpowiedzMala.split(/\s+/)

      let liczbaDopasowan = 0
      poprawneSlowa.forEach((slowo) => {
        if (
          slowaUzytkownika.some(
            (slowoUzytkownika) =>
              slowoUzytkownika === slowo || slowoUzytkownika.includes(slowo) || slowo.includes(slowoUzytkownika),
          )
        ) {
          liczbaDopasowan++
        }
      })

      const procentDopasowania = (liczbaDopasowan / poprawneSlowa.length) * 100
      poprawna = procentDopasowania >= 60
    }

    setCzyPoprawnie(poprawna)
    setCzyOdpowiedziano(true)

    if (poprawna) {
      setWynik(wynik + 1)
    }
  }

  const nastepnePytanie = () => {
    if (indeksPytania < pytania.length - 1) {
      setIndeksPytania(indeksPytania + 1)
      setOdpowiedzUzytkownika("")
      setCzyOdpowiedziano(false)
      setPokazOdpowiedz(false)
    } else {
      setQuizZakonczony(true)
      setCzasKonca(Date.now())
    }
  }

  const restartujQuiz = () => {
    let slowa
    let zdania

    if (uzyjWlasnejBazy) {
      slowa = pobierzLosoweWlasneSlowa(iloscSlow).map((slowo) => ({
        type: "word" as const,
        germanText: slowo.germanWord,
        polishText: slowo.polishTranslation,
        id: slowo.id,
        category: slowo.category,
        difficulty: slowo.difficulty,
      }))

      zdania = pobierzLosoweWlasneZdania(iloscZdan).map((zdanie) => ({
        type: "sentence" as const,
        germanText: zdanie.germanSentence,
        polishText: zdanie.polishTranslation,
        id: zdanie.id,
        category: zdanie.category,
        difficulty: zdanie.difficulty,
      }))
    } else {
      slowa = getRandomWords(iloscSlow).map((slowo) => ({
        type: "word" as const,
        germanText: slowo.germanWord,
        polishText: slowo.polishTranslation,
        id: slowo.id,
        category: slowo.category,
        difficulty: slowo.difficulty,
      }))

      zdania = getRandomSentences(iloscZdan).map((zdanie) => ({
        type: "sentence" as const,
        germanText: zdanie.germanSentence,
        polishText: zdanie.polishTranslation,
        id: zdanie.id,
        category: zdanie.category,
        difficulty: zdanie.difficulty,
      }))
    }

    const polaczone = [...slowa, ...zdania].sort(() => 0.5 - Math.random())
    setPytania(polaczone)

    setIndeksPytania(0)
    setOdpowiedzUzytkownika("")
    setCzyOdpowiedziano(false)
    setCzyPoprawnie(false)
    setWynik(0)
    setQuizZakonczony(false)
    setPokazOdpowiedz(false)
    setCzasStartu(Date.now())
    setCzasKonca(null)
  }

  useEffect(() => {
    if (quizZakonczony && czasStartu && czasKonca) {
      const czas = Math.round((czasKonca - czasStartu) / 1000)

      saveQuizResult({
        type: "combined",
        direction: kierunek as "de-to-pl" | "pl-to-de",
        score: wynik,
        total: pytania.length,
        percentage: Math.round((wynik / pytania.length) * 100),
        duration: czas,
      })
    }
  }, [quizZakonczony, czasStartu, czasKonca, wynik, pytania.length, kierunek])

  if (pytania.length === 0) {
    return <div className="flex justify-center items-center min-h-[50vh]">Ładowanie quizu...</div>
  }

  if (quizZakonczony) {
    return (
      <div className="container max-w-md mx-auto py-10 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Wyniki quizu mieszanego</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-6xl font-bold mb-4">
              {wynik}/{pytania.length}
            </div>
            <Progress value={(wynik / pytania.length) * 100} className="h-3 mb-6" />
            <p className="mb-6">
              {wynik === pytania.length
                ? "Doskonale! Opanowałeś zarówno słowa, jak i zdania!"
                : wynik > pytania.length / 2
                  ? "Dobra robota! Kontynuuj ćwiczenia, aby dalej się doskonalić."
                  : "Kontynuuj ćwiczenia, aby poprawić swoje umiejętności języka niemieckiego."}
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={restartujQuiz} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Rozpocznij ponownie
              </Button>
              <Button onClick={() => router.push("/")} variant="outline">
                Powrót do strony głównej
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const wyswietlanyTekst = czyNiemieckiDoPolskiego ? aktualnePytanie?.germanText : aktualnePytanie?.polishText

  const poprawnaOdpowiedz = czyNiemieckiDoPolskiego ? aktualnePytanie?.polishText : aktualnePytanie?.germanText

  const tekstPlaceholder = czyNiemieckiDoPolskiego ? "Wpisz polskie tłumaczenie..." : "Wpisz niemieckie tłumaczenie..."

  return (
    <div className="container max-w-md mx-auto py-10 px-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            Pytanie {indeksPytania + 1} z {pytania.length}
          </span>
          <span className="text-sm font-medium">
            Wynik: {wynik}/{indeksPytania}
          </span>
        </div>
        <Progress value={(indeksPytania / pytania.length) * 100} className="h-2" />
        <div className="flex justify-end mt-2">
          <ExitQuizDialog />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium px-2 py-1 bg-muted rounded-full">
              {aktualnePytanie?.type === "word" ? "Słowo" : "Zdanie"}
            </span>
            <span className="text-xs font-medium px-2 py-1 bg-muted rounded-full">
              {czyNiemieckiDoPolskiego ? "Niemiecki → Polski" : "Polski → Niemiecki"}
            </span>
            <span className="text-xs font-medium px-2 py-1 bg-muted rounded-full">
              {aktualnePytanie?.difficulty === "easy"
                ? "łatwy"
                : aktualnePytanie?.difficulty === "medium"
                  ? "średni"
                  : "trudny"}
            </span>
          </div>
          <CardTitle className="text-center text-xl mt-2">{wyswietlanyTekst}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {aktualnePytanie?.type === "word" ? (
            <Input
              type="text"
              placeholder={tekstPlaceholder}
              value={odpowiedzUzytkownika}
              onChange={(e) => setOdpowiedzUzytkownika(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !czyOdpowiedziano) {
                  sprawdzOdpowiedz()
                }
              }}
              disabled={czyOdpowiedziano}
              className="w-full"
            />
          ) : (
            <Textarea
              placeholder={tekstPlaceholder}
              value={odpowiedzUzytkownika}
              onChange={(e) => setOdpowiedzUzytkownika(e.target.value)}
              disabled={czyOdpowiedziano}
              className="min-h-[100px]"
            />
          )}

          {czyOdpowiedziano && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Poprawna odpowiedź:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPokazOdpowiedz(!pokazOdpowiedz)}
                  className="h-8 px-2"
                >
                  {pokazOdpowiedz ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                  {pokazOdpowiedz ? "Ukryj" : "Pokaż"}
                </Button>
              </div>
              {pokazOdpowiedz && <div className="p-3 bg-muted rounded-md">{poprawnaOdpowiedz}</div>}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {czyOdpowiedziano && (
            <Alert
              className={
                czyPoprawnie
                  ? "bg-green-50 dark:bg-green-950/20 border-green-200"
                  : "bg-red-50 dark:bg-red-950/20 border-red-200"
              }
            >
              <AlertDescription className="flex items-center gap-2">
                {czyPoprawnie ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Poprawnie! Świetna robota.</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span>Niepoprawnie. Sprawdź poprawną odpowiedź.</span>
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex w-full justify-between">
            {!czyOdpowiedziano ? (
              <Button onClick={sprawdzOdpowiedz} disabled={!odpowiedzUzytkownika.trim()} className="w-full">
                Sprawdź odpowiedź
              </Button>
            ) : (
              <Button onClick={nastepnePytanie} className="w-full gap-1">
                {indeksPytania < pytania.length - 1 ? "Następne" : "Zobacz wyniki"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

