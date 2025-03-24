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
import { getRandomCustomSentences } from "@/lib/custom-database"
import { ExitQuizDialog } from "@/components/exit-dialog"
import { saveQuizResult } from "@/lib/quiz-storage"

export default function SentencesQuiz() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const count = Number.parseInt(searchParams?.get("count") || "5")
  const direction = searchParams?.get("direction") || "de-to-pl"
  const useCustomDatabase = searchParams?.get("custom") === "1"
  const isGermanToPolish = direction === "de-to-pl"

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [questions, setQuestions] = useState([])
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)

  useEffect(() => {
    // Get random sentences based on database selection
    if (useCustomDatabase) {
      setQuestions(getRandomCustomSentences(count))
    } else {
      setQuestions(getRandomSentences(count))
    }
    // Start the timer when quiz begins
    setStartTime(Date.now())
  }, [count, useCustomDatabase])

  const currentQuestion = questions[currentQuestionIndex]

  const checkAnswer = () => {
    if (!userAnswer.trim()) return

    let correct = false

    if (isGermanToPolish) {
      // German to Polish - check if Polish answer is correct
      const userAnswerLower = userAnswer.toLowerCase().trim()
      const correctAnswerLower = currentQuestion?.polishTranslation.toLowerCase()

      // Check if the answer contains at least 60% of the words in the correct translation
      const correctWords = correctAnswerLower.split(/\s+/)
      const userWords = userAnswerLower.split(/\s+/)

      let matchCount = 0
      correctWords.forEach((word) => {
        if (userWords.some((userWord) => userWord === word || userWord.includes(word) || word.includes(userWord))) {
          matchCount++
        }
      })

      const matchPercentage = (matchCount / correctWords.length) * 100
      correct = matchPercentage >= 60
    } else {
      // Polish to German - check if German answer is correct
      const userAnswerLower = userAnswer.toLowerCase().trim()
      const correctAnswerLower = currentQuestion?.germanSentence.toLowerCase()

      // Check if the answer contains at least 60% of the words in the correct translation
      const correctWords = correctAnswerLower.split(/\s+/)
      const userWords = userAnswerLower.split(/\s+/)

      let matchCount = 0
      correctWords.forEach((word) => {
        if (userWords.some((userWord) => userWord === word || userWord.includes(word) || word.includes(userWord))) {
          matchCount++
        }
      })

      const matchPercentage = (matchCount / correctWords.length) * 100
      correct = matchPercentage >= 60
    }

    setIsCorrect(correct)
    setIsAnswered(true)

    if (correct) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setUserAnswer("")
      setIsAnswered(false)
      setShowAnswer(false)
    } else {
      setQuizCompleted(true)
      setEndTime(Date.now())
    }
  }

  const restartQuiz = () => {
    if (useCustomDatabase) {
      setQuestions(getRandomCustomSentences(count))
    } else {
      setQuestions(getRandomSentences(count))
    }
    setCurrentQuestionIndex(0)
    setUserAnswer("")
    setIsAnswered(false)
    setIsCorrect(false)
    setScore(0)
    setQuizCompleted(false)
    setShowAnswer(false)
    setStartTime(Date.now())
    setEndTime(null)
  }

  // Save quiz results to localStorage when completed
  useEffect(() => {
    if (quizCompleted && startTime && endTime) {
      const duration = Math.round((endTime - startTime) / 1000) // in seconds

      saveQuizResult({
        type: "sentences",
        direction: direction as "de-to-pl" | "pl-to-de",
        score,
        total: questions.length,
        percentage: Math.round((score / questions.length) * 100),
        duration,
      })
    }
  }, [quizCompleted, startTime, endTime, score, questions.length, direction])

  if (questions.length === 0) {
    return <div className="flex justify-center items-center min-h-[50vh]">Ładowanie quizu...</div>
  }

  if (quizCompleted) {
    return (
      <div className="container max-w-md mx-auto py-10 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Wyniki quizu ze zdaniami</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-6xl font-bold mb-4">
              {score}/{questions.length}
            </div>
            <Progress value={(score / questions.length) * 100} className="h-3 mb-6" />
            <p className="mb-6">
              {score === questions.length
                ? "Doskonale! Twoje umiejętności tłumaczenia zdań są świetne!"
                : score > questions.length / 2
                  ? "Dobra robota! Kontynuuj ćwiczenia, aby poprawić swoje tłumaczenia zdań."
                  : "Kontynuuj ćwiczenia, aby poprawić swoje umiejętności zdań."}
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={restartQuiz} className="gap-2">
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

  // Determine what to display and what to ask for based on direction
  const displayText = isGermanToPolish ? currentQuestion?.germanSentence : currentQuestion?.polishTranslation

  const correctAnswer = isGermanToPolish ? currentQuestion?.polishTranslation : currentQuestion?.germanSentence

  const placeholderText = isGermanToPolish ? "Wpisz polskie tłumaczenie..." : "Wpisz niemieckie zdanie..."

  return (
    <div className="container max-w-md mx-auto py-10 px-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            Zdanie {currentQuestionIndex + 1} z {questions.length}
          </span>
          <span className="text-sm font-medium">
            Wynik: {score}/{currentQuestionIndex}
          </span>
        </div>
        <Progress value={(currentQuestionIndex / questions.length) * 100} className="h-2" />
        <div className="flex justify-end mt-2">
          <ExitQuizDialog />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium px-2 py-1 bg-muted rounded-full">
              {isGermanToPolish ? "Niemiecki → Polski" : "Polski → Niemiecki"}
            </span>
            <span className="text-xs font-medium px-2 py-1 bg-muted rounded-full">
              {currentQuestion?.difficulty === "easy"
                ? "łatwy"
                : currentQuestion?.difficulty === "medium"
                  ? "średni"
                  : "trudny"}
            </span>
          </div>
          <CardTitle className="text-center text-xl">{displayText}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={placeholderText}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={isAnswered}
            className="min-h-[100px]"
          />

          {isAnswered && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Poprawna odpowiedź:</span>
                <Button variant="ghost" size="sm" onClick={() => setShowAnswer(!showAnswer)} className="h-8 px-2">
                  {showAnswer ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                  {showAnswer ? "Ukryj" : "Pokaż"}
                </Button>
              </div>
              {showAnswer && <div className="p-3 bg-muted rounded-md">{correctAnswer}</div>}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {isAnswered && (
            <Alert
              className={
                isCorrect
                  ? "bg-green-50 dark:bg-green-950/20 border-green-200"
                  : "bg-red-50 dark:bg-red-950/20 border-red-200"
              }
            >
              <AlertDescription className="flex items-center gap-2">
                {isCorrect ? (
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
            {!isAnswered ? (
              <Button onClick={checkAnswer} disabled={!userAnswer.trim()} className="w-full">
                Sprawdź odpowiedź
              </Button>
            ) : (
              <Button onClick={nextQuestion} className="w-full gap-1">
                {currentQuestionIndex < questions.length - 1 ? "Następne zdanie" : "Zobacz wyniki"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

