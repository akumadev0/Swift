"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, BookOpen, Download, Edit, MessageSquare, Plus, Save, Trash2, Upload } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { WordItem, SentenceItem } from "@/lib/quiz-data"

// Update the BazaDanych type to include language information
type BazaDanych = {
  words: WordItem[]
  sentences: SentenceItem[]
  name: string
  author: string
  description: string
  dateCreated: string
  language?: "de" | "en"
}

type EdytowanyElement = {
  type: "word" | "sentence"
  index: number
} | null

export default function CreatorPage() {
  // Add language selection at the top of the component
  const [wybranyJezyk, setWybranyJezyk] = useState<"de" | "en">("de")

  const [nazwaBazy, setNazwaBazy] = useState("Moja baza quizów")
  const [autorBazy, setAutorBazy] = useState("")
  const [opisBazy, setOpisBazy] = useState("")

  const [slowa, setSlowa] = useState<WordItem[]>([])
  const [noweSlowo, setNoweSlowo] = useState<Partial<WordItem>>({
    germanWord: "",
    polishTranslation: "",
    englishTranslation: "",
    category: "nouns",
    difficulty: "easy",
  })

  const [zdania, setZdania] = useState<SentenceItem[]>([])
  const [noweZdanie, setNoweZdanie] = useState<Partial<SentenceItem>>({
    germanSentence: "",
    polishTranslation: "",
    englishTranslation: "",
    category: "daily life",
    difficulty: "easy",
  })

  const [aktywnaZakladka, setAktywnaZakladka] = useState("words")
  const [edytowanyElement, setEdytowanyElement] = useState<EdytowanyElement>(null)
  const [pokazPotwierdzenie, setPokazPotwierdzenie] = useState(false)
  const [komunikat, setKomunikat] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Update the validation in dodajSlowo function
  const dodajSlowo = () => {
    if (wybranyJezyk === "de" && (!noweSlowo.germanWord || !noweSlowo.polishTranslation)) {
      setKomunikat({
        type: "error",
        message: "Słowo niemieckie i tłumaczenie polskie są wymagane.",
      })
      return
    }

    if (wybranyJezyk === "en" && (!noweSlowo.englishTranslation || !noweSlowo.polishTranslation)) {
      setKomunikat({
        type: "error",
        message: "Słowo angielskie i tłumaczenie polskie są wymagane.",
      })
      return
    }

    const elementSlowo: WordItem = {
      id: Date.now(),
      germanWord: wybranyJezyk === "de" ? noweSlowo.germanWord! : "",
      polishTranslation: noweSlowo.polishTranslation!,
      englishTranslation: wybranyJezyk === "en" ? noweSlowo.englishTranslation! : "",
      category: noweSlowo.category || "nouns",
      difficulty: (noweSlowo.difficulty as "easy" | "medium" | "hard") || "easy",
    }

    setSlowa([...slowa, elementSlowo])
    setNoweSlowo({
      germanWord: "",
      polishTranslation: "",
      englishTranslation: "",
      category: noweSlowo.category,
      difficulty: noweSlowo.difficulty,
    })

    setKomunikat({
      type: "success",
      message: `Dodano słowo: ${wybranyJezyk === "de" ? elementSlowo.germanWord : elementSlowo.englishTranslation}`,
    })

    setTimeout(() => setKomunikat(null), 3000)
  }

  // Update the validation in dodajZdanie function
  const dodajZdanie = () => {
    if (wybranyJezyk === "de" && (!noweZdanie.germanSentence || !noweZdanie.polishTranslation)) {
      setKomunikat({
        type: "error",
        message: "Zdanie niemieckie i tłumaczenie polskie są wymagane.",
      })
      return
    }

    if (wybranyJezyk === "en" && (!noweZdanie.englishTranslation || !noweZdanie.polishTranslation)) {
      setKomunikat({
        type: "error",
        message: "Zdanie angielskie i tłumaczenie polskie są wymagane.",
      })
      return
    }

    const elementZdanie: SentenceItem = {
      id: Date.now(),
      germanSentence: wybranyJezyk === "de" ? noweZdanie.germanSentence! : "",
      polishTranslation: noweZdanie.polishTranslation!,
      englishTranslation: wybranyJezyk === "en" ? noweZdanie.englishTranslation! : "",
      category: noweZdanie.category || "daily life",
      difficulty: (noweZdanie.difficulty as "easy" | "medium" | "hard") || "easy",
    }

    setZdania([...zdania, elementZdanie])
    setNoweZdanie({
      germanSentence: "",
      polishTranslation: "",
      englishTranslation: "",
      category: noweZdanie.category,
      difficulty: noweZdanie.difficulty,
    })

    setKomunikat({
      type: "success",
      message: "Dodano nowe zdanie",
    })

    setTimeout(() => setKomunikat(null), 3000)
  }

  const usunSlowo = (indeks: number) => {
    const zaktualizowaneSlowa = [...slowa]
    zaktualizowaneSlowa.splice(indeks, 1)
    setSlowa(zaktualizowaneSlowa)
  }

  const usunZdanie = (indeks: number) => {
    const zaktualizowaneZdania = [...zdania]
    zaktualizowaneZdania.splice(indeks, 1)
    setZdania(zaktualizowaneZdania)
  }

  // Update rozpocznijEdycjeSlowa to handle the selected language
  const rozpocznijEdycjeSlowa = (indeks: number) => {
    setEdytowanyElement({ type: "word", index: indeks })
    if (wybranyJezyk === "de") {
      setNoweSlowo({
        germanWord: slowa[indeks].germanWord,
        polishTranslation: slowa[indeks].polishTranslation,
        englishTranslation: "",
        category: slowa[indeks].category,
        difficulty: slowa[indeks].difficulty,
      })
    } else {
      setNoweSlowo({
        germanWord: "",
        polishTranslation: slowa[indeks].polishTranslation,
        englishTranslation: slowa[indeks].englishTranslation,
        category: slowa[indeks].category,
        difficulty: slowa[indeks].difficulty,
      })
    }
    setAktywnaZakladka("words")
  }

  // Update rozpocznijEdycjeZdania to handle the selected language
  const rozpocznijEdycjeZdania = (indeks: number) => {
    setEdytowanyElement({ type: "sentence", index: indeks })
    if (wybranyJezyk === "de") {
      setNoweZdanie({
        germanSentence: zdania[indeks].germanSentence,
        polishTranslation: zdania[indeks].polishTranslation,
        englishTranslation: "",
        category: zdania[indeks].category,
        difficulty: zdania[indeks].difficulty,
      })
    } else {
      setNoweZdanie({
        germanSentence: "",
        polishTranslation: zdania[indeks].polishTranslation,
        englishTranslation: zdania[indeks].englishTranslation,
        category: zdania[indeks].category,
        difficulty: zdania[indeks].difficulty,
      })
    }
    setAktywnaZakladka("sentences")
  }

  // Update the zapiszEdytowanyElement function
  const zapiszEdytowanyElement = () => {
    if (edytowanyElement?.type === "word") {
      if (wybranyJezyk === "de" && (!noweSlowo.germanWord || !noweSlowo.polishTranslation)) {
        setKomunikat({
          type: "error",
          message: "Słowo niemieckie i tłumaczenie polskie są wymagane.",
        })
        return
      }

      if (wybranyJezyk === "en" && (!noweSlowo.englishTranslation || !noweSlowo.polishTranslation)) {
        setKomunikat({
          type: "error",
          message: "Słowo angielskie i tłumaczenie polskie są wymagane.",
        })
        return
      }

      const zaktualizowaneSlowa = [...slowa]
      zaktualizowaneSlowa[edytowanyElement.index] = {
        ...zaktualizowaneSlowa[edytowanyElement.index],
        germanWord:
          wybranyJezyk === "de" ? noweSlowo.germanWord! : zaktualizowaneSlowa[edytowanyElement.index].germanWord,
        polishTranslation: noweSlowo.polishTranslation!,
        englishTranslation:
          wybranyJezyk === "en"
            ? noweSlowo.englishTranslation!
            : zaktualizowaneSlowa[edytowanyElement.index].englishTranslation,
        category: noweSlowo.category || "nouns",
        difficulty: (noweSlowo.difficulty as "easy" | "medium" | "hard") || "easy",
      }
      setSlowa(zaktualizowaneSlowa)
    } else if (edytowanyElement?.type === "sentence") {
      if (wybranyJezyk === "de" && (!noweZdanie.germanSentence || !noweZdanie.polishTranslation)) {
        setKomunikat({
          type: "error",
          message: "Zdanie niemieckie i tłumaczenie polskie są wymagane.",
        })
        return
      }

      if (wybranyJezyk === "en" && (!noweZdanie.englishTranslation || !noweZdanie.polishTranslation)) {
        setKomunikat({
          type: "error",
          message: "Zdanie angielskie i tłumaczenie polskie są wymagane.",
        })
        return
      }

      const zaktualizowaneZdania = [...zdania]
      zaktualizowaneZdania[edytowanyElement.index] = {
        ...zaktualizowaneZdania[edytowanyElement.index],
        germanSentence:
          wybranyJezyk === "de"
            ? noweZdanie.germanSentence!
            : zaktualizowaneZdania[edytowanyElement.index].germanSentence,
        polishTranslation: noweZdanie.polishTranslation!,
        englishTranslation:
          wybranyJezyk === "en"
            ? noweZdanie.englishTranslation!
            : zaktualizowaneZdania[edytowanyElement.index].englishTranslation,
        category: noweZdanie.category || "daily life",
        difficulty: (noweZdanie.difficulty as "easy" | "medium" | "hard") || "easy",
      }
      setZdania(zaktualizowaneZdania)
    }

    anulujEdycje()

    setKomunikat({
      type: "success",
      message: "Edycja zakończona pomyślnie",
    })

    setTimeout(() => setKomunikat(null), 3000)
  }

  // Update anulujEdycje to handle the selected language
  const anulujEdycje = () => {
    setEdytowanyElement(null)
    if (aktywnaZakladka === "words") {
      setNoweSlowo({
        germanWord: "",
        polishTranslation: "",
        englishTranslation: "",
        category: "nouns",
        difficulty: "easy",
      })
    } else {
      setNoweZdanie({
        germanSentence: "",
        polishTranslation: "",
        englishTranslation: "",
        category: "daily life",
        difficulty: "easy",
      })
    }
  }

  // Update the metadata in the exported database
  const eksportujBaze = () => {
    if (slowa.length === 0 && zdania.length === 0) {
      setKomunikat({
        type: "error",
        message: "Baza danych jest pusta. Dodaj co najmniej jedno słowo lub zdanie.",
      })
      return
    }

    const bazaDanych: BazaDanych = {
      words: slowa,
      sentences: zdania,
      name: nazwaBazy || "Moja baza quizów",
      author: autorBazy || "Nieznany",
      description: opisBazy || "",
      dateCreated: new Date().toISOString(),
      language: wybranyJezyk, // Add language information to the database
    }

    const jsonString = JSON.stringify(bazaDanych, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `${nazwaBazy.toLowerCase().replace(/\s+/g, "-")}-${wybranyJezyk}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setKomunikat({
      type: "success",
      message: "Baza danych została wyeksportowana pomyślnie",
    })

    setTimeout(() => setKomunikat(null), 3000)
  }

  // Update the import function to handle the language information
  const importujBaze = (event: React.ChangeEvent<HTMLInputElement>) => {
    const pliki = event.target.files
    if (!pliki || pliki.length === 0) return

    const plik = pliki[0]
    const czytnik = new FileReader()

    czytnik.onload = (e) => {
      try {
        const zawartosc = e.target?.result as string
        const zaimportowane = JSON.parse(zawartosc) as BazaDanych & { language?: "de" | "en" }

        if (
          !zaimportowane.words ||
          !Array.isArray(zaimportowane.words) ||
          !zaimportowane.sentences ||
          !Array.isArray(zaimportowane.sentences)
        ) {
          throw new Error("Nieprawidłowy format pliku")
        }

        // Set the language based on the imported database
        if (zaimportowane.language) {
          setWybranyJezyk(zaimportowane.language)
        } else {
          // Try to detect language based on content
          const hasGerman = zaimportowane.words.some((word) => word.germanWord && word.germanWord.trim() !== "")
          const hasEnglish = zaimportowane.words.some(
            (word) => word.englishTranslation && word.englishTranslation.trim() !== "",
          )

          if (hasGerman && !hasEnglish) {
            setWybranyJezyk("de")
          } else if (hasEnglish && !hasGerman) {
            setWybranyJezyk("en")
          }
          // If both or none, keep current selection
        }

        if (window.confirm("Importowanie zastąpi wszystkie aktualne dane. Czy kontynuować?")) {
          setSlowa(zaimportowane.words)
          setZdania(zaimportowane.sentences)
          setNazwaBazy(zaimportowane.name || "Moja baza quizów")
          setAutorBazy(zaimportowane.author || "")
          setOpisBazy(zaimportowane.description || "")

          setKomunikat({
            type: "success",
            message: `Zaimportowano bazę danych: ${zaimportowane.words.length} słów i ${zaimportowane.sentences.length} zdań`,
          })
        }
      } catch (error) {
        console.error(error)
        setKomunikat({
          type: "error",
          message: "Błąd importu. Sprawdź format pliku.",
        })
      }
    }

    czytnik.readAsText(plik)

    event.target.value = ""
  }

  const resetujBaze = () => {
    setSlowa([])
    setZdania([])
    setNazwaBazy("Moja baza quizów")
    setAutorBazy("")
    setOpisBazy("")
    setPokazPotwierdzenie(false)

    setKomunikat({
      type: "success",
      message: "Baza danych została zresetowana",
    })

    setTimeout(() => setKomunikat(null), 3000)
  }

  return (
    <div className="container max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">Kreator bazy quizów</h1>
      <p className="text-muted-foreground mb-8">
        Stwórz własną bazę słów i zdań do nauki języków. Możesz ją wyeksportować i wykorzystać w quizach.
      </p>

      {/* Update the card header section to include language selection */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Metadane bazy</CardTitle>
          <CardDescription>Podstawowe informacje o tworzonej bazie danych</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="databaseName">Nazwa bazy danych</Label>
              <Input
                id="databaseName"
                value={nazwaBazy}
                onChange={(e) => setNazwaBazy(e.target.value)}
                placeholder="Np. Słownictwo do egzaminu B1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="databaseAuthor">Autor</Label>
              <Input
                id="databaseAuthor"
                value={autorBazy}
                onChange={(e) => setAutorBazy(e.target.value)}
                placeholder="Twoje imię (opcjonalnie)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language-select">Język do nauki</Label>
              <RadioGroup
                value={wybranyJezyk}
                onValueChange={(value: "de" | "en") => setWybranyJezyk(value)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="de" id="german-lang" />
                  <Label htmlFor="german-lang">Niemiecki</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="en" id="english-lang" />
                  <Label htmlFor="english-lang">Angielski</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="databaseDescription">Opis bazy danych</Label>
            <Textarea
              id="databaseDescription"
              value={opisBazy}
              onChange={(e) => setOpisBazy(e.target.value)}
              placeholder="Krótki opis zawartości bazy danych (opcjonalnie)"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between flex-wrap gap-2">
          <div className="flex gap-2">
            <Button onClick={eksportujBaze} className="gap-2" disabled={slowa.length === 0 && zdania.length === 0}>
              <Download className="h-4 w-4" />
              Eksportuj bazę danych
            </Button>

            <label htmlFor="import-json" className="cursor-pointer">
              <Button variant="outline" className="gap-2" asChild>
                <span>
                  <Upload className="h-4 w-4" />
                  Importuj bazę danych
                </span>
              </Button>
              <input id="import-json" type="file" accept=".json" className="sr-only" onChange={importujBaze} />
            </label>
          </div>

          <Dialog open={pokazPotwierdzenie} onOpenChange={setPokazPotwierdzenie}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Resetuj bazę
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Potwierdź reset</DialogTitle>
                <DialogDescription>
                  Ta operacja usunie wszystkie słowa i zdania z bazy danych. Operacja jest nieodwracalna.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPokazPotwierdzenie(false)}>
                  Anuluj
                </Button>
                <Button variant="destructive" onClick={resetujBaze}>
                  Tak, resetuj bazę
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      {komunikat && (
        <Alert
          className={`mb-4 ${komunikat.type === "success" ? "bg-green-50 dark:bg-green-950/20 border-green-200" : "bg-red-50 dark:bg-red-950/20 border-red-200"}`}
        >
          <AlertCircle className={`h-4 w-4 ${komunikat.type === "success" ? "text-green-500" : "text-red-500"}`} />
          <AlertDescription>{komunikat.message}</AlertDescription>
        </Alert>
      )}

      <Tabs value={aktywnaZakladka} onValueChange={setAktywnaZakladka} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="words" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Słowa ({slowa.length})
          </TabsTrigger>
          <TabsTrigger value="sentences" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Zdania ({zdania.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="words" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{edytowanyElement?.type === "word" ? "Edytuj słowo" : "Dodaj nowe słowo"}</CardTitle>
              <CardDescription>
                {edytowanyElement?.type === "word"
                  ? "Edytuj istniejące słowo w bazie danych"
                  : "Wprowadź słowo niemieckie i jego tłumaczenia"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Update the word form to adapt based on selected language */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="foreignWord">{wybranyJezyk === "de" ? "Słowo niemieckie" : "Słowo angielskie"}</Label>
                  <Input
                    id="foreignWord"
                    value={wybranyJezyk === "de" ? noweSlowo.germanWord || "" : noweSlowo.englishTranslation || ""}
                    onChange={(e) => {
                      if (wybranyJezyk === "de") {
                        setNoweSlowo({ ...noweSlowo, germanWord: e.target.value, englishTranslation: "" })
                      } else {
                        setNoweSlowo({ ...noweSlowo, englishTranslation: e.target.value, germanWord: "" })
                      }
                    }}
                    placeholder={wybranyJezyk === "de" ? "Np. Haus" : "Np. house"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="polishWord">Tłumaczenie polskie</Label>
                  <Input
                    id="polishWord"
                    value={noweSlowo.polishTranslation || ""}
                    onChange={(e) => setNoweSlowo({ ...noweSlowo, polishTranslation: e.target.value })}
                    placeholder="Np. dom"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wordCategory">Kategoria</Label>
                  <Input
                    id="wordCategory"
                    value={noweSlowo.category || ""}
                    onChange={(e) => setNoweSlowo({ ...noweSlowo, category: e.target.value })}
                    placeholder="Np. nouns"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Poziom trudności</Label>
                  <RadioGroup
                    value={noweSlowo.difficulty || "easy"}
                    onValueChange={(value) =>
                      setNoweSlowo({ ...noweSlowo, difficulty: value as "easy" | "medium" | "hard" })
                    }
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="easy" id="easy-word" />
                      <Label htmlFor="easy-word">Łatwy</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium-word" />
                      <Label htmlFor="medium-word">Średni</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hard" id="hard-word" />
                      <Label htmlFor="hard-word">Trudny</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              {edytowanyElement?.type === "word" ? (
                <>
                  <Button variant="outline" onClick={anulujEdycje}>
                    Anuluj
                  </Button>
                  <Button onClick={zapiszEdytowanyElement} className="gap-2">
                    <Save className="h-4 w-4" />
                    Zapisz zmiany
                  </Button>
                </>
              ) : (
                <Button onClick={dodajSlowo} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Dodaj słowo
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Update the word list table to show only relevant languages */}
          {slowa.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Lista słów ({slowa.length})</CardTitle>
                <CardDescription>Wszystkie dodane słowa w bazie danych</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{wybranyJezyk === "de" ? "Niemiecki" : "Angielski"}</TableHead>
                        <TableHead>Polski</TableHead>
                        <TableHead>Kategoria</TableHead>
                        <TableHead>Trudność</TableHead>
                        <TableHead className="w-[100px]">Akcje</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {slowa.map((slowo, indeks) => (
                        <TableRow key={slowo.id}>
                          <TableCell className="font-medium">
                            {wybranyJezyk === "de" ? slowo.germanWord : slowo.englishTranslation}
                          </TableCell>
                          <TableCell>{slowo.polishTranslation}</TableCell>
                          <TableCell>{slowo.category}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full text-xs bg-muted">
                              {slowo.difficulty === "easy"
                                ? "łatwy"
                                : slowo.difficulty === "medium"
                                  ? "średni"
                                  : "trudny"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" onClick={() => rozpocznijEdycjeSlowa(indeks)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => usunSlowo(indeks)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  Brak dodanych słów. Użyj formularza powyżej, aby dodać słowa do bazy danych.
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sentences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{edytowanyElement?.type === "sentence" ? "Edytuj zdanie" : "Dodaj nowe zdanie"}</CardTitle>
              <CardDescription>
                {edytowanyElement?.type === "sentence"
                  ? "Edytuj istniejące zdanie w bazie danych"
                  : "Wprowadź zdanie niemieckie i jego tłumaczenia"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Update the sentence form to adapt based on selected language */}
              <div className="space-y-2">
                <Label htmlFor="foreignSentence">
                  {wybranyJezyk === "de" ? "Zdanie niemieckie" : "Zdanie angielskie"}
                </Label>
                <Textarea
                  id="foreignSentence"
                  value={wybranyJezyk === "de" ? noweZdanie.germanSentence || "" : noweZdanie.englishTranslation || ""}
                  onChange={(e) => {
                    if (wybranyJezyk === "de") {
                      setNoweZdanie({ ...noweZdanie, germanSentence: e.target.value, englishTranslation: "" })
                    } else {
                      setNoweZdanie({ ...noweZdanie, englishTranslation: e.target.value, germanSentence: "" })
                    }
                  }}
                  placeholder={wybranyJezyk === "de" ? "Np. Ich gehe zur Schule." : "Np. I am going to school."}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="polishSentence">Tłumaczenie polskie</Label>
                <Textarea
                  id="polishSentence"
                  value={noweZdanie.polishTranslation || ""}
                  onChange={(e) => setNoweZdanie({ ...noweZdanie, polishTranslation: e.target.value })}
                  placeholder="Np. Idę do szkoły."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sentenceCategory">Kategoria</Label>
                  <Input
                    id="sentenceCategory"
                    value={noweZdanie.category || ""}
                    onChange={(e) => setNoweZdanie({ ...noweZdanie, category: e.target.value })}
                    placeholder="Np. daily life"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Poziom trudności</Label>
                  <RadioGroup
                    value={noweZdanie.difficulty || "easy"}
                    onValueChange={(value) =>
                      setNoweZdanie({ ...noweZdanie, difficulty: value as "easy" | "medium" | "hard" })
                    }
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="easy" id="easy-sentence" />
                      <Label htmlFor="easy-sentence">Łatwy</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium-sentence" />
                      <Label htmlFor="medium-sentence">Średni</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hard" id="hard-sentence" />
                      <Label htmlFor="hard-sentence">Trudny</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              {edytowanyElement?.type === "sentence" ? (
                <>
                  <Button variant="outline" onClick={anulujEdycje}>
                    Anuluj
                  </Button>
                  <Button onClick={zapiszEdytowanyElement} className="gap-2">
                    <Save className="h-4 w-4" />
                    Zapisz zmiany
                  </Button>
                </>
              ) : (
                <Button onClick={dodajZdanie} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Dodaj zdanie
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Update the sentence list table to show only relevant languages */}
          {zdania.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Lista zdań ({zdania.length})</CardTitle>
                <CardDescription>Wszystkie dodane zdania w bazie danych</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{wybranyJezyk === "de" ? "Niemiecki" : "Angielski"}</TableHead>
                        <TableHead>Polski</TableHead>
                        <TableHead>Kategoria</TableHead>
                        <TableHead>Trudność</TableHead>
                        <TableHead className="w-[100px]">Akcje</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {zdania.map((zdanie, indeks) => (
                        <TableRow key={zdanie.id}>
                          <TableCell className="font-medium max-w-xs truncate">
                            {wybranyJezyk === "de" ? zdanie.germanSentence : zdanie.englishTranslation}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{zdanie.polishTranslation}</TableCell>
                          <TableCell>{zdanie.category}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full text-xs bg-muted">
                              {zdanie.difficulty === "easy"
                                ? "łatwy"
                                : zdanie.difficulty === "medium"
                                  ? "średni"
                                  : "trudny"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" onClick={() => rozpocznijEdycjeZdania(indeks)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => usunZdanie(indeks)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  Brak dodanych zdań. Użyj formularza powyżej, aby dodać zdania do bazy danych.
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

