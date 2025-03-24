"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { BookOpen, MessageSquare, Settings, Shuffle, ArrowLeftRight, Database, Upload, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { germanWords, germanSentences } from "@/lib/quiz-data"
import { Switch } from "@/components/ui/switch"
import { hasCustomDatabase, getCustomDatabase, saveCustomDatabase, clearCustomDatabase } from "@/lib/custom-database"
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

export default function Home() {
  const [wordCount, setWordCount] = useState(10)
  const [sentenceCount, setSentenceCount] = useState(5)
  const [translationDirection, setTranslationDirection] = useState<"de-to-pl" | "pl-to-de">("de-to-pl")
  const [useCustomDatabase, setUseCustomDatabase] = useState(false)
  const [customDatabaseInfo, setCustomDatabaseInfo] = useState<{
    name: string
    words: number
    sentences: number
  } | null>(null)
  const [uploadStatus, setUploadStatus] = useState<{ success: boolean; message: string } | null>(null)
  const [mounted, setMounted] = useState(false)

  // Total items counts
  const totalWords = germanWords.length
  const totalSentences = germanSentences.length

  // Check for custom database on component mount
  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      const hasCustom = hasCustomDatabase()
      setUseCustomDatabase(hasCustom)

      if (hasCustom) {
        const customDB = getCustomDatabase()
        if (customDB) {
          setCustomDatabaseInfo({
            name: customDB.name,
            words: customDB.words.length,
            sentences: customDB.sentences.length,
          })
        }
      }
    }
  }, [])

  // Handle custom database import from JSON file
  const handleImportDatabase = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const imported = JSON.parse(content)

        // Validate structure
        if (
          !imported.words ||
          !Array.isArray(imported.words) ||
          !imported.sentences ||
          !Array.isArray(imported.sentences)
        ) {
          throw new Error("Nieprawidłowy format pliku")
        }

        // Save to localStorage
        saveCustomDatabase(imported)

        // Update UI
        setUseCustomDatabase(true)
        setCustomDatabaseInfo({
          name: imported.name,
          words: imported.words.length,
          sentences: imported.sentences.length,
        })

        setUploadStatus({
          success: true,
          message: `Zaimportowano bazę danych: ${imported.name} (${imported.words.length} słów, ${imported.sentences.length} zdań)`,
        })

        setTimeout(() => setUploadStatus(null), 5000)
      } catch (error) {
        console.error(error)
        setUploadStatus({
          success: false,
          message: "Błąd importu. Sprawdź format pliku.",
        })

        setTimeout(() => setUploadStatus(null), 5000)
      }
    }

    reader.readAsText(file)

    // Clear the file input so the same file can be selected again
    event.target.value = ""
  }

  // Clear custom database
  const clearCustomDB = () => {
    clearCustomDatabase()
    setUseCustomDatabase(false)
    setCustomDatabaseInfo(null)
    setUploadStatus({
      success: true,
      message: "Własna baza danych została usunięta",
    })

    setTimeout(() => setUploadStatus(null), 5000)
  }

  // Calculate actual available items based on database selection
  const availableWords = useCustomDatabase && customDatabaseInfo ? customDatabaseInfo.words : totalWords
  const availableSentences = useCustomDatabase && customDatabaseInfo ? customDatabaseInfo.sentences : totalSentences

  // Ensure counts are within available limits
  useEffect(() => {
    if (wordCount > availableWords && availableWords > 0) {
      setWordCount(availableWords)
    }

    if (sentenceCount > availableSentences && availableSentences > 0) {
      setSentenceCount(availableSentences)
    }
  }, [availableWords, availableSentences, useCustomDatabase])

  if (!mounted) {
    return <div className="container max-w-4xl mx-auto py-10 px-4">Ładowanie...</div>
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">Swift <sub className="text-[12px]">AkumaDev</sub></h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Popraw swoje umiejętności języka niemieckiego dzięki konfigurowalnym quizom. Ćwicz słowa, zdania lub ich
          kombinację.
        </p>
      </div>

      {/* Database selection */}
      <Card className="mb-8 p-6 border rounded-lg bg-muted/30">
        <div className="flex items-center mb-4">
          <Database className="h-5 w-5 mr-2 text-primary" />
          <h2 className="text-xl font-semibold">Źródło danych</h2>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <Switch
                id="database-switch"
                checked={useCustomDatabase}
                onCheckedChange={setUseCustomDatabase}
                disabled={!hasCustomDatabase()}
              />
              <Label htmlFor="database-switch" className="flex items-center gap-2">
                {useCustomDatabase ? "Własna baza danych" : "Wbudowana baza danych"}
              </Label>
            </div>
            <p className="text-xs text-muted-foreground ml-7">
              {useCustomDatabase
                ? `Używasz własnej bazy: ${customDatabaseInfo?.name || "Niestandardowa"} (${customDatabaseInfo?.words || 0} słów, ${customDatabaseInfo?.sentences || 0} zdań)`
                : "Używasz domyślnej bazy danych aplikacji"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Importuj bazę danych
                </Button>
              </DialogTrigger>
              <DialogContent>
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
                      <Button variant="outline" className="w-full gap-2" asChild>
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
                        onChange={handleImportDatabase}
                      />
                    </label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {}}>
                    Zamknij
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="gap-2" asChild>
              <Link href="/creator">
                <Settings className="h-4 w-4" />
                Kreator bazy danych
              </Link>
            </Button>

            {useCustomDatabase && (
              <Button variant="outline" className="gap-2" onClick={clearCustomDB}>
                <Trash2 className="h-4 w-4" />
                Usuń własną bazę
              </Button>
            )}
          </div>

          {uploadStatus && (
            <Alert
              className={
                uploadStatus.success
                  ? "bg-green-50 dark:bg-green-950/20 border-green-200"
                  : "bg-red-50 dark:bg-red-950/20 border-red-200"
              }
            >
              <AlertDescription>{uploadStatus.message}</AlertDescription>
            </Alert>
          )}
        </div>
      </Card>

      <div className="mb-8 p-6 border rounded-lg bg-muted/30">
        <div className="flex items-center mb-4">
          <Settings className="h-5 w-5 mr-2 text-primary" />
          <h2 className="text-xl font-semibold">Ustawienia quizu</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="wordCount" className="mb-2 block">
              Liczba pytań ze słowami:
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="wordCount"
                type="number"
                min={1}
                max={availableWords}
                value={wordCount}
                onChange={(e) =>
                  setWordCount(Math.min(availableWords, Math.max(1, Number.parseInt(e.target.value) || 1)))
                }
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">(max: {availableWords})</span>
            </div>
          </div>

          <div>
            <Label htmlFor="sentenceCount" className="mb-2 block">
              Liczba pytań ze zdaniami:
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="sentenceCount"
                type="number"
                min={1}
                max={availableSentences}
                value={sentenceCount}
                onChange={(e) =>
                  setSentenceCount(Math.min(availableSentences, Math.max(1, Number.parseInt(e.target.value) || 1)))
                }
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">(max: {availableSentences})</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center space-x-2">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <Switch
                id="direction-switch"
                checked={translationDirection === "pl-to-de"}
                onCheckedChange={(checked) => setTranslationDirection(checked ? "pl-to-de" : "de-to-pl")}
              />
              <Label htmlFor="direction-switch" className="flex items-center gap-2">
                <ArrowLeftRight className="h-4 w-4" />
                <span>{translationDirection === "de-to-pl" ? "Niemiecki → Polski" : "Polski → Niemiecki"}</span>
              </Label>
            </div>
            <p className="text-xs text-muted-foreground ml-7">
              {translationDirection === "de-to-pl"
                ? "Zobaczysz niemieckie słowa/zdania i będziesz tłumaczyć na polski"
                : "Zobaczysz polskie tłumaczenia i będziesz tłumaczyć na niemiecki"}
            </p>
          </div>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            Dostępne słowa: {availableWords} | Dostępne zdania: {availableSentences}
          </p>
          <p className="mt-1">Wszystkie odpowiedzi muszą być wpisane ręcznie dla lepszej nauki.</p>
          <p className="mt-1">Ostatnia aktualizacja 24.03.2025 r.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Link
              href={`/quiz/words?count=${wordCount}&direction=${translationDirection}&custom=${useCustomDatabase ? "1" : "0"}`}
            >
              <div className="p-6 flex flex-col items-center text-center hover:bg-muted/50 transition-colors h-full">
                <BookOpen className="h-12 w-12 mb-4 text-primary" />
                <h2 className="text-xl font-semibold mb-2">Quiz ze słowami</h2>
                <p className="text-muted-foreground">Ćwicz {wordCount} słów</p>
                <Button className="mt-4">Rozpocznij quiz ze słowami</Button>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Link
              href={`/quiz/sentences?count=${sentenceCount}&direction=${translationDirection}&custom=${useCustomDatabase ? "1" : "0"}`}
            >
              <div className="p-6 flex flex-col items-center text-center hover:bg-muted/50 transition-colors h-full">
                <MessageSquare className="h-12 w-12 mb-4 text-primary" />
                <h2 className="text-xl font-semibold mb-2">Quiz ze zdaniami</h2>
                <p className="text-muted-foreground">Ćwicz {sentenceCount} zdań</p>
                <Button className="mt-4">Rozpocznij quiz ze zdaniami</Button>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Link
              href={`/quiz/combined?wordCount=${wordCount}&sentenceCount=${sentenceCount}&direction=${translationDirection}&custom=${useCustomDatabase ? "1" : "0"}`}
            >
              <div className="p-6 flex flex-col items-center text-center hover:bg-muted/50 transition-colors h-full">
                <Shuffle className="h-12 w-12 mb-4 text-primary" />
                <h2 className="text-xl font-semibold mb-2">Quiz mieszany</h2>
                <p className="text-muted-foreground">
                  Mieszanka {wordCount} słów i {sentenceCount} zdań w losowej kolejności
                </p>
                <Button className="mt-4">Rozpocznij quiz mieszany</Button>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

