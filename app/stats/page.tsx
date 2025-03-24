"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getQuizStatistics, clearQuizResults, type QuizResult } from "@/lib/quiz-storage"
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { AlertTriangle, Award, BookOpen, Clock, MessageSquare, Shuffle, Trash2, TrendingUp } from "lucide-react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"

export default function StatsPage() {
  const [stats, setStats] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      const statistics = getQuizStatistics()
      setStats(statistics)
    }
  }, [])

  const handleClearStats = () => {
    if (window.confirm("Czy na pewno chcesz usunąć wszystkie statystyki? Ta operacja jest nieodwracalna.")) {
      clearQuizResults()
      setStats(getQuizStatistics())
    }
  }

  if (!mounted) {
    return <div className="container max-w-4xl mx-auto py-10 px-4">Ładowanie statystyk...</div>
  }

  if (!stats) {
    return <div className="container max-w-4xl mx-auto py-10 px-4">Ładowanie statystyk...</div>
  }

  // Format data for charts
  const typeData = [
    { name: "Słowa", value: stats.byType.words.count },
    { name: "Zdania", value: stats.byType.sentences.count },
    { name: "Mieszane", value: stats.byType.combined.count },
  ]

  const directionData = [
    { name: "Niemiecki → Polski", value: stats.byDirection["de-to-pl"].count },
    { name: "Polski → Niemiecki", value: stats.byDirection["pl-to-de"].count },
  ]

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"]

  const formatQuizType = (type: string) => {
    switch (type) {
      case "words":
        return "Słowa"
      case "sentences":
        return "Zdania"
      case "combined":
        return "Mieszane"
      default:
        return type
    }
  }

  const formatDirection = (direction: string) => {
    return direction === "de-to-pl" ? "Niemiecki → Polski" : "Polski → Niemiecki"
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const getQuizTypeIcon = (type: string) => {
    switch (type) {
      case "words":
        return <BookOpen className="h-4 w-4" />
      case "sentences":
        return <MessageSquare className="h-4 w-4" />
      case "combined":
        return <Shuffle className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Twoje statystyki nauki</h1>
        {stats.totalQuizzes > 0 && (
          <Button variant="outline" size="sm" onClick={handleClearStats} className="gap-1">
            <Trash2 className="h-4 w-4" />
            Wyczyść statystyki
          </Button>
        )}
      </div>

      {stats.totalQuizzes === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Brak danych statystycznych
            </CardTitle>
            <CardDescription>Ukończ przynajmniej jeden quiz, aby zobaczyć swoje statystyki nauki.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Statystyki będą automatycznie zapisywane po każdym ukończonym quizie. Wróć tutaj później, aby śledzić
              swoje postępy.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ukończone quizy</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
                <p className="text-xs text-muted-foreground">Łącznie ukończonych quizów</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Średni wynik</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageScore.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Średni procent poprawnych odpowiedzi</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Słowa</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalWords}</div>
                <p className="text-xs text-muted-foreground">Przećwiczonych słów</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Zdania</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSentences}</div>
                <p className="text-xs text-muted-foreground">Przećwiczonych zdań</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Przegląd</TabsTrigger>
              <TabsTrigger value="charts">Wykresy</TabsTrigger>
              <TabsTrigger value="history">Historia</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Najlepsze wyniki</CardTitle>
                    <CardDescription>Twoje najlepsze osiągnięcia</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Najlepszy wynik</span>
                        <span className="text-sm font-bold">{stats.bestScore}%</span>
                      </div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Najgorszy wynik</span>
                        <span className="text-sm font-bold">{stats.worstScore}%</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <h4 className="text-sm font-medium mb-2">Według typu quizu</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm flex items-center gap-1">
                            <BookOpen className="h-3 w-3" /> Słowa
                          </span>
                          <span className="text-sm">
                            {stats.byType.words.count > 0
                              ? `${stats.byType.words.averageScore.toFixed(1)}% (${stats.byType.words.count})`
                              : "Brak danych"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" /> Zdania
                          </span>
                          <span className="text-sm">
                            {stats.byType.sentences.count > 0
                              ? `${stats.byType.sentences.averageScore.toFixed(1)}% (${stats.byType.sentences.count})`
                              : "Brak danych"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm flex items-center gap-1">
                            <Shuffle className="h-3 w-3" /> Mieszane
                          </span>
                          <span className="text-sm">
                            {stats.byType.combined.count > 0
                              ? `${stats.byType.combined.averageScore.toFixed(1)}% (${stats.byType.combined.count})`
                              : "Brak danych"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Kierunek tłumaczenia</CardTitle>
                    <CardDescription>Porównanie wyników według kierunku</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Niemiecki → Polski</span>
                        <span className="text-sm">
                          {stats.byDirection["de-to-pl"].count > 0
                            ? `${stats.byDirection["de-to-pl"].averageScore.toFixed(1)}% (${stats.byDirection["de-to-pl"].count})`
                            : "Brak danych"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Polski → Niemiecki</span>
                        <span className="text-sm">
                          {stats.byDirection["pl-to-de"].count > 0
                            ? `${stats.byDirection["pl-to-de"].averageScore.toFixed(1)}% (${stats.byDirection["pl-to-de"].count})`
                            : "Brak danych"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="charts" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Rozkład typów quizów</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={typeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {typeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Kierunek tłumaczenia</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={directionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {directionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Historia quizów</CardTitle>
                  <CardDescription>Ostatnie 10 ukończonych quizów</CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.recentResults.length > 0 ? (
                    <div className="space-y-4">
                      {stats.recentResults.map((result: QuizResult) => (
                        <div key={result.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              {getQuizTypeIcon(result.type)}
                              <span className="font-medium">{formatQuizType(result.type)}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(result.date), "d MMMM yyyy, HH:mm", { locale: pl })}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                              <div className="text-sm text-muted-foreground">Wynik</div>
                              <div className="font-medium">
                                {result.score}/{result.total} ({result.percentage}%)
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Kierunek</div>
                              <div className="font-medium">{formatDirection(result.direction)}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Czas</div>
                              <div className="font-medium flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDuration(result.duration)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">Brak historii quizów.</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

