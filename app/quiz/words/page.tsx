"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Eye, EyeOff } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { getRandomWords, getWordInLanguage, getLanguageName } from "@/lib/quiz-data"
import { pobierzLosoweWlasneSlowa } from "@/lib/custom-database"
import { ExitQuizDialog } from "@/components/exit-dialog"
import { saveQuizResult } from "@/lib/quiz-storage"

export default function WordsQuiz() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ilosc = Number.parseInt(searchParams?.get("count") || "10")
  const jezykZrodlowy = searchParams?.get("source") || "de"
  const jezykDocelowy = searchParams?.get("target") || "pl"
  const uzyjWlasnejBazy = searchParams?.get("custom") === "1"
  const typTestu = searchParams?.get("type") || "wpisywanie"

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
  const [opcjeWyboru, setOpcjeWyboru] = useState<string[]>([])
  const [prawdaFalszOdpowiedz, setPrawdaFalszOdpowiedz] = useState<string | null>(null)

  useEffect(() => {
    // Pobierz losowe słowa na podstawie wybranej bazy danych
    const pobierzPytania = async () => {
      let pobranePytania = []
      if (uzyjWlasnejBazy) {
        pobranePytania = pobierzLosoweWlasneSlowa(ilosc)
      } else {
        pobranePytania = getRandomWords(ilosc)
      }

      // Jeśli typ testu to wybór lub mieszany, przygotuj opcje wyboru dla każdego pytania
      if (typTestu === "wybor" || typTestu === "mieszany") {
        pobranePytania = pobranePytania.map((pytanie) => {
          // Dodaj poprawną odpowiedź i 3 losowe niepoprawne
          const poprawnaOdpowiedz = getWordInLanguage(pytanie, jezykDocelowy)

          // Pobierz inne słowa jako niepoprawne odpowiedzi
          const innePytania = pobranePytania.filter((p) => p.id !== pytanie.id)
          const losoweNiepoprawne = innePytania
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map((p) => getWordInLanguage(p, jezykDocelowy))

          // Połącz i pomieszaj opcje
          const opcje = [poprawnaOdpowiedz, ...losoweNiepoprawne].sort(() => 0.5 - Math.random())

          return {
            ...pytanie,
            opcjeWyboru: opcje,
          }
        })
      }

      // Jeśli typ testu to prawda/fałsz lub mieszany, przygotuj odpowiedzi prawda/fałsz
      if (typTestu === "prawdaFalsz" || typTestu === "mieszany") {
        pobranePytania = pobranePytania.map((pytanie) => {
          // 50% szans na pokazanie poprawnej odpowiedzi
          const pokazPoprawna = Math.random() > 0.5

          let niepoprawnaOdpowiedz = ""
          if (!pokazPoprawna) {
            // Wybierz losowe inne pytanie dla niepoprawnej odpowiedzi
            const innePytania = pobranePytania.filter((p) => p.id !== pytanie.id)
            const losowePytanie = innePytania[Math.floor(Math.random() * innePytania.length)]
            niepoprawnaOdpowiedz = getWordInLanguage(losowePytanie, jezykDocelowy)
          }

          return {
            ...pytanie,
            pokazanaTlumaczenie: pokazPoprawna ? getWordInLanguage(pytanie, jezykDocelowy) : niepoprawnaOdpowiedz,
            czyPoprawnePolaczenie: pokazPoprawna,
          }
        })
      }

      setPytania(pobranePytania)
    }

    pobierzPytania()
    setCzasStartu(Date.now())
  }, [ilosc, uzyjWlasnejBazy, jezykZrodlowy, jezykDocelowy, typTestu])

  useEffect(() => {
    // Przygotuj opcje wyboru dla aktualnego pytania
    if (pytania.length > 0 && (typTestu === "wybor" || (typTestu === "mieszany" && indeksPytania % 3 === 1))) {
      const aktualnePytanie = pytania[indeksPytania]
      if (aktualnePytanie.opcjeWyboru) {
        setOpcjeWyboru(aktualnePytanie.opcjeWyboru)
      }
    }
  }, [indeksPytania, pytania, typTestu])

  const aktualnePytanie = pytania[indeksPytania]

  // Określ typ aktualnego pytania dla trybu mieszanego
  const aktualnyTypPytania =
    typTestu === "mieszany"
      ? indeksPytania % 3 === 0
        ? "wpisywanie"
        : indeksPytania % 3 === 1
          ? "wybor"
          : "prawdaFalsz"
      : typTestu

  const sprawdzOdpowiedz = () => {
    if (aktualnyTypPytania === "wpisywanie") {
      if (!odpowiedzUzytkownika.trim()) return

      const poprawna =
        odpowiedzUzytkownika.toLowerCase().trim() ===
        getWordInLanguage(aktualnePytanie, jezykDocelowy).toLowerCase().trim()

      setCzyPoprawnie(poprawna)
      setCzyOdpowiedziano(true)

      if (poprawna) {
        setWynik(wynik + 1)
      }
    } else if (aktualnyTypPytania === "wybor") {
      if (!odpowiedzUzytkownika) return

      const poprawnaOdpowiedz = getWordInLanguage(aktualnePytanie, jezykDocelowy)

      const poprawna = odpowiedzUzytkownika === poprawnaOdpowiedz

      setCzyPoprawnie(poprawna)
      setCzyOdpowiedziano(true)

      if (poprawna) {
        setWynik(wynik + 1)
      }
    } else if (aktualnyTypPytania === "prawdaFalsz") {
      if (!prawdaFalszOdpowiedz) return

      const poprawna =
        (prawdaFalszOdpowiedz === "true" && aktualnePytanie.czyPoprawnePolaczenie) ||
        (prawdaFalszOdpowiedz === "false" && !aktualnePytanie.czyPoprawnePolaczenie)

      setCzyPoprawnie(poprawna)
      setCzyOdpowiedziano(true)

      if (poprawna) {
        setWynik(wynik + 1)
      }
    }
  }

  const wybierzOpcje = (opcja: string) => {
    setOdpowiedzUzytkownika(opcja)
  }

  const wybierzPrawdaFalsz = (odpowiedz: string) => {
    setPrawdaFalszOdpowiedz(odpowiedz)
  }

  const nastepnePytanie = () => {
    if (indeksPytania < pytania.length - 1) {
      setIndeksPytania(indeksPytania + 1)
      setOdpowiedzUzytkownika("")
      setPrawdaFalszOdpowiedz(null)
      setCzyOdpowiedziano(false)
      setPokazOdpowiedz(false)
    } else {
      setQuizZakonczony(true)
      setCzasKonca(Date.now())
    }
  }

  const restartujQuiz = () => {
    if (uzyjWlasnejBazy) {
      setPytania(pobierzLosoweWlasneSlowa(ilosc))
    } else {
      setPytania(getRandomWords(ilosc))
    }
    setIndeksPytania(0)
    setOdpowiedzUzytkownika("")
    setPrawdaFalszOdpowiedz(null)
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
        type: "words",
        direction: `${jezykZrodlowy}-${jezykDocelowy}` as any,
        score: wynik,
        total: pytania.length,
        percentage: Math.round((wynik / pytania.length) * 100),
        duration: czas,
      })
    }
  }, [quizZakonczony, czasStartu, czasKonca, wynik, pytania.length, jezykZrodlowy, jezykDocelowy])

  if (pytania.length === 0) {
    return <div className="flex justify-center items-center min-h-[50vh]">Ładowanie quizu...</div>
  }

  if (quizZakonczony) {
    return (
      <div className="container max-w-md mx-auto py-10 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Wyniki quizu</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-6xl font-bold mb-4">
              {wynik}/{pytania.length}
            </div>
            <Progress value={(wynik / pytania.length) * 100} className="h-3 mb-6" />
            <p className="mb-6">
              {wynik === pytania.length
                ? "Doskonale! Wszystkie odpowiedzi są poprawne!"
                : wynik > pytania.length / 2
                  ? "Dobra robota! Kontynuuj ćwiczenia, aby dalej się doskonalić."
                  : "Kontynuuj ćwiczenia, aby poprawić swoje słownictwo."}
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

  const wyswietlanyTekst = getWordInLanguage(aktualnePytanie, jezykZrodlowy)
  const poprawnaOdpowiedz = getWordInLanguage(aktualnePytanie, jezykDocelowy)
  const tekstPlaceholder = `Wpisz tłumaczenie w języku ${getLanguageName(jezykDocelowy)}...`

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
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium px-2 py-1 bg-muted rounded-full">
              {getLanguageName(jezykZrodlowy)} → {getLanguageName(jezykDocelowy)}
            </span>
            <span className="text-xs font-medium px-2 py-1 bg-muted rounded-full">
              {aktualnePytanie?.difficulty === "easy"
                ? "łatwy"
                : aktualnePytanie?.difficulty === "medium"
                  ? "średni"
                  : "trudny"}
            </span>
          </div>
          <CardTitle className="text-center text-2xl">{wyswietlanyTekst}</CardTitle>

          {aktualnyTypPytania === "prawdaFalsz" && (
            <div className="mt-4 text-center">
              <p className="mb-2">Czy to poprawne tłumaczenie?</p>
              <div className="text-xl font-medium">{aktualnePytanie.pokazanaTlumaczenie}</div>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {aktualnyTypPytania === "wpisywanie" && (
            <div>
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
            </div>
          )}

          {aktualnyTypPytania === "wybor" && (
            <div className="space-y-2">
              {opcjeWyboru.map((opcja, indeks) => (
                <Button
                  key={indeks}
                  variant={odpowiedzUzytkownika === opcja ? "default" : "outline"}
                  className="w-full justify-start text-left"
                  onClick={() => wybierzOpcje(opcja)}
                  disabled={czyOdpowiedziano}
                >
                  {opcja}
                </Button>
              ))}
            </div>
          )}

          {aktualnyTypPytania === "prawdaFalsz" && (
            <div className="flex gap-2 justify-center">
              <Button
                variant={prawdaFalszOdpowiedz === "true" ? "default" : "outline"}
                onClick={() => wybierzPrawdaFalsz("true")}
                disabled={czyOdpowiedziano}
                className="w-1/2"
              >
                Prawda
              </Button>
              <Button
                variant={prawdaFalszOdpowiedz === "false" ? "default" : "outline"}
                onClick={() => wybierzPrawdaFalsz("false")}
                disabled={czyOdpowiedziano}
                className="w-1/2"
              >
                Fałsz
              </Button>
            </div>
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
              <Button
                onClick={sprawdzOdpowiedz}
                disabled={
                  (aktualnyTypPytania === "wpisywanie" && !odpowiedzUzytkownika.trim()) ||
                  (aktualnyTypPytania === "wybor" && !odpowiedzUzytkownika) ||
                  (aktualnyTypPytania === "prawdaFalsz" && !prawdaFalszOdpowiedz)
                }
                className="w-full"
              >
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

