"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Eye, EyeOff } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { getRandomSentences } from "@/lib/quiz-data"
import { pobierzLosoweWlasneZdania } from "@/lib/custom-database"
import { ExitQuizDialog } from "@/components/exit-dialog"
import { saveQuizResult } from "@/lib/quiz-storage"

export default function SentencesQuiz() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ilosc = Number.parseInt(searchParams?.get("count") || "5")
  const kierunek = searchParams?.get("direction") || "de-to-pl"
  const uzyjWlasnejBazy = searchParams?.get("custom") === "1"
  const czyNiemieckiDoPolskiego = kierunek === "de-to-pl"

  const [indeksPytania, setIndeksPytania] = useState(0)
  const [odpowiedzUzytkownika, setOdpowiedzUzytkownika] = useState("")
  const [czyOdpowiedziano, setCzyOdpowiedziano] = useState(false)
  const [czyPoprawnie, setCzyPoprawnie] = useState(false)
  const [wynik, setWynik] = useState(0)
  const [pytania, setPytania] = useState([])
  const [quizZakonczony, setQuizZakonczony] = useState(false)
  const [pokazOdpowiedz, setPokazOdpowiedz] = useState(false)
  const [czasStartu, setCzasStartu] = useState<number | null>(null)
  const [czasKonca, setCzasKonca] = useState<number | null>(null)

  useEffect(() => {
    if (uzyjWlasnejBazy) {
      setPytania(pobierzLosoweWlasneZdania(ilosc))
    } else {
      setPytania(getRandomSentences(ilosc))
    }
    setCzasStartu(Date.now())
  }, [ilosc, uzyjWlasnejBazy])

  const aktualnePytanie = pytania[indeksPytania]

  const sprawdzOdpowiedz = () => {
    if (!odpowiedzUzytkownika.trim()) return

    let poprawna = false

    if (czyNiemieckiDoPolskiego) {
      const odpowiedzMala = odpowiedzUzytkownika.toLowerCase().trim()
      const poprawnaOdpowiedzMala = aktualnePytanie?.polishTranslation.toLowerCase()

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
    } else {
      const odpowiedzMala = odpowiedzUzytkownika.toLowerCase().trim()
      const poprawnaOdpowiedzMala = aktualnePytanie?.germanSentence.toLowerCase()

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
    if (uzyjWlasnejBazy) {
      setPytania(pobierzLosoweWlasneZdania(ilosc))
    } else {
      setPytania(getRandomSentences(ilosc))
    }
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
        type: "sentences",
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
            <CardTitle className="text-center">Wyniki quizu ze zdaniami</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-6xl font-bold mb-4">
              {wynik}/{pytania.length}
            </div>
            <Progress value={(wynik / pytania.length) * 100} className="h-3 mb-6" />
            <p className="mb-6">
              {wynik === pytania.length
                ? "Doskonale! Twoje umiejętności tłumaczenia zdań są świetne!"
                : wynik > pytania.length / 2
                  ? "Dobra robota! Kontynuuj ćwiczenia, aby poprawić swoje tłumaczenia zdań."
                  : "Kontynuuj ćwiczenia, aby poprawić swoje umiejętności zdań."}
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

  const wyswietlanyTekst = czyNiemieckiDoPolskiego
    ? aktualnePytanie?.germanSentence
    : aktualnePytanie?.polishTranslation

  const poprawnaOdpowiedz = czyNiemieckiDoPolskiego
    ? aktualnePytanie?.polishTranslation
    : aktualnePytanie?.germanSentence

  const tekstPlaceholder = czyNiemieckiDoPolskiego ? "Wpisz polskie tłumaczenie..." : "Wpisz niemieckie zdanie..."

  return (
    <div className="container max-w-md mx-auto py-10 px-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            Zdanie {indeksPytania + 1} z {pytania.length}
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
          <div className="flex justify-between items-center mb-2">
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
          <CardTitle className="text-center text-xl">{wyswietlanyTekst}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={tekstPlaceholder}
            value={odpowiedzUzytkownika}
            onChange={(e) => setOdpowiedzUzytkownika(e.target.value)}
            disabled={czyOdpowiedziano}
            className="min-h-[100px]"
          />

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
                    <span>Dobra robota! Twoje tłumaczenie jest poprawne.</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span>Twoje tłumaczenie wymaga poprawy. Sprawdź poprawną odpowiedź.</span>
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
                {indeksPytania < pytania.length - 1 ? "Następne zdanie" : "Zobacz wyniki"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

