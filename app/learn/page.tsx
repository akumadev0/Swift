"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { germanWords, germanSentences, type WordItem, type SentenceItem } from "@/lib/quiz-data"
import { Search, SortAsc, SortDesc, BookOpen, MessageSquare } from "lucide-react"

export default function LearnPage() {
  // Words state
  const [words, setWords] = useState<WordItem[]>([])
  const [filteredWords, setFilteredWords] = useState<WordItem[]>([])
  const [wordSearchQuery, setWordSearchQuery] = useState("")
  const [wordSortField, setWordSortField] = useState<"germanWord" | "polishTranslation" | "category" | "difficulty">(
    "germanWord",
  )
  const [wordSortDirection, setWordSortDirection] = useState<"asc" | "desc">("asc")
  const [wordCategoryFilter, setWordCategoryFilter] = useState<string>("all")

  // Sentences state
  const [sentences, setSentences] = useState<SentenceItem[]>([])
  const [filteredSentences, setFilteredSentences] = useState<SentenceItem[]>([])
  const [sentenceSearchQuery, setSentenceSearchQuery] = useState("")
  const [sentenceSortField, setSentenceSortField] = useState<
    "germanSentence" | "polishTranslation" | "category" | "difficulty"
  >("germanSentence")
  const [sentenceSortDirection, setSentenceSortDirection] = useState<"asc" | "desc">("asc")
  const [sentenceCategoryFilter, setSentenceCategoryFilter] = useState<string>("all")

  // Get unique categories
  const wordCategories = ["all", ...new Set(germanWords.map((word) => word.category))]
  const sentenceCategories = ["all", ...new Set(germanSentences.map((sentence) => sentence.category))]

  useEffect(() => {
    setWords(germanWords)
    setSentences(germanSentences)
    setFilteredWords(germanWords)
    setFilteredSentences(germanSentences)
  }, [])

  // Filter and sort words
  useEffect(() => {
    let result = [...words]

    // Apply category filter
    if (wordCategoryFilter !== "all") {
      result = result.filter((word) => word.category === wordCategoryFilter)
    }

    // Apply search filter
    if (wordSearchQuery) {
      const query = wordSearchQuery.toLowerCase()
      result = result.filter(
        (word) => word.germanWord.toLowerCase().includes(query) || word.polishTranslation.toLowerCase().includes(query),
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      const fieldA = a[wordSortField].toLowerCase()
      const fieldB = b[wordSortField].toLowerCase()

      if (wordSortDirection === "asc") {
        return fieldA.localeCompare(fieldB)
      } else {
        return fieldB.localeCompare(fieldA)
      }
    })

    setFilteredWords(result)
  }, [words, wordSearchQuery, wordSortField, wordSortDirection, wordCategoryFilter])

  // Filter and sort sentences
  useEffect(() => {
    let result = [...sentences]

    // Apply category filter
    if (sentenceCategoryFilter !== "all") {
      result = result.filter((sentence) => sentence.category === sentenceCategoryFilter)
    }

    // Apply search filter
    if (sentenceSearchQuery) {
      const query = sentenceSearchQuery.toLowerCase()
      result = result.filter(
        (sentence) =>
          sentence.germanSentence.toLowerCase().includes(query) ||
          sentence.polishTranslation.toLowerCase().includes(query),
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      const fieldA = a[sentenceSortField].toLowerCase()
      const fieldB = b[sentenceSortField].toLowerCase()

      if (sentenceSortDirection === "asc") {
        return fieldA.localeCompare(fieldB)
      } else {
        return fieldB.localeCompare(fieldA)
      }
    })

    setFilteredSentences(result)
  }, [sentences, sentenceSearchQuery, sentenceSortField, sentenceSortDirection, sentenceCategoryFilter])

  const toggleWordSortDirection = () => {
    setWordSortDirection(wordSortDirection === "asc" ? "desc" : "asc")
  }

  const toggleSentenceSortDirection = () => {
    setSentenceSortDirection(sentenceSortDirection === "asc" ? "desc" : "asc")
  }

  return (
    <div className="container max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Materiały do nauki</h1>

      <Tabs defaultValue="words" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="words" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Słowa ({filteredWords.length})
          </TabsTrigger>
          <TabsTrigger value="sentences" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Zdania ({filteredSentences.length})
          </TabsTrigger>
        </TabsList>

        {/* Words Tab */}
        <TabsContent value="words">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Szukaj słów..."
                  className="pl-8"
                  value={wordSearchQuery}
                  onChange={(e) => setWordSearchQuery(e.target.value)}
                />
              </div>

              {/* Category filter */}
              <div>
                <Select value={wordCategoryFilter} onValueChange={setWordCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz kategorię" />
                  </SelectTrigger>
                  <SelectContent>
                    {wordCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "Wszystkie kategorie" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort options */}
              <div className="flex gap-2">
                <Select value={wordSortField} onValueChange={(value: any) => setWordSortField(value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Sortuj według" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="germanWord">Słowo niemieckie</SelectItem>
                    <SelectItem value="polishTranslation">Tłumaczenie polskie</SelectItem>
                    <SelectItem value="category">Kategoria</SelectItem>
                    <SelectItem value="difficulty">Trudność</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={toggleWordSortDirection}>
                  {wordSortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Words list */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWords.map((word) => (
                <Card key={word.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-lg">{word.germanWord}</div>
                      <div className="text-xs px-2 py-1 rounded-full bg-muted">
                        {word.difficulty === "easy" ? "łatwy" : word.difficulty === "medium" ? "średni" : "trudny"}
                      </div>
                    </div>
                    <div className="text-muted-foreground">{word.polishTranslation}</div>
                    <div className="mt-2 text-xs text-muted-foreground">Kategoria: {word.category}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredWords.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nie znaleziono słów pasujących do kryteriów wyszukiwania.
              </div>
            )}
          </div>
        </TabsContent>

        {/* Sentences Tab */}
        <TabsContent value="sentences">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Szukaj zdań..."
                  className="pl-8"
                  value={sentenceSearchQuery}
                  onChange={(e) => setSentenceSearchQuery(e.target.value)}
                />
              </div>

              {/* Category filter */}
              <div>
                <Select value={sentenceCategoryFilter} onValueChange={setSentenceCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz kategorię" />
                  </SelectTrigger>
                  <SelectContent>
                    {sentenceCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "Wszystkie kategorie" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort options */}
              <div className="flex gap-2">
                <Select value={sentenceSortField} onValueChange={(value: any) => setSentenceSortField(value)}>
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
                <Button variant="outline" size="icon" onClick={toggleSentenceSortDirection}>
                  {sentenceSortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Sentences list */}
            <div className="grid grid-cols-1 gap-4">
              {filteredSentences.map((sentence) => (
                <Card key={sentence.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">{sentence.germanSentence}</div>
                      <div className="text-xs px-2 py-1 rounded-full bg-muted ml-2 shrink-0">
                        {sentence.difficulty === "easy"
                          ? "łatwy"
                          : sentence.difficulty === "medium"
                            ? "średni"
                            : "trudny"}
                      </div>
                    </div>
                    <div className="text-muted-foreground">{sentence.polishTranslation}</div>
                    <div className="mt-2 text-xs text-muted-foreground">Kategoria: {sentence.category}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredSentences.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nie znaleziono zdań pasujących do kryteriów wyszukiwania.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

